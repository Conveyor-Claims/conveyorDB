import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FROZEN_ALL_CASES_COLUMN_KEYS,
  frozenAllCasesSlot,
  isFrozenAllCasesColumn,
} from "./cases";

const bothVisible = ["case_number", "client_name", "case_status"] as const;

test("Case Number and Client Name are the frozen identity columns", () => {
  assert.deepEqual([...FROZEN_ALL_CASES_COLUMN_KEYS], [
    "case_number",
    "client_name",
  ]);
  assert.equal(isFrozenAllCasesColumn("case_number"), true);
  assert.equal(isFrozenAllCasesColumn("client_name"), true);
  assert.equal(isFrozenAllCasesColumn("case_status"), false);
});

test("row number is always the first frozen slot", () => {
  assert.equal(frozenAllCasesSlot("row_number", bothVisible), 0);
  assert.equal(frozenAllCasesSlot("row_number", []), 0);
});

test("visible Case Number and Client Name freeze after the row number", () => {
  assert.equal(frozenAllCasesSlot("case_number", bothVisible), 1);
  assert.equal(frozenAllCasesSlot("client_name", bothVisible), 2);
});

test("hiding Case Number still freezes Client Name", () => {
  const withoutNumber = ["client_name", "case_status"];
  assert.equal(frozenAllCasesSlot("case_number", withoutNumber), null);
  assert.equal(frozenAllCasesSlot("client_name", withoutNumber), 1);
});

test("other list columns are not frozen", () => {
  assert.equal(frozenAllCasesSlot("case_status", bothVisible), null);
  assert.equal(frozenAllCasesSlot("referred_firm", bothVisible), null);
});
