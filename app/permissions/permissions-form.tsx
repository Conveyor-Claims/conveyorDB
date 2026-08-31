"use client";

import { useActionState } from "react";
import type { PermissionCase, PermissionsState } from "@/lib/permissions";
import {
  grantCaseViewAction,
  revokeCaseViewAction,
  toggleParalegalViewAction,
} from "./actions";

const cellRule = "border-x border-border px-4 py-3";

function GrantButton({
  caseId,
  granted,
}: {
  caseId: string;
  granted: boolean;
}) {
  const action = granted ? revokeCaseViewAction : grantCaseViewAction;
  const [state, formAction, pending] = useActionState(
    action,
    null as PermissionsState | null,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="case_id" value={caseId} />
      <button
        type="submit"
        disabled={pending}
        className={
          granted
            ? "rounded-[12px] border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-wash disabled:opacity-60"
            : "rounded-[12px] bg-accent px-3 py-1.5 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
        }
      >
        {pending ? "Saving…" : granted ? "Revoke" : "Grant"}
      </button>
      {state && !state.ok ? (
        <span className="text-xs text-red-800">{state.message}</span>
      ) : null}
    </form>
  );
}

export function PermissionsForm({
  canViewGrantedCases,
  cases,
  grantedCaseIds,
}: {
  canViewGrantedCases: boolean;
  cases: PermissionCase[];
  grantedCaseIds: readonly string[];
}) {
  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleParalegalViewAction,
    null as PermissionsState | null,
  );
  const granted = new Set(grantedCaseIds);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-sm text-muted">User types</p>
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="min-w-full border-collapse text-left text-sm">
            <caption className="sr-only">Permission toggles by user type</caption>
            <thead className="bg-wash">
              <tr>
                <th
                  scope="col"
                  className={`${cellRule} whitespace-nowrap font-medium text-muted`}
                >
                  User type
                </th>
                <th
                  scope="col"
                  className={`${cellRule} whitespace-nowrap font-medium text-muted`}
                >
                  Can view granted cases
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className={`${cellRule} text-foreground`}>Paralegal</td>
                <td className={`${cellRule}`}>
                  <form action={toggleAction} className="flex items-center gap-3">
                    <input
                      type="hidden"
                      name="can_view_granted_cases"
                      value={canViewGrantedCases ? "false" : "true"}
                    />
                    <button
                      type="submit"
                      role="switch"
                      aria-checked={canViewGrantedCases}
                      disabled={togglePending}
                      className={`relative h-6 w-11 rounded-full border border-border transition-colors disabled:opacity-60 ${
                        canViewGrantedCases ? "bg-accent" : "bg-wash"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
                          canViewGrantedCases ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                    <span className="text-sm text-muted">
                      {canViewGrantedCases ? "On" : "Off"}
                    </span>
                    {toggleState && !toggleState.ok ? (
                      <span className="text-xs text-red-800">
                        {toggleState.message}
                      </span>
                    ) : null}
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <p className="font-mono text-sm text-muted">
            Managed Cases the paralegal can view
          </p>
          <p className="text-xs text-muted">
            Per case. Not automatic. Not by firm. Case Number is the stored
            value.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="min-w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Grant or revoke paralegal view per case
            </caption>
            <thead className="bg-wash">
              <tr>
                <th
                  scope="col"
                  className={`${cellRule} whitespace-nowrap font-medium text-muted`}
                >
                  Case Number
                </th>
                <th
                  scope="col"
                  className={`${cellRule} whitespace-nowrap font-medium text-muted`}
                >
                  Granted
                </th>
                <th
                  scope="col"
                  className={`${cellRule} whitespace-nowrap font-medium text-muted`}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className={`${cellRule} py-10 text-center text-muted`}
                  >
                    No cases.
                  </td>
                </tr>
              ) : (
                cases.map((row) => {
                  const isGranted = granted.has(row.id);
                  return (
                    <tr key={row.id} className="border-t border-border">
                      <td
                        className={`${cellRule} whitespace-nowrap font-mono text-foreground`}
                      >
                        {row.case_number || row.id}
                      </td>
                      <td className={`${cellRule} text-muted`}>
                        {isGranted ? "Yes" : "No"}
                      </td>
                      <td className={cellRule}>
                        <GrantButton caseId={row.id} granted={isGranted} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
