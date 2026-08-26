#!/usr/bin/env python3
"""Dry-run Airtable Managed Cases -> public.cases.

Reads scripts/copy/p13-case-copy-map.csv and prints what a copy would do.
Never writes rows to Supabase or Airtable. Default (only) mode is dry-run.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

MAP_PATH = Path(__file__).with_name("p13-case-copy-map.csv")
DEFAULT_TABLE_ID = "tblK7Ia5xz9KwGFA9"
SPOT_CHECK_REC = "recgfSkF5th6wsKbS"
SPOT_CHECK_CASE = "C-01985"
SKIPPED_FILE_FIELDS = 75
REQUIRED_ENV = (
    "AIRTABLE_TOKEN",
    "AIRTABLE_BASE_ID",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
)

WRITE_FLAGS = {"--apply", "--write", "--commit", "--upsert", "--insert"}


def die(message: str, code: int = 2) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(code)


def load_map(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        die(f"empty map: {path}")
    required = {"dest_column", "airtable_field_id", "airtable_name", "airtable_type", "notes"}
    missing = required - set(rows[0].keys())
    if missing:
        die(f"map missing columns: {sorted(missing)}")
    return rows


def classify(map_rows: list[dict[str, str]]) -> tuple[dict[str, str], list[dict[str, str]], list[dict[str, str]]]:
    """Return match-key row, stored copy rows, formula rows (do not fill)."""
    match = None
    stored: list[dict[str, str]] = []
    formulas: list[dict[str, str]] = []
    for row in map_rows:
        if row["dest_column"] == "airtable_id":
            match = row
            continue
        if row["airtable_type"] == "formula":
            formulas.append(row)
        else:
            stored.append(row)
    if match is None:
        die("map is missing airtable_id match key")
    return match, stored, formulas


def print_map_stats(map_rows: list[dict[str, str]], stored: list[dict[str, str]], formulas: list[dict[str, str]]) -> None:
    print("P13 Managed Cases copy (DRY-RUN, no writes)")
    print(f"Map file: {MAP_PATH}")
    print(f"Map rows: {len(map_rows)} (airtable_id + {len(map_rows) - 1} dest field columns)")
    print(f"Mapped fields (copy stored value as-is): {len(stored)}")
    print(f"Skipped formula (dest stays nullable until P37): {len(formulas)}")
    print(f"Skipped file/attachment (not dest columns; files table later): {SKIPPED_FILE_FIELDS}")
    print("Match key: airtable_id = Airtable record id")
    print("Blanks stay blank. Dollars and court names are never invented.")


def airtable_get(url: str, token: str) -> dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        die(f"Airtable HTTP {exc.code}: {body[:400]}")
    except urllib.error.URLError as exc:
        die(f"Airtable request failed: {exc}")
    raise AssertionError("unreachable")


def fetch_airtable_records(token: str, base_id: str, table_id: str, field_ids: list[str]) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    offset = None
    # Airtable allows up to 100 fields per request via repeated fields[];
    # request only mapped stored fields plus Case Number for sample labels.
    while True:
        params: list[tuple[str, str]] = [
            ("pageSize", "100"),
            ("returnFieldsByFieldId", "true"),
        ]
        for field_id in field_ids:
            params.append(("fields[]", field_id))
        if offset:
            params.append(("offset", offset))
        url = (
            f"https://api.airtable.com/v0/{urllib.parse.quote(base_id)}/"
            f"{urllib.parse.quote(table_id)}?{urllib.parse.urlencode(params)}"
        )
        payload = airtable_get(url, token)
        records.extend(payload.get("records") or [])
        offset = payload.get("offset")
        if not offset:
            break
    return records


def blank_to_none(value: Any) -> Any:
    if value is None:
        return None
    if value == "":
        return None
    if isinstance(value, list) and len(value) == 0:
        return None
    if isinstance(value, dict) and len(value) == 0:
        return None
    return value


def stored_value(field_type: str, raw: Any) -> Any:
    """Copy Airtable's current value as-is. Never invent dollars, courts, or false blanks."""
    value = blank_to_none(raw)
    if value is None:
        return None
    if field_type == "multipleRecordLinks":
        if isinstance(value, list):
            ids = [item for item in value if isinstance(item, str) and item]
            return ids or None
        return None
    if field_type in {"singleSelect", "multipleSelects"}:
        return value
    if field_type in {"createdBy", "lastModifiedBy"}:
        return value
    return value


def map_record(record: dict[str, Any], stored: list[dict[str, str]]) -> dict[str, Any]:
    fields = record.get("fields") or {}
    dest: dict[str, Any] = {"airtable_id": record.get("id")}
    for row in stored:
        field_id = row["airtable_field_id"]
        if not field_id:
            continue
        dest[row["dest_column"]] = stored_value(row["airtable_type"], fields.get(field_id))
    return dest


def supabase_existing_ids(url: str, service_key: str) -> set[str]:
    """Read-only: existing public.cases airtable_id values. Never writes."""
    found: set[str] = set()
    offset = 0
    page = 1000
    base = url.rstrip("/")
    while True:
        qs = urllib.parse.urlencode({"select": "airtable_id", "limit": str(page), "offset": str(offset)})
        req = urllib.request.Request(
            f"{base}/rest/v1/cases?{qs}",
            headers={
                "apikey": service_key,
                "Authorization": f"Bearer {service_key}",
                "Accept": "application/json",
                "Prefer": "count=exact",
            },
            method="GET",
        )
        try:
            with urllib.request.urlopen(req) as resp:
                rows = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            print(f"Supabase read-only check skipped (HTTP {exc.code}): {body[:200]}", file=sys.stderr)
            return found
        except urllib.error.URLError as exc:
            print(f"Supabase read-only check skipped: {exc}", file=sys.stderr)
            return found
        if not isinstance(rows, list) or not rows:
            break
        for row in rows:
            aid = row.get("airtable_id")
            if aid:
                found.add(aid)
        if len(rows) < page:
            break
        offset += page
    return found


def sample_rows(mapped: list[dict[str, Any]], records_by_id: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    sample: list[dict[str, Any]] = []
    seen: set[str] = set()
    spot = next((row for row in mapped if row.get("airtable_id") == SPOT_CHECK_REC), None)
    if spot:
        sample.append(spot)
        seen.add(SPOT_CHECK_REC)
    for row in mapped:
        if row.get("airtable_id") in seen:
            continue
        sample.append(row)
        seen.add(row["airtable_id"])
        if len(sample) >= 10:
            break
    out = []
    preview_cols = (
        "airtable_id",
        "claim_number",
        "claim_state",
        "county",
        "date_of_loss",
        "case_status",
        "client_estimate_amount",
        "property_address",
    )
    for row in sample:
        rec = records_by_id.get(row["airtable_id"], {})
        fields = rec.get("fields") or {}
        preview = {col: row.get(col) for col in preview_cols}
        preview["airtable_case_number_formula_unmapped"] = blank_to_none(fields.get("fldgtfo2DzUKEBYV9"))
        if row["airtable_id"] == SPOT_CHECK_REC:
            preview["spot_check"] = SPOT_CHECK_CASE
        out.append(preview)
    return out


def parse_args(argv: list[str]) -> argparse.Namespace:
    blocked = [flag for flag in argv if flag in WRITE_FLAGS]
    if blocked:
        die(f"refusing write flag(s) {blocked}: this script is dry-run only")
    parser = argparse.ArgumentParser(description="Dry-run Managed Cases copy into public.cases. Never writes.")
    parser.add_argument(
        "--map-only",
        action="store_true",
        help="Print map counts only; do not call Airtable or Supabase.",
    )
    parser.add_argument(
        "--table-id",
        default=DEFAULT_TABLE_ID,
        help=f"Airtable table id (default {DEFAULT_TABLE_ID})",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(sys.argv[1:] if argv is None else argv)
    if not MAP_PATH.is_file():
        die(f"missing map: {MAP_PATH}")

    map_rows = load_map(MAP_PATH)
    _match, stored, formulas = classify(map_rows)
    print_map_stats(map_rows, stored, formulas)

    if args.map_only:
        print("Mode: map-only (no Airtable/Supabase calls, no writes).")
        return 0

    missing = [name for name in REQUIRED_ENV if not os.environ.get(name)]
    if missing:
        print("Live dry-run needs env vars (never commit secrets): " + ", ".join(REQUIRED_ENV))
        die("missing env: " + ", ".join(missing), code=2)

    token = os.environ["AIRTABLE_TOKEN"]
    base_id = os.environ["AIRTABLE_BASE_ID"]
    supabase_url = os.environ["SUPABASE_URL"]
    service_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

    field_ids = [row["airtable_field_id"] for row in stored if row["airtable_field_id"]]
    # Case Number is formula / unmapped; fetched only so the sample can label C-01985.
    if "fldgtfo2DzUKEBYV9" not in field_ids:
        field_ids.append("fldgtfo2DzUKEBYV9")

    print(f"Source: Airtable {base_id} / {args.table_id} Managed Cases")
    print("Dest: public.cases (read-only match check; no inserts/updates)")

    records = fetch_airtable_records(token, base_id, args.table_id, field_ids)
    mapped = [map_record(record, stored) for record in records]
    by_id = {record["id"]: record for record in records}

    existing = supabase_existing_ids(supabase_url, service_key)
    would_insert = sum(1 for row in mapped if row["airtable_id"] not in existing)
    would_match = sum(1 for row in mapped if row["airtable_id"] in existing)

    print(f"Records: {len(records)}")
    print(f"Dest rows that would be written: 0 (dry-run)")
    print(f"Would match existing airtable_id: {would_match}")
    print(f"Would be new airtable_id: {would_insert}")

    spot = by_id.get(SPOT_CHECK_REC)
    if spot:
        print(f"Spot-check {SPOT_CHECK_CASE} ({SPOT_CHECK_REC}): present")
    else:
        print(f"Spot-check {SPOT_CHECK_CASE} ({SPOT_CHECK_REC}): not present in fetched records")

    print("10-row sample (stored dest columns only; formulas omitted):")
    print(json.dumps(sample_rows(mapped, by_id), ensure_ascii=False, indent=2, default=str))
    print("Dry-run complete. No case rows were written.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
