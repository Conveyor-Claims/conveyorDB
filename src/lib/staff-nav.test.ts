import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ALL_CASES_HREF,
  BOARD_NAV_LINKS,
  PIPELINE_NAV_LINKS,
  isAllCasesPath,
  isStaffNavActive,
} from "./staff-nav";

test("sidebar groups pipelines before boards", () => {
  assert.equal(PIPELINE_NAV_LINKS[0]?.href, ALL_CASES_HREF);
  assert.ok(PIPELINE_NAV_LINKS.some((link) => link.href === "/referrals"));
  assert.ok(BOARD_NAV_LINKS.some((link) => link.href === "/boards/cid"));
  assert.equal(
    BOARD_NAV_LINKS.some((link) => link.href.includes("appraisal-client")),
    false,
  );
});

test("All Cases is current on /cases, and on / only after login", () => {
  assert.equal(isAllCasesPath("/"), false);
  assert.equal(isAllCasesPath("/", true), true);
  assert.equal(isAllCasesPath("/cases"), true);
  assert.equal(isAllCasesPath("/cases/new"), false);
  assert.equal(isStaffNavActive("/", ALL_CASES_HREF), false);
  assert.equal(isStaffNavActive("/", ALL_CASES_HREF, true), true);
  assert.equal(isStaffNavActive("/cases", ALL_CASES_HREF), true);
  assert.equal(isStaffNavActive("/referrals", ALL_CASES_HREF), false);
  assert.equal(isStaffNavActive("/cases/abc", ALL_CASES_HREF), false);
  assert.equal(isStaffNavActive("/referrals", "/referrals"), true);
  assert.equal(isStaffNavActive("/boards/cid", "/boards/cid"), true);
});
