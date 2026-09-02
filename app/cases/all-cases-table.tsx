"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChoicePill } from "../choice-pill";
import { StickyHorizontalScroll } from "./sticky-horizontal-scroll";
import {
  ALL_CASES_COLUMNS,
  displayCaseValue,
  isAllCasesPillKey,
  type AllCasesRow,
} from "@/lib/cases";
import {
  displayCaseNumberOnly,
  hideRecordRefDisplay,
  caseRowLinkLabel,
} from "@/lib/related-names";
import { optionsForDest } from "@/lib/select-options";
import {
  EMPTY_CASE_LIST_FILTERS,
  filterCaseRows,
  groupCasesByReferredFirm,
  noCasesMatchMessage,
  uniqueNextSteps,
  uniqueStoredValues,
  type CaseListFilters,
} from "@/lib/pipelines";

type ListColumn = {
  key: keyof AllCasesRow;
  label: string;
};

function defaultVisibility(
  columns: readonly ListColumn[],
): Record<string, boolean> {
  return Object.fromEntries(columns.map((column) => [column.key, true]));
}

const cellRule = "border-x border-border px-4 py-3";

function toggleValue(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

function listCellText(key: keyof AllCasesRow, value: unknown): string {
  if (key === "case_number") {
    return displayCaseNumberOnly(displayCaseValue(value));
  }
  if (key === "client_name" || key === "referred_firm") {
    return hideRecordRefDisplay(displayCaseValue(value));
  }
  return displayCaseValue(value);
}

function listDisplayRow(row: AllCasesRow): AllCasesRow {
  return {
    ...row,
    case_number: displayCaseNumberOnly(row.case_number) || null,
    client_name: hideRecordRefDisplay(row.client_name ?? "") || null,
    referred_firm: hideRecordRefDisplay(row.referred_firm ?? "") || null,
  };
}

function FilterChoices({
  legend,
  values,
  selected,
  onToggle,
  pillField,
}: {
  legend: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
  pillField?: string;
}) {
  return (
    <fieldset className="space-y-1">
      <legend className="px-2 text-xs text-muted">{legend}</legend>
      {values.length === 0 ? (
        <p className="px-2 py-1 text-xs text-muted">None in this list.</p>
      ) : (
        <ul className="space-y-1">
          {values.map((value) => (
            <li key={value || "blank"}>
              <label className="flex cursor-pointer items-center gap-2 rounded-[12px] px-2 py-1.5 text-sm hover:bg-wash">
                <input
                  type="checkbox"
                  checked={selected.includes(value)}
                  onChange={() => onToggle(value)}
                />
                {pillField && value ? (
                  <ChoicePill value={value} field={pillField} />
                ) : (
                  <span className={value ? undefined : "text-muted"}>
                    {value || "Blank"}
                  </span>
                )}
              </label>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}

export function AllCasesTable({
  rows,
  hideCaseStatusFilter = false,
  extraColumns = [],
}: {
  rows: AllCasesRow[];
  hideCaseStatusFilter?: boolean;
  extraColumns?: readonly ListColumn[];
}) {
  const columnDefs = useMemo<readonly ListColumn[]>(
    () => [...ALL_CASES_COLUMNS, ...extraColumns],
    [extraColumns],
  );
  const [visible, setVisible] = useState(() => defaultVisibility(columnDefs));
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CaseListFilters>(
    EMPTY_CASE_LIST_FILTERS,
  );

  const columns = useMemo(
    () => columnDefs.filter((column) => visible[column.key]),
    [columnDefs, visible],
  );

  const displayRows = useMemo(() => rows.map(listDisplayRow), [rows]);
  const filteredRows = useMemo(
    () => filterCaseRows(displayRows, filters, search),
    [displayRows, filters, search],
  );
  const groups = useMemo(
    () => groupCasesByReferredFirm(filteredRows),
    [filteredRows],
  );

  const firmChoices = useMemo(
    () => uniqueStoredValues(displayRows.map((row) => row.referred_firm)),
    [displayRows],
  );
  const statusChoices = useMemo(
    () => uniqueStoredValues(displayRows.map((row) => row.case_status)),
    [displayRows],
  );
  const nextStepChoices = useMemo(
    () => uniqueNextSteps(displayRows),
    [displayRows],
  );
  const specialistChoices = useMemo(
    () =>
      uniqueStoredValues(displayRows.map((row) => row.resolutions_specialist)),
    [displayRows],
  );
  const paralegalChoices = useMemo(
    () => uniqueStoredValues(displayRows.map((row) => row.paralegal)),
    [displayRows],
  );

  const searchOn = search.trim().length > 0;
  const filtersOn =
    filters.referredFirm.length +
      filters.caseStatus.length +
      filters.nextSteps.length +
      filters.resolutionsSpecialist.length +
      filters.paralegal.length >
    0;
  const listNarrowed = filtersOn || searchOn;

  function toggleColumn(key: ListColumn["key"]) {
    setVisible((current) => ({ ...current, [key]: !current[key] }));
  }

  function patchFilters(key: keyof CaseListFilters, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: toggleValue(current[key], value),
    }));
  }

  const numberedGroups = useMemo(() => {
    const starts = groups.map((_, groupIndex) =>
      groups
        .slice(0, groupIndex)
        .reduce((total, group) => total + group.rows.length, 0),
    );
    return groups.map((group, groupIndex) => ({
      ...group,
      rows: group.rows.map((row, rowIndex) => ({
        row,
        number: starts[groupIndex] + rowIndex + 1,
      })),
    }));
  }, [groups]);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="font-mono text-sm text-muted" aria-live="polite">
            {filteredRows.length}{" "}
            {filteredRows.length === 1 ? "case" : "cases"}
            {listNarrowed ? ` of ${displayRows.length}` : ""}
          </p>
          <p className="text-xs text-muted">Grouped by Referred Firm</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2">
            <span className="sr-only">Search case number or client name</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Case number or client name"
              autoComplete="off"
              className="w-56 rounded-[12px] border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            />
          </label>
          {searchOn ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs text-accent hover:text-accent-hover"
            >
              Clear
            </button>
          ) : null}
          <div className="relative">
          <button
            type="button"
            aria-expanded={panelOpen}
            aria-controls="all-cases-columns-panel"
            onClick={() => setPanelOpen((open) => !open)}
            className="rounded-[12px] border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-wash"
          >
            Filter / Columns
          </button>
          {panelOpen ? (
            <div
              id="all-cases-columns-panel"
              className="absolute right-0 z-10 mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-xl border border-border bg-background p-3 shadow-sm"
            >
              <div className="space-y-3" role="group" aria-label="Find work">
                <div className="flex items-center justify-between gap-2 px-2">
                  <p className="text-xs text-muted">
                    Firm, status, next step, assigned.
                  </p>
                  {filtersOn ? (
                    <button
                      type="button"
                      onClick={() => setFilters(EMPTY_CASE_LIST_FILTERS)}
                      className="text-xs text-accent hover:text-accent-hover"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <FilterChoices
                  legend="Referred Firm"
                  values={firmChoices}
                  selected={filters.referredFirm}
                  onToggle={(value) => patchFilters("referredFirm", value)}
                />
                {hideCaseStatusFilter ? null : (
                <FilterChoices
                  legend="Case Status"
                  values={statusChoices}
                  selected={filters.caseStatus}
                  onToggle={(value) => patchFilters("caseStatus", value)}
                  pillField="case_status"
                />
                )}
                <FilterChoices
                  legend="Next Steps"
                  values={nextStepChoices}
                  selected={filters.nextSteps}
                  onToggle={(value) => patchFilters("nextSteps", value)}
                  pillField="next_steps"
                />
                <FilterChoices
                  legend="Resolutions Specialist"
                  values={specialistChoices}
                  selected={filters.resolutionsSpecialist}
                  onToggle={(value) =>
                    patchFilters("resolutionsSpecialist", value)
                  }
                  pillField="resolutions_specialist"
                />
                <FilterChoices
                  legend="Paralegal"
                  values={paralegalChoices}
                  selected={filters.paralegal}
                  onToggle={(value) => patchFilters("paralegal", value)}
                  pillField="paralegal"
                />
              </div>
              <div
                role="group"
                aria-label="Column visibility"
                className="mt-4 border-t border-border pt-3"
              >
                <p className="mb-2 px-2 text-xs text-muted">
                  Default-on columns. Hide any of them.
                </p>
                <ul className="space-y-1">
                  {columnDefs.map((column) => (
                    <li key={column.key}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-[12px] px-2 py-1.5 text-sm hover:bg-wash">
                        <input
                          type="checkbox"
                          checked={visible[column.key]}
                          onChange={() => toggleColumn(column.key)}
                        />
                        <span>{column.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          {noCasesMatchMessage(search)}
          {searchOn ? (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-accent hover:text-accent-hover"
              >
                Clear
              </button>
            </>
          ) : null}
        </p>
      ) : (
      <StickyHorizontalScroll
        label="Scroll cases table horizontally"
        className="rounded-xl border border-border bg-background"
      >
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">Cases grouped by referred firm</caption>
          <thead className="sticky top-0 z-10 bg-wash">
            <tr>
              <th
                scope="col"
                aria-label="Row number"
                className={`${cellRule} w-12 whitespace-nowrap text-center font-medium text-muted`}
              >
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${cellRule} whitespace-nowrap font-medium text-muted`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          {numberedGroups.map((group) => {
              const firmName = hideRecordRefDisplay(group.firm);
              return (
              <tbody key={group.firm || "blank-firm"}>
                <tr className="border-t border-border bg-wash">
                  <th
                    scope="colgroup"
                    colSpan={columns.length + 1}
                    aria-label={
                      firmName ? undefined : "Blank referred firm"
                    }
                    className={`${cellRule} text-left font-medium text-foreground`}
                  >
                    {firmName ? (
                      <span className="inline-flex max-w-full items-center truncate rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                        {firmName}
                      </span>
                    ) : null}
                    <span className="ml-2 font-mono text-xs font-normal text-muted">
                      {group.rows.length}
                    </span>
                  </th>
                </tr>
                {group.rows.map(({ row, number }) => (
                    <tr key={row.id} className="border-t border-border">
                      <td
                        className={`${cellRule} text-center align-top font-mono text-xs text-muted`}
                      >
                        {number}
                      </td>
                      {columns.map((column) => {
                        const text = listCellText(column.key, row[column.key]);
                        return (
                          <td
                            key={column.key}
                            className={`${cellRule} whitespace-nowrap align-top text-foreground`}
                          >
                            {column.key === "case_number" ? (
                              <Link
                                href={`/cases/${row.id}`}
                                className="text-accent underline-offset-2 hover:text-accent-hover hover:underline"
                              >
                                {caseRowLinkLabel(text, row.client_name)}
                              </Link>
                            ) : text &&
                              (isAllCasesPillKey(column.key) ||
                                Boolean(optionsForDest(column.key))) ? (
                              <ChoicePill value={text} field={column.key} />
                            ) : (
                              text
                            )}
                          </td>
                        );
                      })}
                    </tr>
                ))}
              </tbody>
              );
            })}
        </table>
      </StickyHorizontalScroll>
      )}
    </section>
  );
}
