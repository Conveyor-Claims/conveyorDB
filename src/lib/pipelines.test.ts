import assert from "node:assert/strict";
import { test } from "node:test";
import type { AllCasesRow } from "./cases";
import {
  EMPTY_CASE_LIST_FILTERS,
  caseRowMatchesSearch,
  filterCaseRows,
} from "./pipelines";

function listRow(
  patch: Pick<AllCasesRow, "id" | "case_number" | "client_name"> &
    Partial<AllCasesRow>,
): AllCasesRow {
  return {
    case_status: "Referral",
    department: null,
    claim_state: null,
    date_of_loss: null,
    sol_deadline: null,
    referred_firm: null,
    resolutions_specialist: null,
    paralegal: null,
    next_steps: null,
    cid_due_date: null,
    pl_due_date: null,
    atty_due_date: null,
    euo_date: null,
    atty_client_appt: null,
    rs_due_date: null,
    next_client_comm_due_date: null,
    recent_client_comm_date: null,
    ...patch,
  };
}

const natalie = listRow({
  id: "1",
  case_number: "C - 02895",
  client_name: "Natalie Dubin",
});
const p30b = listRow({
  id: "2",
  case_number: "C - 02896",
  client_name: "P30b Test",
  case_status: "Pre-Litigation",
});
const clara = listRow({
  id: "3",
  case_number: "C - 02897",
  client_name: "Clara Rock Climbing",
});

test("search matches resolved case number in compact or spaced form", () => {
  assert.equal(caseRowMatchesSearch(natalie, "02895"), true);
  assert.equal(caseRowMatchesSearch(natalie, "C-02895"), true);
  assert.equal(caseRowMatchesSearch(natalie, "c - 02895"), true);
  assert.equal(caseRowMatchesSearch(natalie, "02896"), false);
});

test("search matches resolved client name, not rec ids", () => {
  assert.equal(caseRowMatchesSearch(natalie, "natalie"), true);
  assert.equal(caseRowMatchesSearch(natalie, "Dubin"), true);
  assert.equal(caseRowMatchesSearch(clara, "rock climbing"), true);
  assert.equal(
    caseRowMatchesSearch(
      listRow({
        id: "x",
        case_number: "reczdQ0AAIr3Z2XFU",
        client_name: "recPYFhETjylMoidI",
      }),
      "recPYFhETjylMoidI",
    ),
    false,
  );
  assert.equal(
    caseRowMatchesSearch(
      listRow({
        id: "y",
        case_number: "C - 02895",
        client_name: "Natalie Dubin",
      }),
      "recPYFhETjylMoidI",
    ),
    false,
  );
});

test("empty search returns the full list; a query filters it", () => {
  const rows = [natalie, p30b, clara];
  assert.equal(filterCaseRows(rows, EMPTY_CASE_LIST_FILTERS, "").length, 3);
  assert.deepEqual(
    filterCaseRows(rows, EMPTY_CASE_LIST_FILTERS, "02895").map((row) => row.id),
    ["1"],
  );
  assert.deepEqual(
    filterCaseRows(rows, EMPTY_CASE_LIST_FILTERS, "clara").map((row) => row.id),
    ["3"],
  );
  assert.equal(filterCaseRows(rows, EMPTY_CASE_LIST_FILTERS, "nope").length, 0);
});

test("search still respects existing list filters", () => {
  const rows = [natalie, p30b, clara];
  const filtered = filterCaseRows(
    rows,
    { ...EMPTY_CASE_LIST_FILTERS, caseStatus: ["Referral"] },
    "C-028",
  );
  assert.deepEqual(
    filtered.map((row) => row.case_number),
    ["C - 02895", "C - 02897"],
  );
});
