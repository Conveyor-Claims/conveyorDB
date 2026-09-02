import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DUE_DATE_BOARD_LIST,
  DUE_DATE_BOARDS,
  boardHasDestColumn,
  destDateColumnExists,
  dueDateBoardBySlug,
  isSkippedDueDateBoardSlug,
} from "./due-date-boards";
import { BOARD_NAV_LINKS } from "./staff-nav";

test("only boards with a dest column are listed", () => {
  assert.ok(DUE_DATE_BOARD_LIST.length > 0);
  for (const board of DUE_DATE_BOARD_LIST) {
    assert.equal(destDateColumnExists(board.dateColumn), true);
    assert.equal(boardHasDestColumn(board), true);
    assert.ok(board.dateColumn);
    assert.notEqual(board.dateColumn, "appraisal_client_date");
    assert.notEqual(board.dateColumn, "appraisal_client_due_date");
  }
});

test("Appraisal Client is skipped — no dest column", () => {
  assert.equal(isSkippedDueDateBoardSlug("appraisal-client"), true);
  assert.equal(dueDateBoardBySlug("appraisal-client"), undefined);
  assert.equal(
    Object.prototype.hasOwnProperty.call(DUE_DATE_BOARDS, "appraisal-client"),
    false,
  );
  assert.equal(
    DUE_DATE_BOARD_LIST.map((board) => String(board.slug)).includes(
      "appraisal-client",
    ),
    false,
  );
  assert.equal(
    BOARD_NAV_LINKS.some((link) => link.href === "/boards/appraisal-client"),
    false,
  );
});

test("known dest-column boards stay routable", () => {
  const cid = dueDateBoardBySlug("cid");
  assert.equal(cid?.dateColumn, "cid_due_date");
  assert.equal(dueDateBoardBySlug("sol")?.dateColumn, "sol_deadline");
  assert.equal(isSkippedDueDateBoardSlug("cid"), false);
});
