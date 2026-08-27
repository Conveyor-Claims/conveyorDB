import type { AllCasesPillKey } from "@/lib/cases";

/**
 * Hex values from Airtable’s official Blocks SDK palette
 * (`rgbTuplesByColor` in @airtable/blocks colors.ts).
 * Only tokens used by the listed All Cases dropdown options.
 */
export const AIRTABLE_PALETTE_HEX = {
  blueLight1: "#9cc7ff",
  blueLight2: "#cfdfff",
  blueBright: "#2d7ff9",
  cyanBright: "#18bfff",
  grayLight1: "#cccccc",
  grayDark1: "#444444",
  greenLight1: "#93e088",
  greenLight2: "#d1f7c4",
  greenBright: "#20c933",
  orangeLight1: "#ffa981",
  pinkLight1: "#f99de2",
  pinkBright: "#ff08c2",
  purpleBright: "#8b46ff",
  tealLight1: "#72ddc3",
  tealBright: "#20d9d2",
  yellowLight1: "#ffd66e",
  yellowBright: "#fcb400",
} as const;

export type AirtableColorToken = keyof typeof AIRTABLE_PALETTE_HEX;

/**
 * Exact option names and color tokens from live Airtable.
 * Do not invent options or tokens.
 */
export const ALL_CASES_CHOICE_COLORS = {
  department: {
    Onboarding: "blueLight1",
    Retained: "orangeLight1",
    Settled: "greenLight1",
    "Claim Closed": "greenLight2",
  },
  case_status: {
    Referral: "blueLight1",
    "Pre-Litigation": "pinkLight1",
    Appraisal: "yellowLight1",
    "Appraisal - Lit": "yellowBright",
    "Re-Inspection": "purpleBright",
    Litigation: "tealLight1",
    Settled: "greenLight1",
    "Settled - Depreciation Outst.": "greenLight1",
    "Settled - Paid": "greenBright",
    "Settled w/ Release": "greenLight1",
    "Settled w/ Release - Paid": "greenBright",
    "Settled w/ Appraisal Award": "greenLight1",
    "Settled w/ Appraisal Award - Depreciation Outst.": "greenLight1",
    "Settled w/ Appraisal Award - Paid": "greenBright",
    "Closed No Service": "grayLight1",
    "Non-Responsive": "cyanBright",
    "Closed - New Claim": "blueLight2",
  },
  resolutions_specialist: {
    "A2 - Aidee Gutierrez": "blueBright",
    "A2 - Andrea Robles": "greenLight1",
    "Jetta Lewis": "tealLight1",
    "Tiffany Nicholson": "pinkBright",
    "Not assigned": "grayDark1",
  },
  paralegal: {
    "Brittany Owens": "purpleBright",
    "Kristie Fogner": "blueBright",
    "Marisol Rivera": "tealBright",
  },
} as const satisfies Record<
  AllCasesPillKey,
  Record<string, AirtableColorToken>
>;

/** Airtable: Light1/Light2 use dark text; Bright/Dark1 use light text. */
export function airtableChoiceUsesLightText(token: AirtableColorToken): boolean {
  return !(token.endsWith("Light1") || token.endsWith("Light2"));
}

export type ChoicePillColors = {
  backgroundColor: string;
  color: string;
  borderColor: string;
};

/** Exact stored option only. Unknown values return null (neutral pill). */
export function choicePillColors(
  field: AllCasesPillKey,
  value: string,
): ChoicePillColors | null {
  const token = (
    ALL_CASES_CHOICE_COLORS[field] as Record<string, AirtableColorToken>
  )[value];
  if (!token) return null;

  const backgroundColor = AIRTABLE_PALETTE_HEX[token];
  return {
    backgroundColor,
    borderColor: backgroundColor,
    color: airtableChoiceUsesLightText(token) ? "#ffffff" : "#181d26",
  };
}
