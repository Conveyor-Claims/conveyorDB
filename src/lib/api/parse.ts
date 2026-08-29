import {
  UPDATE_COLUMNS,
  type ApiTable,
  type ColumnKind,
} from "@/lib/api/update-columns";

export type WriteValue = string | number | boolean | string[] | null;

export type WritePatch = Record<string, WriteValue>;

export type ParseOk = { ok: true; patch: WritePatch };
export type ParseFail = { ok: false; status: 400 | 409; error: string };
export type ParseResult = ParseOk | ParseFail;

function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseNumberOrNull(
  raw: string,
  key: string,
): { ok: true; value: number | null } | ParseFail {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: null };
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return {
      ok: false,
      status: 400,
      error: `Could not save ${key}: enter a number or leave blank.`,
    };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return {
      ok: false,
      status: 400,
      error: `Could not save ${key}: enter a number or leave blank.`,
    };
  }
  return { ok: true, value };
}

function parseString(value: unknown, key: string): { ok: true; value: string | null } | ParseFail {
  if (value === null) return { ok: true, value: null };
  if (typeof value !== "string") {
    return { ok: false, status: 400, error: `${key} must be a string or null.` };
  }
  return { ok: true, value: blankToNull(value) };
}

function parseStringArray(
  value: unknown,
  key: string,
): { ok: true; value: string[] | null } | ParseFail {
  if (value === null) return { ok: true, value: null };
  if (!Array.isArray(value)) {
    return { ok: false, status: 400, error: `${key} must be an array of strings or null.` };
  }
  const values: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") {
      return { ok: false, status: 400, error: `${key} must be an array of strings or null.` };
    }
    const trimmed = item.trim();
    if (trimmed.length > 0) values.push(trimmed);
  }
  return { ok: true, value: values.length === 0 ? null : values };
}

function parseNumberValue(
  value: unknown,
  key: string,
): { ok: true; value: number | null } | ParseFail {
  if (value === null) return { ok: true, value: null };
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return {
        ok: false,
        status: 400,
        error: `Could not save ${key}: enter a number or leave blank.`,
      };
    }
    return { ok: true, value };
  }
  if (typeof value === "string") return parseNumberOrNull(value, key);
  return {
    ok: false,
    status: 400,
    error: `Could not save ${key}: enter a number or leave blank.`,
  };
}

function parseCheckbox(
  value: unknown,
  key: string,
): { ok: true; value: true | null } | ParseFail {
  if (value === null || value === false) return { ok: true, value: null };
  if (value === true) return { ok: true, value: true };
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "") return { ok: true, value: null };
    if (trimmed === "true" || trimmed === "on") return { ok: true, value: true };
    if (trimmed === "false") return { ok: true, value: null };
  }
  return { ok: false, status: 400, error: `${key} must be a checkbox value or blank.` };
}

function parseByKind(
  kind: ColumnKind,
  value: unknown,
  key: string,
): { ok: true; value: WriteValue } | ParseFail {
  if (kind === "string") return parseString(value, key);
  if (kind === "string[]") return parseStringArray(value, key);
  if (kind === "number") return parseNumberValue(value, key);
  return parseCheckbox(value, key);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseWriteBody(
  table: ApiTable,
  body: unknown,
  mode: "insert" | "update",
): ParseResult {
  if (!isPlainObject(body)) {
    return { ok: false, status: 400, error: "Body must be a JSON object." };
  }

  const columns = UPDATE_COLUMNS[table];
  const patch: WritePatch = {};

  for (const key of Object.keys(body)) {
    if (!(key in columns)) {
      return { ok: false, status: 400, error: `Unknown key: ${key}` };
    }
    if (key === "case_number") {
      return {
        ok: false,
        status: 409,
        error: "case_number is owned by ConveyorDB and cannot be written.",
      };
    }
    if (key === "id") {
      if (mode === "insert") {
        return { ok: false, status: 400, error: "id is assigned by the database." };
      }
      continue;
    }

    const kind = columns[key as keyof typeof columns] as ColumnKind;
    const parsed = parseByKind(kind, body[key], key);
    if (!parsed.ok) return parsed;
    patch[key] = parsed.value;
  }

  if (mode === "update" && Object.keys(patch).length === 0) {
    return { ok: false, status: 400, error: "No stored fields submitted." };
  }

  return { ok: true, patch };
}

export function formRecord(formData: FormData, fileKeys = new Set(["file"])): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const key of new Set(formData.keys())) {
    if (fileKeys.has(key)) continue;
    const values = formData.getAll(key);
    if (values.some((value) => value instanceof File)) {
      continue;
    }
    const strings = values.filter((value): value is string => typeof value === "string");
    if (strings.length > 1) {
      body[key] = strings;
    } else {
      body[key] = strings[0] ?? "";
    }
  }
  return body;
}
