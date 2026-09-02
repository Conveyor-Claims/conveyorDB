import type { AllCasesRow } from "@/lib/cases";

/**
 * Pipeline pages are All Cases filtered by stored case_status.
 * Names match live Airtable All Cases (Aug 24 interface walk).
 * Settled is exact `Settled` only — other Settled * variants stay on All Cases.
 * Closed is the two stored closed values. There is no dest named Closed.
 * New cases is the queue name for stored Referral. /referrals stays.
 * Do not invent a dest named New. Referral alone is the filter.
 */
export const CASE_PIPELINES = {
  "new-cases": {
    slug: "new-cases",
    href: "/new-cases",
    title: "New cases",
    navLabel: "New cases",
    caseStatus: "Referral",
  },
  referrals: {
    slug: "referrals",
    href: "/referrals",
    title: "Referrals",
    navLabel: "Referrals",
    caseStatus: "Referral",
  },
  "pre-lit": {
    slug: "pre-lit",
    href: "/pre-lit",
    title: "Pre-Litigation",
    navLabel: "Pre-Lit",
    caseStatus: "Pre-Litigation",
  },
  appraisal: {
    slug: "appraisal",
    href: "/appraisal",
    title: "Appraisal",
    navLabel: "Appraisal",
    caseStatus: "Appraisal",
  },
  "appraisal-lit": {
    slug: "appraisal-lit",
    href: "/appraisal-lit",
    title: "Appraisal - Lit",
    navLabel: "Appraisal-Lit",
    caseStatus: "Appraisal - Lit",
  },
  "re-inspection": {
    slug: "re-inspection",
    href: "/re-inspection",
    title: "Re-Inspection",
    navLabel: "Re-Inspection",
    caseStatus: "Re-Inspection",
  },
  litigation: {
    slug: "litigation",
    href: "/litigation",
    title: "Litigation",
    navLabel: "Litigation",
    caseStatus: "Litigation",
  },
  settled: {
    slug: "settled",
    href: "/settled",
    title: "Settled",
    navLabel: "Settled",
    caseStatus: "Settled",
  },
  "settled-paid": {
    slug: "settled-paid",
    href: "/settled-paid",
    title: "Settled - Paid",
    navLabel: "Settled Paid",
    caseStatus: "Settled - Paid",
  },
  "non-responsive": {
    slug: "non-responsive",
    href: "/non-responsive",
    title: "Non-Responsive",
    navLabel: "Non-Responsive",
    caseStatus: "Non-Responsive",
  },
  closed: {
    slug: "closed",
    href: "/closed",
    title: "Closed",
    navLabel: "Closed",
    caseStatus: ["Closed No Service", "Closed - New Claim"],
  },
} as const;

export type PipelineSlug = keyof typeof CASE_PIPELINES;
export type CasePipeline = (typeof CASE_PIPELINES)[PipelineSlug];

export const PIPELINE_LIST = [
  CASE_PIPELINES["new-cases"],
  CASE_PIPELINES.referrals,
  CASE_PIPELINES["pre-lit"],
  CASE_PIPELINES.appraisal,
  CASE_PIPELINES["appraisal-lit"],
  CASE_PIPELINES["re-inspection"],
  CASE_PIPELINES.litigation,
  CASE_PIPELINES.settled,
  CASE_PIPELINES["settled-paid"],
  CASE_PIPELINES["non-responsive"],
  CASE_PIPELINES.closed,
] as const;

export function pipelineStatuses(pipeline: CasePipeline): readonly string[] {
  return typeof pipeline.caseStatus === "string"
    ? [pipeline.caseStatus]
    : pipeline.caseStatus;
}

export function pipelineStatusLabel(pipeline: CasePipeline): string {
  return pipelineStatuses(pipeline).join(" or ");
}

export function caseMatchesPipeline(
  caseStatus: string | null | undefined,
  pipelineStatus: string | readonly string[],
): boolean {
  if (typeof pipelineStatus === "string") {
    return caseStatus === pipelineStatus;
  }
  return pipelineStatus.some((status) => caseStatus === status);
}

export type CaseListFilters = {
  referredFirm: string[];
  caseStatus: string[];
  nextSteps: string[];
  resolutionsSpecialist: string[];
  paralegal: string[];
};

export const EMPTY_CASE_LIST_FILTERS: CaseListFilters = {
  referredFirm: [],
  caseStatus: [],
  nextSteps: [],
  resolutionsSpecialist: [],
  paralegal: [],
};

function storedText(value: string | null | undefined): string {
  return value ?? "";
}

function hasAny(selected: string[], value: string): boolean {
  return selected.length === 0 || selected.includes(value);
}

export function filterCaseRows(
  rows: AllCasesRow[],
  filters: CaseListFilters,
): AllCasesRow[] {
  return rows.filter((row) => {
    if (!hasAny(filters.referredFirm, storedText(row.referred_firm))) {
      return false;
    }
    if (!hasAny(filters.caseStatus, storedText(row.case_status))) {
      return false;
    }
    if (filters.nextSteps.length > 0) {
      const steps = row.next_steps ?? [];
      if (!filters.nextSteps.some((step) => steps.includes(step))) {
        return false;
      }
    }
    if (
      !hasAny(
        filters.resolutionsSpecialist,
        storedText(row.resolutions_specialist),
      )
    ) {
      return false;
    }
    if (!hasAny(filters.paralegal, storedText(row.paralegal))) {
      return false;
    }
    return true;
  });
}

export type ReferredFirmGroup = {
  firm: string;
  rows: AllCasesRow[];
};

/** Group by referred_firm display name (resolved before list). Blank stays blank. */
export function groupCasesByReferredFirm(
  rows: AllCasesRow[],
): ReferredFirmGroup[] {
  const buckets = new Map<string, AllCasesRow[]>();
  for (const row of rows) {
    const firm = storedText(row.referred_firm);
    const list = buckets.get(firm);
    if (list) list.push(row);
    else buckets.set(firm, [row]);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => {
      if (a === "" && b !== "") return 1;
      if (b === "" && a !== "") return -1;
      return a.localeCompare(b);
    })
    .map(([firm, groupRows]) => ({ firm, rows: groupRows }));
}

export function uniqueStoredValues(
  values: Array<string | null | undefined>,
): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    seen.add(storedText(value));
  }
  return [...seen].sort((a, b) => {
    if (a === "" && b !== "") return 1;
    if (b === "" && a !== "") return -1;
    return a.localeCompare(b);
  });
}

export function uniqueNextSteps(rows: AllCasesRow[]): string[] {
  const seen = new Set<string>();
  for (const row of rows) {
    for (const step of row.next_steps ?? []) {
      if (step) seen.add(step);
    }
  }
  return [...seen].sort((a, b) => a.localeCompare(b));
}
