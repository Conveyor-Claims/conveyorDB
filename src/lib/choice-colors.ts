import {
  swatchForToken,
  type AirtableColorToken,
  type AirtableSwatch,
} from "@/lib/airtable-palette";
import type { AllCasesPillKey } from "@/lib/cases";

/**
 * Live Managed Cases select options + tokens (Aug 26 MCP / gap doc).
 * Copy only these names. Unlisted stored values stay neutral.
 * Claim State colors were not captured — always neutral.
 */
const CHOICE_TOKENS = {
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
} as const satisfies Partial<
  Record<AllCasesPillKey, Record<string, AirtableColorToken>>
>;

export function choiceSwatch(
  field: AllCasesPillKey,
  value: string,
): AirtableSwatch | null {
  const tokens = CHOICE_TOKENS[field as keyof typeof CHOICE_TOKENS];
  if (!tokens) return null;
  const token = tokens[value as keyof typeof tokens] as
    | AirtableColorToken
    | undefined;
  if (!token) return null;
  return swatchForToken(token);
}
