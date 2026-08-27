"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChoicePill } from "../choice-pill";
import {
  ALL_CASES_COLUMNS,
  displayCaseValue,
  isAllCasesPillKey,
  type AllCasesColumnKey,
  type AllCasesRow,
} from "@/lib/cases";

function defaultVisibility(): Record<AllCasesColumnKey, boolean> {
  return Object.fromEntries(
    ALL_CASES_COLUMNS.map((column) => [column.key, true]),
  ) as Record<AllCasesColumnKey, boolean>;
}

const cellRule = "border-x border-border px-4 py-3";

export function AllCasesTable({ rows }: { rows: AllCasesRow[] }) {
  const [visible, setVisible] = useState(defaultVisibility);
  const [panelOpen, setPanelOpen] = useState(false);

  const columns = useMemo(
    () => ALL_CASES_COLUMNS.filter((column) => visible[column.key]),
    [visible],
  );

  function toggleColumn(key: AllCasesColumnKey) {
    setVisible((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-sm text-muted">
          {rows.length} {rows.length === 1 ? "case" : "cases"}
        </p>
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
              role="group"
              aria-label="Column visibility"
              className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-border bg-background p-3 shadow-sm"
            >
              <p className="mb-2 text-xs text-muted">
                Default-on columns. Hide any of them.
              </p>
              <ul className="space-y-1">
                {ALL_CASES_COLUMNS.map((column) => (
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
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">All cases</caption>
          <thead className="bg-wash">
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
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className={`${cellRule} py-10 text-center text-muted`}
                >
                  No cases.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id} className="border-t border-border">
                  <td
                    className={`${cellRule} text-center align-top font-mono text-xs text-muted`}
                  >
                    {index + 1}
                  </td>
                  {columns.map((column) => {
                    const text = displayCaseValue(row[column.key]);
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
                            {text || row.id}
                          </Link>
                        ) : isAllCasesPillKey(column.key) && text ? (
                          <ChoicePill field={column.key} value={text} />
                        ) : (
                          text
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
