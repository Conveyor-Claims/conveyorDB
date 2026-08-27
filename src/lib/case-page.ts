import type { Database } from "@/lib/database.types";

type CasesRow = Database["public"]["Tables"]["cases"]["Row"];

export type CasePageFieldType =
  | "text"
  | "long text"
  | "rich text"
  | "email"
  | "phone"
  | "url"
  | "date"
  | "date/time"
  | "dropdown"
  | "multi dropdown"
  | "checkbox"
  | "money"
  | "percent"
  | "formula"
  | "link to record";

export type CasePageField = {
  key: keyof CasesRow;
  label: string;
  fieldType: CasePageFieldType;
};

export type CasePageSection = {
  name: string;
  fields: readonly CasePageField[];
};

/**
 * C-01985 on-screen sections from docs/catalog/fields.csv.
 * Header (Case Number) is the page title, not a section.
 * Fields are dest columns that exist on public.cases.
 * File/attachment catalog fields have no dest column and are omitted.
 */
export const CASE_PAGE_SECTIONS = [
  {
    name: "Case Overview",
    fields: [
      { key: "referred_firm", label: "Referred Firm", fieldType: "link to record" },
      { key: "associate_counsel", label: "Associate Counsel", fieldType: "link to record" },
      { key: "resolutions_specialist", label: "Resolutions Specialist", fieldType: "dropdown" },
      { key: "paralegal", label: "Paralegal", fieldType: "dropdown" },
      { key: "department", label: "Department", fieldType: "dropdown" },
      { key: "case_status", label: "Case Status", fieldType: "dropdown" },
      { key: "next_steps", label: "Next Steps", fieldType: "multi dropdown" },
      { key: "category_type", label: "Category Type", fieldType: "multi dropdown" },
      { key: "da_oc", label: "DA/OC", fieldType: "dropdown" },
      { key: "rs_due_date", label: "RS Due Date", fieldType: "date" },
      { key: "pl_due_date", label: "PL Due Date", fieldType: "date" },
      { key: "atty_due_date", label: "Atty Due Date", fieldType: "date" },
      { key: "atty_client_appt", label: "Atty Client Appt", fieldType: "date/time" },
      { key: "recent_client_comm_date", label: "Recent Client Comm Date", fieldType: "date" },
      { key: "next_client_comm_due_date", label: "Next Client Comm Due Date", fieldType: "formula" },
    ],
  },
  {
    name: "Case Notes",
    fields: [
      { key: "law_firm_notes", label: "Law Firm Notes", fieldType: "long text" },
      { key: "resolutions_notes", label: "Resolutions Notes", fieldType: "rich text" },
      { key: "attorney_only_notes", label: "Attorney Only Notes", fieldType: "long text" },
      { key: "accounting_notes", label: "Accounting Notes", fieldType: "rich text" },
    ],
  },
  {
    name: "Email Correspondence",
    fields: [
    ],
  },
  {
    name: "Call Recordings",
    fields: [
    ],
  },
  {
    name: "Client Details",
    fields: [
      { key: "client_profile", label: "Client Profile", fieldType: "rich text" },
      { key: "associated_cases", label: "Associated Case(s)", fieldType: "link to record" },
      { key: "property_address", label: "Property Address", fieldType: "text" },
      { key: "mailing_address", label: "Mailing Address", fieldType: "text" },
      { key: "client_alt_phone_number", label: "Client Alt Phone Number", fieldType: "phone" },
      { key: "client_phone_number", label: "Client Phone Number", fieldType: "phone" },
      { key: "email", label: "Email", fieldType: "email" },
      { key: "sms_consent", label: "SMS Consent", fieldType: "dropdown" },
      { key: "client_rating", label: "Client Rating", fieldType: "dropdown" },
      { key: "client_name", label: "Client Name", fieldType: "link to record" },
    ],
  },
  {
    name: "Claim Details",
    fields: [
      { key: "claim_state", label: "Claim State", fieldType: "dropdown" },
      { key: "property_type", label: "Property Type", fieldType: "dropdown" },
      { key: "claim_number", label: "Claim Number", fieldType: "text" },
      { key: "policy_number", label: "Policy Number", fieldType: "text" },
      { key: "date_of_loss", label: "Date of Loss", fieldType: "date" },
      { key: "sol_deadline", label: "SOL Deadline", fieldType: "formula" },
      { key: "date_of_breach", label: "Date of Breach", fieldType: "date" },
      { key: "dob_deadline", label: "DOB Deadline", fieldType: "formula" },
      { key: "cause_of_loss", label: "Cause of Loss", fieldType: "multi dropdown" },
      { key: "claim_type", label: "Claim Type", fieldType: "multi dropdown" },
      { key: "contractor", label: "Contractor", fieldType: "dropdown" },
      { key: "total_loss", label: "Total Loss", fieldType: "dropdown" },
      { key: "rp_claim_summary_for_litigation", label: "RP Claim Summary for Litigation", fieldType: "long text" },
    ],
  },
  {
    name: "Repair Estimate & Settlement Progress",
    fields: [
      { key: "client_estimate_amount", label: "Client Estimate Amount", fieldType: "money" },
      { key: "current_ic_offer", label: "Current IC Offer", fieldType: "money" },
      { key: "of_est", label: "% of Est", fieldType: "formula" },
      { key: "ic_rcv_estimate_amount", label: "IC RCV Estimate Amount", fieldType: "money" },
      { key: "rcv_disputed_amount", label: "RCV Disputed Amount", fieldType: "formula" },
      { key: "deductible_amount", label: "Deductible Amount", fieldType: "money" },
      { key: "total_paid_to_date", label: "Total Paid to Date", fieldType: "money" },
      { key: "amount_to_collect", label: "Amount to Collect", fieldType: "formula" },
    ],
  },
  {
    name: "Retained Client Checklist",
    fields: [
      { key: "certified_policy_received", label: "Certified Policy Received", fieldType: "checkbox" },
      { key: "ic_docs_and_communications", label: "IC Docs & Communications", fieldType: "checkbox" },
      { key: "payment_summary_sol_received", label: "Payment Summary (SOL) Received", fieldType: "checkbox" },
      { key: "nc_call_completed", label: "NC Call Completed", fieldType: "checkbox" },
      { key: "clg_settlement_statement_complete", label: "CLG - Settlement Statement Complete", fieldType: "checkbox" },
    ],
  },
  {
    name: "Client Docs",
    fields: [
      { key: "external_documentation_links", label: "External Documentation Links", fieldType: "rich text" },
    ],
  },
  {
    name: "Insurance & OC Docs",
    fields: [
      { key: "insurance_company", label: "Insurance Company", fieldType: "dropdown" },
      { key: "opposing_counsel_firm", label: "Opposing Counsel Firm", fieldType: "dropdown" },
      { key: "current_desk_adjuster", label: "Current Desk Adjuster", fieldType: "dropdown" },
      { key: "current_opposing_counsel", label: "Current Opposing Counsel", fieldType: "dropdown" },
      { key: "desk_adjuster_email", label: "Desk Adjuster Email", fieldType: "email" },
      { key: "opposing_counsel_email", label: "Opposing Counsel Email", fieldType: "email" },
      { key: "ic_adjuster_contact_info", label: "IC Adjuster Contact Info", fieldType: "long text" },
      { key: "opposing_counsel_contact_info", label: "Opposing Counsel Contact Info", fieldType: "rich text" },
    ],
  },
  {
    name: "Letter of Rep. & Retainers",
    fields: [
      { key: "rp_claim_fee", label: "RP Claim Fee %", fieldType: "percent" },
      { key: "retainer_sent", label: "Retainer Sent", fieldType: "date" },
      { key: "retainer_signed_date", label: "Retainer Signed Date", fieldType: "date" },
      { key: "welcome_email_sent", label: "Welcome Email Sent", fieldType: "date" },
      { key: "lor_dl_sent_to_ic", label: "LOR/DL Sent to IC", fieldType: "date" },
      { key: "days_since_retained", label: "Days Since Retained", fieldType: "formula" },
    ],
  },
  {
    name: "Appraisal Initiation & Appraiser Details",
    fields: [
      { key: "appraisal_type", label: "Appraisal Type", fieldType: "dropdown" },
      { key: "recommended_appraiser", label: "Recommended Appraiser", fieldType: "dropdown" },
      { key: "appraisal_consent", label: "Appraisal Consent", fieldType: "checkbox" },
      { key: "insureds_appraiser", label: "Insured's Appraiser", fieldType: "link to record" },
      { key: "insureds_appraiser_portal_access", label: "Insured's Appraiser - Portal Access", fieldType: "link to record" },
      { key: "carriers_appraiser", label: "Carrier's Appraiser", fieldType: "text" },
      { key: "rp_appraiser", label: "RP Appraiser", fieldType: "dropdown" },
    ],
  },
  {
    name: "Firm Appraisal Demand",
    fields: [
      { key: "appraisal_demand_letter_draft", label: "Appraisal Demand Letter Draft", fieldType: "url" },
      { key: "appraisal_demand_sent_to_ic", label: "Appraisal Demand sent to IC", fieldType: "date" },
      { key: "appraisal_demand_response_due", label: "Appraisal Demand Response Due", fieldType: "formula" },
      { key: "appraisal_demand_escalation_sent_to_ic", label: "Appraisal Demand Escalation sent to IC", fieldType: "date" },
      { key: "appraisal_demand_escalation_response_due", label: "Appraisal Demand Escalation Response Due", fieldType: "formula" },
    ],
  },
  {
    name: "Carrier Appraisal Demand",
    fields: [
      { key: "appraisal_demand_recd_from_ic", label: "Appraisal Demand Rec'd from IC", fieldType: "date" },
      { key: "firm_appraisal_response_due", label: "Firm Appraisal Response Due", fieldType: "formula" },
      { key: "appraisal_response_sent_to_ic", label: "Appraisal Response Sent to IC", fieldType: "date" },
    ],
  },
  {
    name: "Appraisal Response(s) & Docs",
    fields: [
    ],
  },
  {
    name: "Appraiser Progress & Notes",
    fields: [
      { key: "appraiser_next_steps", label: "Appraiser Next Steps", fieldType: "multi dropdown" },
      { key: "show_appraisal_milestone_steps", label: "Show Appraisal Milestone Steps", fieldType: "checkbox" },
      { key: "notes_for_appraiser", label: "Notes for Appraiser", fieldType: "rich text" },
      { key: "appraiser_response_notes", label: "Appraiser Response Notes", fieldType: "rich text" },
    ],
  },
  {
    name: "Appraisal Process Milestone Steps",
    fields: [
      { key: "step_1_initial_appraisal_inspection_scheduled", label: "Step 1: Initial Appraisal Inspection Scheduled", fieldType: "checkbox" },
      { key: "step_1_completed", label: "Step 1 Completed 📅", fieldType: "date" },
      { key: "step_2_site_inspection_completed", label: "Step 2: Site Inspection Completed", fieldType: "checkbox" },
      { key: "step_2_completed", label: "Step 2 Completed 📅", fieldType: "date" },
      { key: "step_3_appraisers_estimate_prepared", label: "Step 3: Appraisers Estimate Prepared", fieldType: "checkbox" },
      { key: "step_3_completed", label: "Step 3 Completed 📅", fieldType: "date" },
      { key: "step_4_appraiser_estimate_exchanged", label: "Step 4: Appraiser Estimate Exchanged ", fieldType: "checkbox" },
      { key: "step_4_completed", label: "Step 4 Completed 📅", fieldType: "date" },
      { key: "step_5_joint_scope_review_conducted", label: "Step 5: Joint Scope Review Conducted", fieldType: "checkbox" },
      { key: "step_5_completed", label: "Step 5 Completed 📅", fieldType: "date" },
      { key: "step_6_umpire_selected", label: "Step 6: Umpire Selected", fieldType: "checkbox" },
      { key: "step_6_completed", label: "Step 6 Completed 📅", fieldType: "date" },
      { key: "step_7_umpire_discussions_initiated", label: "Step 7: Umpire Discussions Initiated", fieldType: "checkbox" },
      { key: "step_7_completed", label: "Step 7 Completed 📅", fieldType: "date" },
      { key: "step_8_court_appointed_umpire_needed", label: "Step 8: Court Appointed Umpire Needed", fieldType: "checkbox" },
      { key: "step_8_completed", label: "Step 8 Completed 📅", fieldType: "date" },
      { key: "step_9_evidence_submitted_to_umpire", label: "Step 9: Evidence Submitted to Umpire", fieldType: "checkbox" },
      { key: "step_9_completed", label: "Step 9 Completed 📅", fieldType: "date" },
      { key: "step_10_umpire_inspection_scheduled", label: "Step 10: Umpire Inspection Scheduled", fieldType: "checkbox" },
      { key: "step_10_completed", label: "Step 10 Completed 📅", fieldType: "date" },
      { key: "step_11_umpire_site_inspection_completed", label: "Step 11: Umpire Site Inspection Completed", fieldType: "checkbox" },
      { key: "step_11_completed", label: "Step 11 Completed 📅", fieldType: "date" },
      { key: "step_12_appraisal_award_finalized", label: "Step 12: Appraisal Award Finalized", fieldType: "checkbox" },
      { key: "step_12_completed", label: "Step 12 Completed 📅", fieldType: "date" },
      { key: "step_13_appraisal_award_signed_and_completed", label: "Step 13: Appraisal Award Signed & Completed", fieldType: "checkbox" },
      { key: "step_13_completed", label: "Step 13 Completed 📅", fieldType: "date" },
    ],
  },
  {
    name: "Umpire Selection & Docs",
    fields: [
      { key: "umpire", label: "Umpire", fieldType: "text" },
      { key: "court_appointed_umpire", label: "Court Appointed Umpire", fieldType: "text" },
      { key: "u_p_county", label: "U/P County", fieldType: "formula" },
      { key: "u_p_mailed_or_e_filed", label: "U/P - Mailed or E-Filed", fieldType: "date" },
      { key: "u_p_sent_to_abc_legal", label: "U/P Sent to ABC Legal", fieldType: "date" },
      { key: "u_p_served_date", label: "U/P Served Date", fieldType: "date" },
      { key: "umpire_hearing_date", label: "Umpire Hearing Date", fieldType: "date" },
    ],
  },
  {
    name: "Appraisal Award & Closing Package",
    fields: [
      { key: "appraisal_closing_package_complete", label: "Appraisal Closing Package Complete", fieldType: "checkbox" },
    ],
  },
  {
    name: "Building Consultant Docs",
    fields: [
      { key: "notes_for_build_consult_review", label: "Notes for Build. Consult. Review", fieldType: "long text" },
      { key: "build_consult_response_notes", label: "Build. Consult. Response Notes", fieldType: "long text" },
      { key: "building_consultant", label: "Building Consultant", fieldType: "link to record" },
      { key: "building_consultant_portal_access", label: "Building Consultant - Portal Access", fieldType: "link to record" },
      { key: "building_cons_firm_request", label: "Building Cons. Firm Request", fieldType: "dropdown" },
      { key: "building_cons_next_steps", label: "Building Cons. Next Steps", fieldType: "dropdown" },
      { key: "building_consult_package_complete", label: "Building Consult. Package Complete", fieldType: "checkbox" },
    ],
  },
  {
    name: "Re-Inspection Details",
    fields: [
      { key: "reinspection_notes", label: "Reinspection Notes", fieldType: "long text" },
      { key: "reinspection_scheduled_date", label: "Reinspection Scheduled Date", fieldType: "date/time" },
      { key: "reinspection_completed", label: "Reinspection Completed", fieldType: "checkbox" },
    ],
  },
  {
    name: "EUO Details",
    fields: [
      { key: "euo_date", label: "EUO Date", fieldType: "date/time" },
      { key: "euo_location", label: "EUO Location", fieldType: "dropdown" },
    ],
  },
  {
    name: "Expert Details & Docs",
    fields: [
      { key: "notes_for_experts_review", label: "Notes for Experts Review", fieldType: "rich text" },
      { key: "expert_response_notes", label: "Expert Response Notes", fieldType: "rich text" },
      { key: "selected_engineer_experts", label: "Selected Engineer/Experts", fieldType: "link to record" },
      { key: "engineer_experts_portal_access", label: "Engineer/Experts - Portal Access", fieldType: "link to record" },
      { key: "expert_firm_request", label: "Expert Firm Request", fieldType: "dropdown" },
      { key: "expert_next_steps", label: "Expert Next Steps", fieldType: "dropdown" },
      { key: "experts_identified_doc", label: "Experts Identified Doc", fieldType: "url" },
      { key: "expert_report_complete", label: "Expert Report Complete", fieldType: "checkbox" },
    ],
  },
  {
    name: "Claim Analysis & Support",
    fields: [
      { key: "cat_4_notes", label: "Cat 4 Notes", fieldType: "rich text" },
    ],
  },
  {
    name: "Summons & Complaint Details",
    fields: [
      { key: "litigation_consent", label: "Litigation Consent", fieldType: "checkbox" },
      { key: "county", label: "County", fieldType: "dropdown" },
      { key: "s_c_approved", label: "S/C Approved", fieldType: "checkbox" },
      { key: "s_c_mailed_or_e_filed", label: "S/C - Mailed or E-Filed", fieldType: "date" },
      { key: "s_c_sent_for_service", label: "S/C sent for Service", fieldType: "date" },
      { key: "s_c_served_date", label: "S/C Served Date", fieldType: "date" },
    ],
  },
  {
    name: "Answer",
    fields: [
      { key: "answer_due_date", label: "Answer Due Date", fieldType: "date" },
    ],
  },
  {
    name: "Discovery to Defendant",
    fields: [
      { key: "discovery_to_def_due_date", label: "Discovery to Def Due Date", fieldType: "date" },
    ],
  },
  {
    name: "Discovery from Defendant",
    fields: [
      { key: "discovery_from_def_due_date", label: "Discovery from Def Due Date", fieldType: "date" },
    ],
  },
  {
    name: "Default",
    fields: [
    ],
  },
  {
    name: "Depositions",
    fields: [
      { key: "deposition_date", label: "Deposition Date", fieldType: "date/time" },
      { key: "deposition_location", label: "Deposition Location", fieldType: "dropdown" },
      { key: "deposition_meeting_link", label: "Deposition Meeting Link", fieldType: "url" },
    ],
  },
  {
    name: "Subpoenas",
    fields: [
      { key: "subpoena_docs_due", label: "Subpoena Docs Due", fieldType: "date/time" },
    ],
  },
  {
    name: "Motions",
    fields: [
      { key: "motions_hearing_date", label: "Motions Hearing Date", fieldType: "date/time" },
      { key: "motions_location", label: "Motions Location", fieldType: "dropdown" },
    ],
  },
  {
    name: "Mediation",
    fields: [
      { key: "mediation_date", label: "Mediation Date", fieldType: "date/time" },
      { key: "mediation_deadline_date", label: "Mediation Deadline Date", fieldType: "date/time" },
      { key: "mediation_location", label: "Mediation Location", fieldType: "dropdown" },
      { key: "selected_mediator", label: "Selected Mediator", fieldType: "dropdown" },
    ],
  },
  {
    name: "Trial",
    fields: [
      { key: "trial_date", label: "Trial Date", fieldType: "date/time" },
    ],
  },
  {
    name: "Appeals, Dismissals, and Refiling Deadlines",
    fields: [
      { key: "vd_filing_date", label: "VD Filing Date", fieldType: "date" },
      { key: "refiling_deadline", label: "Refiling Deadline", fieldType: "formula" },
    ],
  },
  {
    name: "Litigation Docs",
    fields: [
    ],
  },
  {
    name: "Litigation Fees & Invoices",
    fields: [
      { key: "clg_legal_fee", label: "CLG Legal Fee %", fieldType: "dropdown" },
      { key: "filing_costs", label: "Filing Costs", fieldType: "money" },
      { key: "doi_service_costs", label: "DOI Service Costs", fieldType: "money" },
      { key: "motion_costs", label: "Motion Costs", fieldType: "money" },
      { key: "weather_report_costs", label: "Weather Report Costs", fieldType: "money" },
      { key: "appraiser_costs", label: "Appraiser Costs", fieldType: "money" },
      { key: "building_consultant_costs", label: "Building Consultant Costs", fieldType: "money" },
      { key: "certified_mailing", label: "Certified Mailing", fieldType: "money" },
      { key: "deposition_costs", label: "Deposition Costs", fieldType: "money" },
      { key: "mediation_costs", label: "Mediation Costs", fieldType: "money" },
      { key: "expert_costs", label: "Expert Costs", fieldType: "money" },
      { key: "umpire_costs", label: "Umpire Costs", fieldType: "money" },
    ],
  },
  {
    name: "Settlement Docs & Disengagement",
    fields: [
      { key: "reason_for_disengagement", label: "Reason for Disengagement", fieldType: "rich text" },
      { key: "clg_settlement_statement", label: "CLG - Settlement Statement", fieldType: "url" },
      { key: "settled_date", label: "Settled Date", fieldType: "date" },
      { key: "global_settlement_amount", label: "Global Settlement Amount", fieldType: "money" },
      { key: "litigation_increase", label: "Litigation Increase", fieldType: "money" },
      { key: "outstanding_funds", label: "Outstanding Funds", fieldType: "money" },
      { key: "rp_estimate", label: "% RP Estimate", fieldType: "formula" },
      { key: "release_coc_sent_to_ic", label: "Release/COC Sent to IC", fieldType: "date" },
    ],
  },
  {
    name: "Referral Partner",
    fields: [
      { key: "rp_claims_contact", label: "RP Claims Contact", fieldType: "rich text" },
      { key: "referral_partner", label: "Referral Partner", fieldType: "link to record" },
      { key: "referred_original_case", label: "Referred Original Case", fieldType: "link to record" },
    ],
  },
  {
    name: "Portal Access",
    fields: [
      { key: "referred_firm_portal_access", label: "Referred Firm - Portal Access", fieldType: "link to record" },
      { key: "associate_counsel_portal_access", label: "Associate Counsel - Portal Access", fieldType: "link to record" },
      { key: "referral_partner_portal_access", label: "Referral Partner - Portal Access", fieldType: "link to record" },
    ],
  },
  {
    name: "Conveyor Activity Log",
    fields: [
      { key: "conveyor_activity_log", label: "Conveyor Activity Log", fieldType: "rich text" },
    ],
  },
  {
    name: "Conveyor Drafts",
    fields: [
    ],
  },
] as const satisfies readonly CasePageSection[];

export function caseSectionAnchor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Dest columns already shown on the case page. Not identity keys. */
export function listCasePageDestFields(): CasePageField[] {
  return CASE_PAGE_SECTIONS.flatMap((section) => [...section.fields]);
}

export const CASE_NOTES_KEYS = [
  "law_firm_notes",
  "resolutions_notes",
  "attorney_only_notes",
  "accounting_notes",
] as const satisfies ReadonlyArray<CasePageField["key"]>;

export function isCaseNotesField(
  key: string,
): key is (typeof CASE_NOTES_KEYS)[number] {
  return (CASE_NOTES_KEYS as readonly string[]).includes(key);
}

