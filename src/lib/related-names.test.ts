import assert from "node:assert/strict";
import { test } from "node:test";
import type { AllCasesRow } from "./cases";
import { groupCasesByReferredFirm } from "./pipelines";
import {
  applyListRelatedNames,
  caseRowLinkLabel,
  contactNameMaps,
  displayCaseNumberOnly,
  hideRecordRefDisplay,
  isAirtableRecId,
  isRecordRef,
  partnerNameMaps,
  resolveRelatedName,
} from "./related-names";

test("detects Airtable rec ids and uuids", () => {
  assert.equal(isAirtableRecId("reczdQ0AAIr3Z2XFU"), true);
  assert.equal(isAirtableRecId("rec6BtDMw270SdSvP"), true);
  assert.equal(isAirtableRecId("P30b Test"), false);
  assert.equal(isAirtableRecId("recshort"), false);
  assert.equal(
    isRecordRef("17a76057-ccb4-4464-bb4f-b753ac93a847"),
    true,
  );
});

test("resolves rec and uuid from the name map; unknown id is blank", () => {
  const names = new Map([
    ["reczdQ0AAIr3Z2XFU", "Erika L. Abrams"],
    ["17a76057-ccb4-4464-bb4f-b753ac93a847", "Natalie Dubin"],
  ]);
  assert.equal(
    resolveRelatedName("reczdQ0AAIr3Z2XFU", names),
    "Erika L. Abrams",
  );
  assert.equal(
    resolveRelatedName("17a76057-ccb4-4464-bb4f-b753ac93a847", names),
    "Natalie Dubin",
  );
  assert.equal(resolveRelatedName("recPYFhETjylMoidI", names), "");
  assert.equal(resolveRelatedName(null, names), "");
  assert.equal(resolveRelatedName("", names), "");
});

test("keeps a stored display name and never returns rec…", () => {
  const names = new Map([["reczdQ0AAIr3Z2XFU", "Erika L. Abrams"]]);
  assert.equal(resolveRelatedName("P30b Test", names), "P30b Test");
  assert.equal(resolveRelatedName("Clara Rock Climbing", names), "Clara Rock Climbing");
  assert.equal(resolveRelatedName("rec6BtDMw270SdSvP", names), "");
  assert.ok(!resolveRelatedName("rec6BtDMw270SdSvP", names).startsWith("rec"));
});

test("resolves comma-separated rec ids; drops ids with no name", () => {
  const names = new Map([
    ["rec0FtQsgki8fwedM", "Terry Falkenberg"],
    ["recJN6llUXG0l8NGl", "Jesse Falkenberg"],
  ]);
  assert.equal(
    resolveRelatedName("rec0FtQsgki8fwedM,recJN6llUXG0l8NGl", names),
    "Terry Falkenberg, Jesse Falkenberg",
  );
  assert.equal(
    resolveRelatedName("rec0FtQsgki8fwedM,recUNKNOWN000001", names),
    "Terry Falkenberg",
  );
});

test("indexes contacts and partners by id, airtable_id, and cabinet keys", () => {
  const contacts = contactNameMaps([
    {
      id: "17a76057-ccb4-4464-bb4f-b753ac93a847",
      airtable_id: "recPYFhETjylMoidI",
      contact_id: "CID-1",
      full_name: "Natalie Dubin",
      first_name: "Natalie",
      last_name: "Dubin",
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      airtable_id: null,
      contact_id: null,
      full_name: null,
      first_name: "P29",
      last_name: "Proof",
    },
  ]);
  assert.equal(contacts.get("recPYFhETjylMoidI"), "Natalie Dubin");
  assert.equal(
    contacts.get("17a76057-ccb4-4464-bb4f-b753ac93a847"),
    "Natalie Dubin",
  );
  assert.equal(contacts.get("CID-1"), "Natalie Dubin");
  assert.equal(contacts.get("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "P29 Proof");

  const partners = partnerNameMaps([
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      airtable_id: "rec6BtDMw270SdSvP",
      counsel_id: "counsel-9",
      partner_name: "  Example Firm  ",
    },
    {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      airtable_id: "recOR0YG2dRUBfoJR",
      counsel_id: null,
      partner_name: "   ",
    },
  ]);
  assert.equal(partners.get("rec6BtDMw270SdSvP"), "Example Firm");
  assert.equal(partners.get("counsel-9"), "Example Firm");
  assert.equal(partners.has("recOR0YG2dRUBfoJR"), false);
});

test("list case number is C - ##### only; never appends the client name", () => {
  assert.equal(
    displayCaseNumberOnly("C - 02439 - Mary T. Elmore"),
    "C - 02439",
  );
  assert.equal(
    displayCaseNumberOnly("C - 02895 - Natalie Dubin"),
    "C - 02895",
  );
  assert.equal(
    displayCaseNumberOnly("C - 01866 - Mandy Splawn - 2nd Claim - 0771246063"),
    "C - 01866",
  );
  assert.equal(displayCaseNumberOnly("C-02896"), "C - 02896");
  assert.equal(displayCaseNumberOnly("C - 00017"), "C - 00017");
  assert.equal(displayCaseNumberOnly("reczdQ0AAIr3Z2XFU"), "");
  assert.equal(displayCaseNumberOnly(null), "");
});

test("applyListRelatedNames rewrites list fields and groups by resolved firm", () => {
  const maps = {
    contacts: new Map([
      ["reczdQ0AAIr3Z2XFU", "Erika L. Abrams"],
      ["recPYFhETjylMoidI", "Natalie Dubin"],
    ]),
    partners: new Map([
      ["rec6BtDMw270SdSvP", "Example Firm"],
      ["rec7SzR6qCvsveVrO", "Example Firm"],
    ]),
  };

  const rows = [
    applyListRelatedNames(
      {
        id: "1",
        case_number: "C - 00043 - Erika L.  Abrams and Matthew J. Abrams",
        client_name: "reczdQ0AAIr3Z2XFU",
        referred_firm: "rec7SzR6qCvsveVrO",
      },
      maps,
    ),
    applyListRelatedNames(
      {
        id: "2",
        case_number: "C - 01770 - Robert Webb",
        client_name: "rec5ArvanK6uX7UAz",
        referred_firm: "rec6BtDMw270SdSvP",
      },
      maps,
    ),
    applyListRelatedNames(
      {
        id: "3",
        case_number: "C - 02896 - P30b Test",
        client_name: "P30b Test",
        referred_firm: null,
      },
      maps,
    ),
    applyListRelatedNames(
      {
        id: "4",
        case_number: "C - 02895 - Natalie Dubin",
        client_name: "recPYFhETjylMoidI",
        referred_firm: "recUNKNOWN0000001",
      },
      maps,
    ),
  ];

  assert.deepEqual(
    rows.map((row) => row.case_number),
    ["C - 00043", "C - 01770", "C - 02896", "C - 02895"],
  );
  assert.deepEqual(
    rows.map((row) => row.client_name),
    ["Erika L. Abrams", null, "P30b Test", "Natalie Dubin"],
  );
  assert.deepEqual(
    rows.map((row) => row.referred_firm),
    ["Example Firm", "Example Firm", null, null],
  );
  for (const row of rows) {
    assert.ok(!String(row.client_name ?? "").startsWith("rec"));
    assert.ok(!String(row.referred_firm ?? "").startsWith("rec"));
    assert.ok(!String(row.case_number ?? "").includes(" - Natalie"));
  }

  const groups = groupCasesByReferredFirm(rows as AllCasesRow[]);
  assert.equal(groups[0]?.firm, "Example Firm");
  assert.equal(groups[0]?.rows.length, 2);
  assert.equal(groups[1]?.firm, "");
  assert.equal(groups[1]?.rows.length, 2);
});

test("hideRecordRefDisplay never surfaces rec… or a bare uuid", () => {
  assert.equal(hideRecordRefDisplay("rec6BtDMw270SdSvP"), "");
  assert.equal(
    hideRecordRefDisplay("17a76057-ccb4-4464-bb4f-b753ac93a847"),
    "",
  );
  assert.equal(hideRecordRefDisplay("Example Firm"), "Example Firm");
  assert.equal(
    hideRecordRefDisplay("rec0FtQsgki8fwedM, Example Firm"),
    "Example Firm",
  );
});

test("blank Case Number link uses Client Name, then View case — never an id", () => {
  assert.equal(caseRowLinkLabel("C - 02439", "Mary T. Elmore"), "C - 02439");
  assert.equal(caseRowLinkLabel(null, "Clara Rock Climbing"), "Clara Rock Climbing");
  assert.equal(caseRowLinkLabel("", ""), "View case");
  assert.equal(
    caseRowLinkLabel("reczdQ0AAIr3Z2XFU", "rec6BtDMw270SdSvP"),
    "View case",
  );
  assert.equal(
    caseRowLinkLabel("17a76057-ccb4-4464-bb4f-b753ac93a847", null),
    "View case",
  );
});
