/**
 * Generated from the live conveyordb-testing schema (ref eskwbmtqtzqssbhyzjmv).
 * Do not invent columns. Refresh with Supabase generate_typescript_types.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      cases: {
        Row: {
          accounting_next_steps: string | null
          accounting_notes: string | null
          airtable_id: string | null
          amount_to_collect: string | null
          answer_due_date: string | null
          appraisal_closing_package_complete: boolean | null
          appraisal_completed_date_checkbox: string | null
          appraisal_consent: boolean | null
          appraisal_demand_escalation_response_due: string | null
          appraisal_demand_escalation_sent_to_ic: string | null
          appraisal_demand_letter_draft: string | null
          appraisal_demand_recd_from_ic: string | null
          appraisal_demand_response_due: string | null
          appraisal_demand_sent_to_ic: string | null
          appraisal_response_sent_to_ic: string | null
          appraisal_type: string | null
          appraiser_costs: number | null
          appraiser_email: string | null
          appraiser_next_steps: string[] | null
          appraiser_paid: boolean | null
          appraiser_response_notes: string | null
          appraisers_from_appraiser_user: string | null
          assoc_counsel_fee_split: string | null
          associate_counsel: string | null
          associate_counsel_from_associate_counsel_portal_access: string | null
          associate_counsel_portal_access: string | null
          associated_cases: string | null
          attorney_only_notes: string | null
          attorney_repd: boolean | null
          atty_client_appt: string | null
          atty_due_date: string | null
          autonum: number | null
          build_consult_response_notes: string | null
          building_cons_firm_request: string | null
          building_cons_next_steps: string | null
          building_consult_package_complete: boolean | null
          building_consultant: string | null
          building_consultant_costs: number | null
          building_consultant_from_building_consultant_user: string | null
          building_consultant_paid: boolean | null
          building_consultant_portal_access: string | null
          carriers_appraiser: string | null
          case_documents: string | null
          case_id: string | null
          case_number: string | null
          case_status: string | null
          case_status_sort: string | null
          cat_4_notes: string | null
          category_type: string[] | null
          cause_of_loss: string[] | null
          certified_mailing: number | null
          certified_policy_received: boolean | null
          check_1_amount: number | null
          check_1_assoc_co_fee: string | null
          check_1_assoc_co_fee_bwlyg3: number | null
          check_1_clg_net: string | null
          check_1_client_net_disb: string | null
          check_1_co_counsel_fee: string | null
          check_1_co_counsel_fee_opb5hf: number | null
          check_1_deposit_date: string | null
          check_1_legal_fee: number | null
          check_1_legal_fee_i23za2: string | null
          check_1_pa_fee: number | null
          check_1_pa_fee_percent: string | null
          check_1_pa_invoice: number | null
          check_1_rp_fee_split: number | null
          check_1_rp_fee_split_nudxhk: string | null
          check_1_rs_bonus: string | null
          check_1_rs_bonus_2tida6: number | null
          check_1_settl_client_net_disb: string | null
          check_1_type: string | null
          check_2_amount: number | null
          check_2_assoc_co_fee: number | null
          check_2_assoc_co_fee_9lifwm: string | null
          check_2_clg_net: string | null
          check_2_client_net_disb: string | null
          check_2_co_counsel_fee: number | null
          check_2_co_counsel_fee_hghzxa: string | null
          check_2_deposit_date: string | null
          check_2_legal_fee: number | null
          check_2_legal_fee_szqe6j: string | null
          check_2_pa_fee: number | null
          check_2_pa_fee_percent: string | null
          check_2_pa_invoice: number | null
          check_2_rp_fee_split: number | null
          check_2_rp_fee_split_rqfdcf: string | null
          check_2_rs_bonus: number | null
          check_2_rs_bonus_admkgy: string | null
          check_2_settl_client_net_disb: string | null
          check_2_type: string | null
          check_3_amount: number | null
          check_3_assoc_co_fee: number | null
          check_3_assoc_co_fee_im7hpx: string | null
          check_3_clg_net: string | null
          check_3_client_net_disb: string | null
          check_3_co_counsel_fee: number | null
          check_3_co_counsel_fee_zfpkb2: string | null
          check_3_deposit_date: string | null
          check_3_legal_fee: number | null
          check_3_legal_fee_i9ooxd: string | null
          check_3_pa_fee: number | null
          check_3_pa_fee_percent: string | null
          check_3_pa_invoice: number | null
          check_3_rp_fee_split: number | null
          check_3_rp_fee_split_rmedsj: string | null
          check_3_rs_bonus: number | null
          check_3_rs_bonus_udfjxm: string | null
          check_3_settl_client_net_disb: string | null
          check_3_type: string | null
          check_4_amount: number | null
          check_4_assoc_co_fee: number | null
          check_4_assoc_co_fee_fpy85s: string | null
          check_4_clg_net: string | null
          check_4_client_net_disb: string | null
          check_4_co_counsel_fee: number | null
          check_4_co_counsel_fee_dxoy1o: string | null
          check_4_deposit_date: string | null
          check_4_legal_fee: number | null
          check_4_legal_fee_ya5yoq: string | null
          check_4_pa_fee: number | null
          check_4_pa_fee_percent: string | null
          check_4_pa_invoice: number | null
          check_4_rp_fee_split: number | null
          check_4_rp_fee_split_6dd0bl: string | null
          check_4_rs_bonus: number | null
          check_4_rs_bonus_dnzmsr: string | null
          check_4_settl_client_net_disb: string | null
          check_4_type: string | null
          check_5_amount: number | null
          check_5_assoc_co_fee: number | null
          check_5_assoc_co_fee_nerzsd: string | null
          check_5_clg_net: string | null
          check_5_client_net_disb: string | null
          check_5_co_counsel_fee: number | null
          check_5_co_counsel_fee_aeng4e: string | null
          check_5_deposit_date: string | null
          check_5_legal_fee: number | null
          check_5_legal_fee_cqjbxi: string | null
          check_5_pa_fee: number | null
          check_5_pa_fee_percent: string | null
          check_5_pa_invoice: number | null
          check_5_rp_fee_split: number | null
          check_5_rp_fee_split_3o3lpn: string | null
          check_5_rs_bonus: number | null
          check_5_rs_bonus_ejo79s: string | null
          check_5_settl_client_net_disb: string | null
          check_5_type: string | null
          cid_due_date: string | null
          claim_no: string | null
          claim_number: string | null
          claim_state: string | null
          claim_tasks: string | null
          claim_type: string[] | null
          clg_demo_staff_from_associate_counsel_portal_access: string | null
          clg_demo_staff_from_conveyor_users_2: string | null
          clg_legal_fee: string | null
          clg_settlement_statement: string | null
          clg_settlement_statement_complete: boolean | null
          clg_staff_from_appraiser_user: string | null
          clg_staff_from_associate_counsel_portal_access: string | null
          clg_staff_from_building_consult_user: string | null
          clg_staff_from_conveyor_users_2: string | null
          clg_staff_from_engineer_expert_user: string | null
          clg_staff_from_referral_partner_user: string | null
          client_alt_phone_number: string | null
          client_estimate_amount: number | null
          client_name: string | null
          client_phone_number: string | null
          client_profile: string | null
          client_rating: string | null
          co_counsel_attorney_and_staff_from_conveyor_users_2: string | null
          co_counsel_email: string | null
          co_counsel_email_text: string | null
          co_counsel_fee_split: string | null
          comments: string | null
          contractor: string | null
          conveyor_activity_log: string | null
          counsel_legal_name: string | null
          county: string | null
          court_appointed_umpire: string | null
          create_invoice: boolean | null
          create_time: string | null
          created_at: string
          created_by: string | null
          current_desk_adjuster: string | null
          current_ic_offer: number | null
          current_opposing_counsel: string | null
          da_oc: string | null
          date_of_breach: string | null
          date_of_loss: string | null
          days_pending_w_appraiser: string | null
          days_since_retained: string | null
          deductible_amount: number | null
          demand_letter_editable: string | null
          department: string | null
          deposition_costs: number | null
          deposition_date: string | null
          deposition_location: string | null
          deposition_meeting_link: string | null
          deposition_paid: boolean | null
          desk_adjuster_email: string | null
          discovery_from_def_due_date: string | null
          discovery_to_def_due_date: string | null
          diseng_email_to_rp_sent: boolean | null
          dob_deadline: string | null
          doi_service_costs: number | null
          dol: string | null
          email: string | null
          emails: string | null
          engineer_expert_from_expert_users: string | null
          engineer_experts_portal_access: string | null
          euo_date: string | null
          euo_location: string | null
          everson_files: string | null
          expert_costs: number | null
          expert_firm_request: string | null
          expert_next_steps: string | null
          expert_report_complete: boolean | null
          expert_response_notes: string | null
          experts_identified_doc: string | null
          experts_paid: boolean | null
          external_documentation_links: string | null
          f_60_day_notice_date: string | null
          f_60_day_notice_sent: boolean | null
          filing_costs: number | null
          firm_appraisal_response_due: string | null
          from_field_associated_client_cases: string | null
          global_settlement_amount: number | null
          ic_adjuster_contact_info: string | null
          ic_docs_and_communications: boolean | null
          ic_rcv_estimate_amount: number | null
          id: string
          insurance_co: string | null
          insurance_company: string | null
          insureds_appraiser: string | null
          insureds_appraiser_assigned: string | null
          insureds_appraiser_portal_access: string | null
          invoices: string | null
          last_modified: string | null
          last_modified_by: string | null
          latest_undisp_check_amt: number | null
          law_firm_notes: string | null
          litigation_consent: boolean | null
          litigation_fees_and_costs: string | null
          litigation_increase: number | null
          lor_dl_sent_to_ic: string | null
          mailing_address: string | null
          mediation_costs: number | null
          mediation_date: string | null
          mediation_deadline_date: string | null
          mediation_location: string | null
          mediation_paid: boolean | null
          motion_costs: number | null
          motions_hearing_date: string | null
          motions_location: string | null
          motions_paid: boolean | null
          nc_call_completed: boolean | null
          next_client_comm_due_date: string | null
          next_steps: string[] | null
          notes_for_appraiser: string | null
          notes_for_build_consult_review: string | null
          notes_for_experts_review: string | null
          of_est: string | null
          opposing_counsel_contact_info: string | null
          opposing_counsel_email: string | null
          opposing_counsel_firm: string | null
          outstanding_funds: number | null
          pa_fee: string | null
          paralegal: string | null
          payment_summary_sol_received: boolean | null
          pl_due_date: string | null
          pl_email: string | null
          policy_number: string | null
          property_address: string | null
          property_type: string | null
          rcv_disputed_amount: string | null
          reason_for_disengagement: string | null
          recent_client_comm_date: string | null
          recommended_appraiser: string | null
          referral_case_id: string | null
          referral_email_recd: boolean | null
          referral_partner: string | null
          referral_partner_email_lookup: string | null
          referral_partner_from_referral_partner_user: string | null
          referral_partner_portal_access: string | null
          referred_firm: string | null
          referred_firm_portal_access: string | null
          referred_original_case: string | null
          refiling_deadline: string | null
          reinspection_completed: boolean | null
          reinspection_notes: string | null
          reinspection_scheduled_date: string | null
          release_coc_sent_to_ic: string | null
          resolutions_notes: string | null
          resolutions_specialist: string | null
          retainer_sent: string | null
          retainer_signed_date: string | null
          rp_appraiser: string | null
          rp_claim_fee: number | null
          rp_claim_summary_for_litigation: string | null
          rp_claims_contact: string | null
          rp_estimate: string | null
          rp_fee_split: string | null
          rp_next_steps: string[] | null
          rs_bonus: string | null
          rs_due_date: string | null
          rs_email: string | null
          s_c_approved: boolean | null
          s_c_mailed_or_e_filed: string | null
          s_c_sent_for_service: string | null
          s_c_served_date: string | null
          selected_engineer_experts: string | null
          selected_mediator: string | null
          settled_date: string | null
          settlement_check_amt: number | null
          settlement_statement_sent: boolean | null
          show_appraisal_milestone_steps: boolean | null
          sms_consent: string | null
          sol_deadline: string | null
          sol_deadline_notification: string | null
          squares: number | null
          step_1_completed: string | null
          step_1_initial_appraisal_inspection_scheduled: boolean | null
          step_10_completed: string | null
          step_10_umpire_inspection_scheduled: boolean | null
          step_11_completed: string | null
          step_11_umpire_site_inspection_completed: boolean | null
          step_12_appraisal_award_finalized: boolean | null
          step_12_completed: string | null
          step_13_appraisal_award_signed_and_completed: boolean | null
          step_13_completed: string | null
          step_2_completed: string | null
          step_2_site_inspection_completed: boolean | null
          step_3_appraisers_estimate_prepared: boolean | null
          step_3_completed: string | null
          step_4_appraiser_estimate_exchanged: boolean | null
          step_4_completed: string | null
          step_5_completed: string | null
          step_5_joint_scope_review_conducted: boolean | null
          step_6_completed: string | null
          step_6_umpire_selected: boolean | null
          step_7_completed: string | null
          step_7_umpire_discussions_initiated: boolean | null
          step_8_completed: string | null
          step_8_court_appointed_umpire_needed: boolean | null
          step_9_completed: string | null
          step_9_evidence_submitted_to_umpire: boolean | null
          subpoena_docs_due: string | null
          sum_of_assoc_co_fee: string | null
          sum_of_checks_received: string | null
          sum_of_clg_net: string | null
          sum_of_client_net_disb: string | null
          sum_of_co_counsel_fee: string | null
          sum_of_legal_fees: string | null
          sum_of_pa_fee_percent: string | null
          sum_of_rp_fee_split_fee: string | null
          sum_of_rs_fee: string | null
          sum_of_settle_client_net_disb: string | null
          temp_case_docs: boolean | null
          total_loss: string | null
          total_paid_to_date: number | null
          trial_date: string | null
          u_p_county: string | null
          u_p_mailed_or_e_filed: string | null
          u_p_sent_to_abc_legal: string | null
          u_p_served_date: string | null
          umpire: string | null
          umpire_costs: number | null
          umpire_hearing_date: string | null
          umpire_paid: boolean | null
          updated_at: string
          vd_filing_date: string | null
          weather_report_costs: number | null
          welcome_email_sent: string | null
        }
        Insert: {
          accounting_next_steps?: string | null
          accounting_notes?: string | null
          airtable_id?: string | null
          amount_to_collect?: string | null
          answer_due_date?: string | null
          appraisal_closing_package_complete?: boolean | null
          appraisal_completed_date_checkbox?: string | null
          appraisal_consent?: boolean | null
          appraisal_demand_escalation_response_due?: string | null
          appraisal_demand_escalation_sent_to_ic?: string | null
          appraisal_demand_letter_draft?: string | null
          appraisal_demand_recd_from_ic?: string | null
          appraisal_demand_response_due?: string | null
          appraisal_demand_sent_to_ic?: string | null
          appraisal_response_sent_to_ic?: string | null
          appraisal_type?: string | null
          appraiser_costs?: number | null
          appraiser_email?: string | null
          appraiser_next_steps?: string[] | null
          appraiser_paid?: boolean | null
          appraiser_response_notes?: string | null
          appraisers_from_appraiser_user?: string | null
          assoc_counsel_fee_split?: string | null
          associate_counsel?: string | null
          associate_counsel_from_associate_counsel_portal_access?: string | null
          associate_counsel_portal_access?: string | null
          associated_cases?: string | null
          attorney_only_notes?: string | null
          attorney_repd?: boolean | null
          atty_client_appt?: string | null
          atty_due_date?: string | null
          autonum?: number | null
          build_consult_response_notes?: string | null
          building_cons_firm_request?: string | null
          building_cons_next_steps?: string | null
          building_consult_package_complete?: boolean | null
          building_consultant?: string | null
          building_consultant_costs?: number | null
          building_consultant_from_building_consultant_user?: string | null
          building_consultant_paid?: boolean | null
          building_consultant_portal_access?: string | null
          carriers_appraiser?: string | null
          case_documents?: string | null
          case_id?: string | null
          case_number?: string | null
          case_status?: string | null
          case_status_sort?: string | null
          cat_4_notes?: string | null
          category_type?: string[] | null
          cause_of_loss?: string[] | null
          certified_mailing?: number | null
          certified_policy_received?: boolean | null
          check_1_amount?: number | null
          check_1_assoc_co_fee?: string | null
          check_1_assoc_co_fee_bwlyg3?: number | null
          check_1_clg_net?: string | null
          check_1_client_net_disb?: string | null
          check_1_co_counsel_fee?: string | null
          check_1_co_counsel_fee_opb5hf?: number | null
          check_1_deposit_date?: string | null
          check_1_legal_fee?: number | null
          check_1_legal_fee_i23za2?: string | null
          check_1_pa_fee?: number | null
          check_1_pa_fee_percent?: string | null
          check_1_pa_invoice?: number | null
          check_1_rp_fee_split?: number | null
          check_1_rp_fee_split_nudxhk?: string | null
          check_1_rs_bonus?: string | null
          check_1_rs_bonus_2tida6?: number | null
          check_1_settl_client_net_disb?: string | null
          check_1_type?: string | null
          check_2_amount?: number | null
          check_2_assoc_co_fee?: number | null
          check_2_assoc_co_fee_9lifwm?: string | null
          check_2_clg_net?: string | null
          check_2_client_net_disb?: string | null
          check_2_co_counsel_fee?: number | null
          check_2_co_counsel_fee_hghzxa?: string | null
          check_2_deposit_date?: string | null
          check_2_legal_fee?: number | null
          check_2_legal_fee_szqe6j?: string | null
          check_2_pa_fee?: number | null
          check_2_pa_fee_percent?: string | null
          check_2_pa_invoice?: number | null
          check_2_rp_fee_split?: number | null
          check_2_rp_fee_split_rqfdcf?: string | null
          check_2_rs_bonus?: number | null
          check_2_rs_bonus_admkgy?: string | null
          check_2_settl_client_net_disb?: string | null
          check_2_type?: string | null
          check_3_amount?: number | null
          check_3_assoc_co_fee?: number | null
          check_3_assoc_co_fee_im7hpx?: string | null
          check_3_clg_net?: string | null
          check_3_client_net_disb?: string | null
          check_3_co_counsel_fee?: number | null
          check_3_co_counsel_fee_zfpkb2?: string | null
          check_3_deposit_date?: string | null
          check_3_legal_fee?: number | null
          check_3_legal_fee_i9ooxd?: string | null
          check_3_pa_fee?: number | null
          check_3_pa_fee_percent?: string | null
          check_3_pa_invoice?: number | null
          check_3_rp_fee_split?: number | null
          check_3_rp_fee_split_rmedsj?: string | null
          check_3_rs_bonus?: number | null
          check_3_rs_bonus_udfjxm?: string | null
          check_3_settl_client_net_disb?: string | null
          check_3_type?: string | null
          check_4_amount?: number | null
          check_4_assoc_co_fee?: number | null
          check_4_assoc_co_fee_fpy85s?: string | null
          check_4_clg_net?: string | null
          check_4_client_net_disb?: string | null
          check_4_co_counsel_fee?: number | null
          check_4_co_counsel_fee_dxoy1o?: string | null
          check_4_deposit_date?: string | null
          check_4_legal_fee?: number | null
          check_4_legal_fee_ya5yoq?: string | null
          check_4_pa_fee?: number | null
          check_4_pa_fee_percent?: string | null
          check_4_pa_invoice?: number | null
          check_4_rp_fee_split?: number | null
          check_4_rp_fee_split_6dd0bl?: string | null
          check_4_rs_bonus?: number | null
          check_4_rs_bonus_dnzmsr?: string | null
          check_4_settl_client_net_disb?: string | null
          check_4_type?: string | null
          check_5_amount?: number | null
          check_5_assoc_co_fee?: number | null
          check_5_assoc_co_fee_nerzsd?: string | null
          check_5_clg_net?: string | null
          check_5_client_net_disb?: string | null
          check_5_co_counsel_fee?: number | null
          check_5_co_counsel_fee_aeng4e?: string | null
          check_5_deposit_date?: string | null
          check_5_legal_fee?: number | null
          check_5_legal_fee_cqjbxi?: string | null
          check_5_pa_fee?: number | null
          check_5_pa_fee_percent?: string | null
          check_5_pa_invoice?: number | null
          check_5_rp_fee_split?: number | null
          check_5_rp_fee_split_3o3lpn?: string | null
          check_5_rs_bonus?: number | null
          check_5_rs_bonus_ejo79s?: string | null
          check_5_settl_client_net_disb?: string | null
          check_5_type?: string | null
          cid_due_date?: string | null
          claim_no?: string | null
          claim_number?: string | null
          claim_state?: string | null
          claim_tasks?: string | null
          claim_type?: string[] | null
          clg_demo_staff_from_associate_counsel_portal_access?: string | null
          clg_demo_staff_from_conveyor_users_2?: string | null
          clg_legal_fee?: string | null
          clg_settlement_statement?: string | null
          clg_settlement_statement_complete?: boolean | null
          clg_staff_from_appraiser_user?: string | null
          clg_staff_from_associate_counsel_portal_access?: string | null
          clg_staff_from_building_consult_user?: string | null
          clg_staff_from_conveyor_users_2?: string | null
          clg_staff_from_engineer_expert_user?: string | null
          clg_staff_from_referral_partner_user?: string | null
          client_alt_phone_number?: string | null
          client_estimate_amount?: number | null
          client_name?: string | null
          client_phone_number?: string | null
          client_profile?: string | null
          client_rating?: string | null
          co_counsel_attorney_and_staff_from_conveyor_users_2?: string | null
          co_counsel_email?: string | null
          co_counsel_email_text?: string | null
          co_counsel_fee_split?: string | null
          comments?: string | null
          contractor?: string | null
          conveyor_activity_log?: string | null
          counsel_legal_name?: string | null
          county?: string | null
          court_appointed_umpire?: string | null
          create_invoice?: boolean | null
          create_time?: string | null
          created_at?: string
          created_by?: string | null
          current_desk_adjuster?: string | null
          current_ic_offer?: number | null
          current_opposing_counsel?: string | null
          da_oc?: string | null
          date_of_breach?: string | null
          date_of_loss?: string | null
          days_pending_w_appraiser?: string | null
          days_since_retained?: string | null
          deductible_amount?: number | null
          demand_letter_editable?: string | null
          department?: string | null
          deposition_costs?: number | null
          deposition_date?: string | null
          deposition_location?: string | null
          deposition_meeting_link?: string | null
          deposition_paid?: boolean | null
          desk_adjuster_email?: string | null
          discovery_from_def_due_date?: string | null
          discovery_to_def_due_date?: string | null
          diseng_email_to_rp_sent?: boolean | null
          dob_deadline?: string | null
          doi_service_costs?: number | null
          dol?: string | null
          email?: string | null
          emails?: string | null
          engineer_expert_from_expert_users?: string | null
          engineer_experts_portal_access?: string | null
          euo_date?: string | null
          euo_location?: string | null
          everson_files?: string | null
          expert_costs?: number | null
          expert_firm_request?: string | null
          expert_next_steps?: string | null
          expert_report_complete?: boolean | null
          expert_response_notes?: string | null
          experts_identified_doc?: string | null
          experts_paid?: boolean | null
          external_documentation_links?: string | null
          f_60_day_notice_date?: string | null
          f_60_day_notice_sent?: boolean | null
          filing_costs?: number | null
          firm_appraisal_response_due?: string | null
          from_field_associated_client_cases?: string | null
          global_settlement_amount?: number | null
          ic_adjuster_contact_info?: string | null
          ic_docs_and_communications?: boolean | null
          ic_rcv_estimate_amount?: number | null
          id?: string
          insurance_co?: string | null
          insurance_company?: string | null
          insureds_appraiser?: string | null
          insureds_appraiser_assigned?: string | null
          insureds_appraiser_portal_access?: string | null
          invoices?: string | null
          last_modified?: string | null
          last_modified_by?: string | null
          latest_undisp_check_amt?: number | null
          law_firm_notes?: string | null
          litigation_consent?: boolean | null
          litigation_fees_and_costs?: string | null
          litigation_increase?: number | null
          lor_dl_sent_to_ic?: string | null
          mailing_address?: string | null
          mediation_costs?: number | null
          mediation_date?: string | null
          mediation_deadline_date?: string | null
          mediation_location?: string | null
          mediation_paid?: boolean | null
          motion_costs?: number | null
          motions_hearing_date?: string | null
          motions_location?: string | null
          motions_paid?: boolean | null
          nc_call_completed?: boolean | null
          next_client_comm_due_date?: string | null
          next_steps?: string[] | null
          notes_for_appraiser?: string | null
          notes_for_build_consult_review?: string | null
          notes_for_experts_review?: string | null
          of_est?: string | null
          opposing_counsel_contact_info?: string | null
          opposing_counsel_email?: string | null
          opposing_counsel_firm?: string | null
          outstanding_funds?: number | null
          pa_fee?: string | null
          paralegal?: string | null
          payment_summary_sol_received?: boolean | null
          pl_due_date?: string | null
          pl_email?: string | null
          policy_number?: string | null
          property_address?: string | null
          property_type?: string | null
          rcv_disputed_amount?: string | null
          reason_for_disengagement?: string | null
          recent_client_comm_date?: string | null
          recommended_appraiser?: string | null
          referral_case_id?: string | null
          referral_email_recd?: boolean | null
          referral_partner?: string | null
          referral_partner_email_lookup?: string | null
          referral_partner_from_referral_partner_user?: string | null
          referral_partner_portal_access?: string | null
          referred_firm?: string | null
          referred_firm_portal_access?: string | null
          referred_original_case?: string | null
          refiling_deadline?: string | null
          reinspection_completed?: boolean | null
          reinspection_notes?: string | null
          reinspection_scheduled_date?: string | null
          release_coc_sent_to_ic?: string | null
          resolutions_notes?: string | null
          resolutions_specialist?: string | null
          retainer_sent?: string | null
          retainer_signed_date?: string | null
          rp_appraiser?: string | null
          rp_claim_fee?: number | null
          rp_claim_summary_for_litigation?: string | null
          rp_claims_contact?: string | null
          rp_estimate?: string | null
          rp_fee_split?: string | null
          rp_next_steps?: string[] | null
          rs_bonus?: string | null
          rs_due_date?: string | null
          rs_email?: string | null
          s_c_approved?: boolean | null
          s_c_mailed_or_e_filed?: string | null
          s_c_sent_for_service?: string | null
          s_c_served_date?: string | null
          selected_engineer_experts?: string | null
          selected_mediator?: string | null
          settled_date?: string | null
          settlement_check_amt?: number | null
          settlement_statement_sent?: boolean | null
          show_appraisal_milestone_steps?: boolean | null
          sms_consent?: string | null
          sol_deadline?: string | null
          sol_deadline_notification?: string | null
          squares?: number | null
          step_1_completed?: string | null
          step_1_initial_appraisal_inspection_scheduled?: boolean | null
          step_10_completed?: string | null
          step_10_umpire_inspection_scheduled?: boolean | null
          step_11_completed?: string | null
          step_11_umpire_site_inspection_completed?: boolean | null
          step_12_appraisal_award_finalized?: boolean | null
          step_12_completed?: string | null
          step_13_appraisal_award_signed_and_completed?: boolean | null
          step_13_completed?: string | null
          step_2_completed?: string | null
          step_2_site_inspection_completed?: boolean | null
          step_3_appraisers_estimate_prepared?: boolean | null
          step_3_completed?: string | null
          step_4_appraiser_estimate_exchanged?: boolean | null
          step_4_completed?: string | null
          step_5_completed?: string | null
          step_5_joint_scope_review_conducted?: boolean | null
          step_6_completed?: string | null
          step_6_umpire_selected?: boolean | null
          step_7_completed?: string | null
          step_7_umpire_discussions_initiated?: boolean | null
          step_8_completed?: string | null
          step_8_court_appointed_umpire_needed?: boolean | null
          step_9_completed?: string | null
          step_9_evidence_submitted_to_umpire?: boolean | null
          subpoena_docs_due?: string | null
          sum_of_assoc_co_fee?: string | null
          sum_of_checks_received?: string | null
          sum_of_clg_net?: string | null
          sum_of_client_net_disb?: string | null
          sum_of_co_counsel_fee?: string | null
          sum_of_legal_fees?: string | null
          sum_of_pa_fee_percent?: string | null
          sum_of_rp_fee_split_fee?: string | null
          sum_of_rs_fee?: string | null
          sum_of_settle_client_net_disb?: string | null
          temp_case_docs?: boolean | null
          total_loss?: string | null
          total_paid_to_date?: number | null
          trial_date?: string | null
          u_p_county?: string | null
          u_p_mailed_or_e_filed?: string | null
          u_p_sent_to_abc_legal?: string | null
          u_p_served_date?: string | null
          umpire?: string | null
          umpire_costs?: number | null
          umpire_hearing_date?: string | null
          umpire_paid?: boolean | null
          updated_at?: string
          vd_filing_date?: string | null
          weather_report_costs?: number | null
          welcome_email_sent?: string | null
        }
        Update: {
          accounting_next_steps?: string | null
          accounting_notes?: string | null
          airtable_id?: string | null
          amount_to_collect?: string | null
          answer_due_date?: string | null
          appraisal_closing_package_complete?: boolean | null
          appraisal_completed_date_checkbox?: string | null
          appraisal_consent?: boolean | null
          appraisal_demand_escalation_response_due?: string | null
          appraisal_demand_escalation_sent_to_ic?: string | null
          appraisal_demand_letter_draft?: string | null
          appraisal_demand_recd_from_ic?: string | null
          appraisal_demand_response_due?: string | null
          appraisal_demand_sent_to_ic?: string | null
          appraisal_response_sent_to_ic?: string | null
          appraisal_type?: string | null
          appraiser_costs?: number | null
          appraiser_email?: string | null
          appraiser_next_steps?: string[] | null
          appraiser_paid?: boolean | null
          appraiser_response_notes?: string | null
          appraisers_from_appraiser_user?: string | null
          assoc_counsel_fee_split?: string | null
          associate_counsel?: string | null
          associate_counsel_from_associate_counsel_portal_access?: string | null
          associate_counsel_portal_access?: string | null
          associated_cases?: string | null
          attorney_only_notes?: string | null
          attorney_repd?: boolean | null
          atty_client_appt?: string | null
          atty_due_date?: string | null
          autonum?: number | null
          build_consult_response_notes?: string | null
          building_cons_firm_request?: string | null
          building_cons_next_steps?: string | null
          building_consult_package_complete?: boolean | null
          building_consultant?: string | null
          building_consultant_costs?: number | null
          building_consultant_from_building_consultant_user?: string | null
          building_consultant_paid?: boolean | null
          building_consultant_portal_access?: string | null
          carriers_appraiser?: string | null
          case_documents?: string | null
          case_id?: string | null
          case_number?: string | null
          case_status?: string | null
          case_status_sort?: string | null
          cat_4_notes?: string | null
          category_type?: string[] | null
          cause_of_loss?: string[] | null
          certified_mailing?: number | null
          certified_policy_received?: boolean | null
          check_1_amount?: number | null
          check_1_assoc_co_fee?: string | null
          check_1_assoc_co_fee_bwlyg3?: number | null
          check_1_clg_net?: string | null
          check_1_client_net_disb?: string | null
          check_1_co_counsel_fee?: string | null
          check_1_co_counsel_fee_opb5hf?: number | null
          check_1_deposit_date?: string | null
          check_1_legal_fee?: number | null
          check_1_legal_fee_i23za2?: string | null
          check_1_pa_fee?: number | null
          check_1_pa_fee_percent?: string | null
          check_1_pa_invoice?: number | null
          check_1_rp_fee_split?: number | null
          check_1_rp_fee_split_nudxhk?: string | null
          check_1_rs_bonus?: string | null
          check_1_rs_bonus_2tida6?: number | null
          check_1_settl_client_net_disb?: string | null
          check_1_type?: string | null
          check_2_amount?: number | null
          check_2_assoc_co_fee?: number | null
          check_2_assoc_co_fee_9lifwm?: string | null
          check_2_clg_net?: string | null
          check_2_client_net_disb?: string | null
          check_2_co_counsel_fee?: number | null
          check_2_co_counsel_fee_hghzxa?: string | null
          check_2_deposit_date?: string | null
          check_2_legal_fee?: number | null
          check_2_legal_fee_szqe6j?: string | null
          check_2_pa_fee?: number | null
          check_2_pa_fee_percent?: string | null
          check_2_pa_invoice?: number | null
          check_2_rp_fee_split?: number | null
          check_2_rp_fee_split_rqfdcf?: string | null
          check_2_rs_bonus?: number | null
          check_2_rs_bonus_admkgy?: string | null
          check_2_settl_client_net_disb?: string | null
          check_2_type?: string | null
          check_3_amount?: number | null
          check_3_assoc_co_fee?: number | null
          check_3_assoc_co_fee_im7hpx?: string | null
          check_3_clg_net?: string | null
          check_3_client_net_disb?: string | null
          check_3_co_counsel_fee?: number | null
          check_3_co_counsel_fee_zfpkb2?: string | null
          check_3_deposit_date?: string | null
          check_3_legal_fee?: number | null
          check_3_legal_fee_i9ooxd?: string | null
          check_3_pa_fee?: number | null
          check_3_pa_fee_percent?: string | null
          check_3_pa_invoice?: number | null
          check_3_rp_fee_split?: number | null
          check_3_rp_fee_split_rmedsj?: string | null
          check_3_rs_bonus?: number | null
          check_3_rs_bonus_udfjxm?: string | null
          check_3_settl_client_net_disb?: string | null
          check_3_type?: string | null
          check_4_amount?: number | null
          check_4_assoc_co_fee?: number | null
          check_4_assoc_co_fee_fpy85s?: string | null
          check_4_clg_net?: string | null
          check_4_client_net_disb?: string | null
          check_4_co_counsel_fee?: number | null
          check_4_co_counsel_fee_dxoy1o?: string | null
          check_4_deposit_date?: string | null
          check_4_legal_fee?: number | null
          check_4_legal_fee_ya5yoq?: string | null
          check_4_pa_fee?: number | null
          check_4_pa_fee_percent?: string | null
          check_4_pa_invoice?: number | null
          check_4_rp_fee_split?: number | null
          check_4_rp_fee_split_6dd0bl?: string | null
          check_4_rs_bonus?: number | null
          check_4_rs_bonus_dnzmsr?: string | null
          check_4_settl_client_net_disb?: string | null
          check_4_type?: string | null
          check_5_amount?: number | null
          check_5_assoc_co_fee?: number | null
          check_5_assoc_co_fee_nerzsd?: string | null
          check_5_clg_net?: string | null
          check_5_client_net_disb?: string | null
          check_5_co_counsel_fee?: number | null
          check_5_co_counsel_fee_aeng4e?: string | null
          check_5_deposit_date?: string | null
          check_5_legal_fee?: number | null
          check_5_legal_fee_cqjbxi?: string | null
          check_5_pa_fee?: number | null
          check_5_pa_fee_percent?: string | null
          check_5_pa_invoice?: number | null
          check_5_rp_fee_split?: number | null
          check_5_rp_fee_split_3o3lpn?: string | null
          check_5_rs_bonus?: number | null
          check_5_rs_bonus_ejo79s?: string | null
          check_5_settl_client_net_disb?: string | null
          check_5_type?: string | null
          cid_due_date?: string | null
          claim_no?: string | null
          claim_number?: string | null
          claim_state?: string | null
          claim_tasks?: string | null
          claim_type?: string[] | null
          clg_demo_staff_from_associate_counsel_portal_access?: string | null
          clg_demo_staff_from_conveyor_users_2?: string | null
          clg_legal_fee?: string | null
          clg_settlement_statement?: string | null
          clg_settlement_statement_complete?: boolean | null
          clg_staff_from_appraiser_user?: string | null
          clg_staff_from_associate_counsel_portal_access?: string | null
          clg_staff_from_building_consult_user?: string | null
          clg_staff_from_conveyor_users_2?: string | null
          clg_staff_from_engineer_expert_user?: string | null
          clg_staff_from_referral_partner_user?: string | null
          client_alt_phone_number?: string | null
          client_estimate_amount?: number | null
          client_name?: string | null
          client_phone_number?: string | null
          client_profile?: string | null
          client_rating?: string | null
          co_counsel_attorney_and_staff_from_conveyor_users_2?: string | null
          co_counsel_email?: string | null
          co_counsel_email_text?: string | null
          co_counsel_fee_split?: string | null
          comments?: string | null
          contractor?: string | null
          conveyor_activity_log?: string | null
          counsel_legal_name?: string | null
          county?: string | null
          court_appointed_umpire?: string | null
          create_invoice?: boolean | null
          create_time?: string | null
          created_at?: string
          created_by?: string | null
          current_desk_adjuster?: string | null
          current_ic_offer?: number | null
          current_opposing_counsel?: string | null
          da_oc?: string | null
          date_of_breach?: string | null
          date_of_loss?: string | null
          days_pending_w_appraiser?: string | null
          days_since_retained?: string | null
          deductible_amount?: number | null
          demand_letter_editable?: string | null
          department?: string | null
          deposition_costs?: number | null
          deposition_date?: string | null
          deposition_location?: string | null
          deposition_meeting_link?: string | null
          deposition_paid?: boolean | null
          desk_adjuster_email?: string | null
          discovery_from_def_due_date?: string | null
          discovery_to_def_due_date?: string | null
          diseng_email_to_rp_sent?: boolean | null
          dob_deadline?: string | null
          doi_service_costs?: number | null
          dol?: string | null
          email?: string | null
          emails?: string | null
          engineer_expert_from_expert_users?: string | null
          engineer_experts_portal_access?: string | null
          euo_date?: string | null
          euo_location?: string | null
          everson_files?: string | null
          expert_costs?: number | null
          expert_firm_request?: string | null
          expert_next_steps?: string | null
          expert_report_complete?: boolean | null
          expert_response_notes?: string | null
          experts_identified_doc?: string | null
          experts_paid?: boolean | null
          external_documentation_links?: string | null
          f_60_day_notice_date?: string | null
          f_60_day_notice_sent?: boolean | null
          filing_costs?: number | null
          firm_appraisal_response_due?: string | null
          from_field_associated_client_cases?: string | null
          global_settlement_amount?: number | null
          ic_adjuster_contact_info?: string | null
          ic_docs_and_communications?: boolean | null
          ic_rcv_estimate_amount?: number | null
          id?: string
          insurance_co?: string | null
          insurance_company?: string | null
          insureds_appraiser?: string | null
          insureds_appraiser_assigned?: string | null
          insureds_appraiser_portal_access?: string | null
          invoices?: string | null
          last_modified?: string | null
          last_modified_by?: string | null
          latest_undisp_check_amt?: number | null
          law_firm_notes?: string | null
          litigation_consent?: boolean | null
          litigation_fees_and_costs?: string | null
          litigation_increase?: number | null
          lor_dl_sent_to_ic?: string | null
          mailing_address?: string | null
          mediation_costs?: number | null
          mediation_date?: string | null
          mediation_deadline_date?: string | null
          mediation_location?: string | null
          mediation_paid?: boolean | null
          motion_costs?: number | null
          motions_hearing_date?: string | null
          motions_location?: string | null
          motions_paid?: boolean | null
          nc_call_completed?: boolean | null
          next_client_comm_due_date?: string | null
          next_steps?: string[] | null
          notes_for_appraiser?: string | null
          notes_for_build_consult_review?: string | null
          notes_for_experts_review?: string | null
          of_est?: string | null
          opposing_counsel_contact_info?: string | null
          opposing_counsel_email?: string | null
          opposing_counsel_firm?: string | null
          outstanding_funds?: number | null
          pa_fee?: string | null
          paralegal?: string | null
          payment_summary_sol_received?: boolean | null
          pl_due_date?: string | null
          pl_email?: string | null
          policy_number?: string | null
          property_address?: string | null
          property_type?: string | null
          rcv_disputed_amount?: string | null
          reason_for_disengagement?: string | null
          recent_client_comm_date?: string | null
          recommended_appraiser?: string | null
          referral_case_id?: string | null
          referral_email_recd?: boolean | null
          referral_partner?: string | null
          referral_partner_email_lookup?: string | null
          referral_partner_from_referral_partner_user?: string | null
          referral_partner_portal_access?: string | null
          referred_firm?: string | null
          referred_firm_portal_access?: string | null
          referred_original_case?: string | null
          refiling_deadline?: string | null
          reinspection_completed?: boolean | null
          reinspection_notes?: string | null
          reinspection_scheduled_date?: string | null
          release_coc_sent_to_ic?: string | null
          resolutions_notes?: string | null
          resolutions_specialist?: string | null
          retainer_sent?: string | null
          retainer_signed_date?: string | null
          rp_appraiser?: string | null
          rp_claim_fee?: number | null
          rp_claim_summary_for_litigation?: string | null
          rp_claims_contact?: string | null
          rp_estimate?: string | null
          rp_fee_split?: string | null
          rp_next_steps?: string[] | null
          rs_bonus?: string | null
          rs_due_date?: string | null
          rs_email?: string | null
          s_c_approved?: boolean | null
          s_c_mailed_or_e_filed?: string | null
          s_c_sent_for_service?: string | null
          s_c_served_date?: string | null
          selected_engineer_experts?: string | null
          selected_mediator?: string | null
          settled_date?: string | null
          settlement_check_amt?: number | null
          settlement_statement_sent?: boolean | null
          show_appraisal_milestone_steps?: boolean | null
          sms_consent?: string | null
          sol_deadline?: string | null
          sol_deadline_notification?: string | null
          squares?: number | null
          step_1_completed?: string | null
          step_1_initial_appraisal_inspection_scheduled?: boolean | null
          step_10_completed?: string | null
          step_10_umpire_inspection_scheduled?: boolean | null
          step_11_completed?: string | null
          step_11_umpire_site_inspection_completed?: boolean | null
          step_12_appraisal_award_finalized?: boolean | null
          step_12_completed?: string | null
          step_13_appraisal_award_signed_and_completed?: boolean | null
          step_13_completed?: string | null
          step_2_completed?: string | null
          step_2_site_inspection_completed?: boolean | null
          step_3_appraisers_estimate_prepared?: boolean | null
          step_3_completed?: string | null
          step_4_appraiser_estimate_exchanged?: boolean | null
          step_4_completed?: string | null
          step_5_completed?: string | null
          step_5_joint_scope_review_conducted?: boolean | null
          step_6_completed?: string | null
          step_6_umpire_selected?: boolean | null
          step_7_completed?: string | null
          step_7_umpire_discussions_initiated?: boolean | null
          step_8_completed?: string | null
          step_8_court_appointed_umpire_needed?: boolean | null
          step_9_completed?: string | null
          step_9_evidence_submitted_to_umpire?: boolean | null
          subpoena_docs_due?: string | null
          sum_of_assoc_co_fee?: string | null
          sum_of_checks_received?: string | null
          sum_of_clg_net?: string | null
          sum_of_client_net_disb?: string | null
          sum_of_co_counsel_fee?: string | null
          sum_of_legal_fees?: string | null
          sum_of_pa_fee_percent?: string | null
          sum_of_rp_fee_split_fee?: string | null
          sum_of_rs_fee?: string | null
          sum_of_settle_client_net_disb?: string | null
          temp_case_docs?: boolean | null
          total_loss?: string | null
          total_paid_to_date?: number | null
          trial_date?: string | null
          u_p_county?: string | null
          u_p_mailed_or_e_filed?: string | null
          u_p_sent_to_abc_legal?: string | null
          u_p_served_date?: string | null
          umpire?: string | null
          umpire_costs?: number | null
          umpire_hearing_date?: string | null
          umpire_paid?: boolean | null
          updated_at?: string
          vd_filing_date?: string | null
          weather_report_costs?: number | null
          welcome_email_sent?: string | null
        }
        Relationships: []
      }
      claim_tasks: {
        Row: {
          airtable_id: string | null
          assigned_date: string | null
          assigned_to: string | null
          case_number: string | null
          case_status: string | null
          completed_date: string | null
          created_at: string
          due_date: string | null
          id: string
          next_steps: string | null
          owner_role: string | null
          paralegal: string | null
          priority: string | null
          referred_firm: string | null
          related_links: string | null
          resolutions_specialist: string | null
          task_manager: string | null
          task_name: string | null
          task_notes: string | null
          task_status: string | null
          task_type: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          assigned_date?: string | null
          assigned_to?: string | null
          case_number?: string | null
          case_status?: string | null
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          next_steps?: string | null
          owner_role?: string | null
          paralegal?: string | null
          priority?: string | null
          referred_firm?: string | null
          related_links?: string | null
          resolutions_specialist?: string | null
          task_manager?: string | null
          task_name?: string | null
          task_notes?: string | null
          task_status?: string | null
          task_type?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          assigned_date?: string | null
          assigned_to?: string | null
          case_number?: string | null
          case_status?: string | null
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          next_steps?: string | null
          owner_role?: string | null
          paralegal?: string | null
          priority?: string | null
          referred_firm?: string | null
          related_links?: string | null
          resolutions_specialist?: string | null
          task_manager?: string | null
          task_name?: string | null
          task_notes?: string | null
          task_status?: string | null
          task_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      client_folders: {
        Row: {
          airtable_id: string | null
          created_at: string
          folder_id: string | null
          folder_name: string | null
          folder_status: string | null
          id: string
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          created_at?: string
          folder_id?: string | null
          folder_name?: string | null
          folder_status?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          created_at?: string
          folder_id?: string | null
          folder_name?: string | null
          folder_status?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          airtable_id: string | null
          author: string | null
          case: string | null
          comment: string | null
          created_at: string
          created_time: string | null
          id: string
          mentioned_users: string | null
          parent_comment: string | null
          replies: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          author?: string | null
          case?: string | null
          comment?: string | null
          created_at?: string
          created_time?: string | null
          id?: string
          mentioned_users?: string | null
          parent_comment?: string | null
          replies?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          author?: string | null
          case?: string | null
          comment?: string | null
          created_at?: string
          created_time?: string | null
          id?: string
          mentioned_users?: string | null
          parent_comment?: string | null
          replies?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          airtable_id: string | null
          associated_cases: string | null
          authorized_representative_name: string | null
          authorized_representative_title: string | null
          best_time_to_contact: string | null
          contact_id: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          policy_party_type: string | null
          preferred_contact_method: string | null
          primary_phone: string | null
          qbo_customer_id: string | null
          relationship_to_insured: string | null
          secondary_phone_number: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          associated_cases?: string | null
          authorized_representative_name?: string | null
          authorized_representative_title?: string | null
          best_time_to_contact?: string | null
          contact_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          policy_party_type?: string | null
          preferred_contact_method?: string | null
          primary_phone?: string | null
          qbo_customer_id?: string | null
          relationship_to_insured?: string | null
          secondary_phone_number?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          associated_cases?: string | null
          authorized_representative_name?: string | null
          authorized_representative_title?: string | null
          best_time_to_contact?: string | null
          contact_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          policy_party_type?: string | null
          preferred_contact_method?: string | null
          primary_phone?: string | null
          qbo_customer_id?: string | null
          relationship_to_insured?: string | null
          secondary_phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conveyor_users: {
        Row: {
          airtable_id: string | null
          appraiser_email: string | null
          appraisers: string | null
          associate_counsel: string | null
          attorney_and_staff: string | null
          building_consultant: string | null
          building_consultant_email: string | null
          clg_accounting: string[] | null
          clg_demo_staff: string | null
          clg_leadership: string[] | null
          clg_paralegal: string[] | null
          clg_resolutions_specialist: string[] | null
          clg_staff: string | null
          conveyor_user_groups: string | null
          conveyor_user_type: string[] | null
          created_at: string
          engineer_expert: string | null
          engineer_expert_email: string | null
          id: string
          managed_cases_ac: string | null
          managed_cases_app: string | null
          managed_cases_bc: string | null
          managed_cases_ee: string | null
          managed_cases_rf: string | null
          managed_cases_rp: string | null
          referral_partner: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          appraiser_email?: string | null
          appraisers?: string | null
          associate_counsel?: string | null
          attorney_and_staff?: string | null
          building_consultant?: string | null
          building_consultant_email?: string | null
          clg_accounting?: string[] | null
          clg_demo_staff?: string | null
          clg_leadership?: string[] | null
          clg_paralegal?: string[] | null
          clg_resolutions_specialist?: string[] | null
          clg_staff?: string | null
          conveyor_user_groups?: string | null
          conveyor_user_type?: string[] | null
          created_at?: string
          engineer_expert?: string | null
          engineer_expert_email?: string | null
          id?: string
          managed_cases_ac?: string | null
          managed_cases_app?: string | null
          managed_cases_bc?: string | null
          managed_cases_ee?: string | null
          managed_cases_rf?: string | null
          managed_cases_rp?: string | null
          referral_partner?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          appraiser_email?: string | null
          appraisers?: string | null
          associate_counsel?: string | null
          attorney_and_staff?: string | null
          building_consultant?: string | null
          building_consultant_email?: string | null
          clg_accounting?: string[] | null
          clg_demo_staff?: string | null
          clg_leadership?: string[] | null
          clg_paralegal?: string[] | null
          clg_resolutions_specialist?: string[] | null
          clg_staff?: string | null
          conveyor_user_groups?: string | null
          conveyor_user_type?: string[] | null
          created_at?: string
          engineer_expert?: string | null
          engineer_expert_email?: string | null
          id?: string
          managed_cases_ac?: string | null
          managed_cases_app?: string | null
          managed_cases_bc?: string | null
          managed_cases_ee?: string | null
          managed_cases_rf?: string | null
          managed_cases_rp?: string | null
          referral_partner?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          airtable_id: string | null
          associated_case: string | null
          body: string | null
          created_at: string
          email_subject: string | null
          id: string
          received_date: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          associated_case?: string | null
          body?: string | null
          created_at?: string
          email_subject?: string | null
          id?: string
          received_date?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          associated_case?: string | null
          body?: string | null
          created_at?: string
          email_subject?: string | null
          id?: string
          received_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      field_map: {
        Row: {
          airtable_field_id: string
          cabinet: string
          column_name: string | null
          field_name: string
          field_type: string | null
          skipped: string | null
        }
        Insert: {
          airtable_field_id: string
          cabinet: string
          column_name?: string | null
          field_name: string
          field_type?: string | null
          skipped?: string | null
        }
        Update: {
          airtable_field_id?: string
          cabinet?: string
          column_name?: string | null
          field_name?: string
          field_type?: string | null
          skipped?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          airtable_id: string | null
          case_id: string | null
          content_type: string | null
          created_at: string
          id: string
          slot_name: string
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          case_id?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          slot_name: string
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          case_id?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          slot_name?: string
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          airtable_id: string | null
          amount: number | null
          associated_case: string | null
          associated_payments: string | null
          create_date: string | null
          created_at: string
          id: string
          invoice_id: string | null
          invoice_number: string | null
          invoice_status: string | null
          qbo_id: string | null
          reference_number: string | null
          sent_date: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          amount?: number | null
          associated_case?: string | null
          associated_payments?: string | null
          create_date?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          invoice_number?: string | null
          invoice_status?: string | null
          qbo_id?: string | null
          reference_number?: string | null
          sent_date?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          amount?: number | null
          associated_case?: string | null
          associated_payments?: string | null
          create_date?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          invoice_number?: string | null
          invoice_status?: string | null
          qbo_id?: string | null
          reference_number?: string | null
          sent_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      next_steps: {
        Row: {
          airtable_id: string | null
          case_id: string | null
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "next_steps_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          additional_details: string | null
          airtable_id: string | null
          assigned_cases: string | null
          attorney_name: string | null
          bar_no: string | null
          clg_email: string | null
          co_counsel_start_date: string | null
          counsel_id: string | null
          created_at: string
          domain: string | null
          draft_letter_of_representations: string | null
          draft_retainer_agreement_claimant: string | null
          draft_retainer_agreement_claimant_and_spouse_or_domestic_p:
            | string
            | null
          draft_retainer_agreement_entity: string | null
          draft_retainer_agreements: string | null
          email: string | null
          fax_number: string | null
          id: string
          license_states: string[] | null
          mailing_address: string | null
          managed_cases: string | null
          mobile_number: string | null
          of_active_cases: string | null
          office_number: string | null
          partner_name: string | null
          partner_type: string | null
          physical_address: string | null
          referred_cases: string | null
          rp_contact_name: string | null
          rp_fee_percentages: string | null
          rp_fee_percentages_2026: string | null
          status: string | null
          updated_at: string
          users: string | null
        }
        Insert: {
          additional_details?: string | null
          airtable_id?: string | null
          assigned_cases?: string | null
          attorney_name?: string | null
          bar_no?: string | null
          clg_email?: string | null
          co_counsel_start_date?: string | null
          counsel_id?: string | null
          created_at?: string
          domain?: string | null
          draft_letter_of_representations?: string | null
          draft_retainer_agreement_claimant?: string | null
          draft_retainer_agreement_claimant_and_spouse_or_domestic_p?:
            | string
            | null
          draft_retainer_agreement_entity?: string | null
          draft_retainer_agreements?: string | null
          email?: string | null
          fax_number?: string | null
          id?: string
          license_states?: string[] | null
          mailing_address?: string | null
          managed_cases?: string | null
          mobile_number?: string | null
          of_active_cases?: string | null
          office_number?: string | null
          partner_name?: string | null
          partner_type?: string | null
          physical_address?: string | null
          referred_cases?: string | null
          rp_contact_name?: string | null
          rp_fee_percentages?: string | null
          rp_fee_percentages_2026?: string | null
          status?: string | null
          updated_at?: string
          users?: string | null
        }
        Update: {
          additional_details?: string | null
          airtable_id?: string | null
          assigned_cases?: string | null
          attorney_name?: string | null
          bar_no?: string | null
          clg_email?: string | null
          co_counsel_start_date?: string | null
          counsel_id?: string | null
          created_at?: string
          domain?: string | null
          draft_letter_of_representations?: string | null
          draft_retainer_agreement_claimant?: string | null
          draft_retainer_agreement_claimant_and_spouse_or_domestic_p?:
            | string
            | null
          draft_retainer_agreement_entity?: string | null
          draft_retainer_agreements?: string | null
          email?: string | null
          fax_number?: string | null
          id?: string
          license_states?: string[] | null
          mailing_address?: string | null
          managed_cases?: string | null
          mobile_number?: string | null
          of_active_cases?: string | null
          office_number?: string | null
          partner_name?: string | null
          partner_type?: string | null
          physical_address?: string | null
          referred_cases?: string | null
          rp_contact_name?: string | null
          rp_fee_percentages?: string | null
          rp_fee_percentages_2026?: string | null
          status?: string | null
          updated_at?: string
          users?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          airtable_id: string | null
          associated_invoice: string | null
          created_at: string
          id: string
          payment_amount: number | null
          payment_date: string | null
          payment_id: string | null
          payment_index: string | null
          payment_notes: string | null
          payment_type: string | null
          updated_at: string
        }
        Insert: {
          airtable_id?: string | null
          associated_invoice?: string | null
          created_at?: string
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_id?: string | null
          payment_index?: string | null
          payment_notes?: string | null
          payment_type?: string | null
          updated_at?: string
        }
        Update: {
          airtable_id?: string | null
          associated_invoice?: string | null
          created_at?: string
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_id?: string | null
          payment_index?: string | null
          payment_notes?: string | null
          payment_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      professional_partners: {
        Row: {
          additional_details: string | null
          airtable_id: string | null
          appraiser_type: string | null
          claim_threshold: string | null
          company: string | null
          company_and_contact: string | null
          contact: string | null
          created_at: string
          email: string | null
          fax_number: string | null
          id: string
          mailing_address: string | null
          managed_cases: string | null
          managed_cases_2: string | null
          managed_cases_3: string | null
          mobile_number: string | null
          office_number: string | null
          physical_address: string | null
          professional_partner_role: string | null
          requires_client_agreement: string | null
          ring_central_direct_dial: string | null
          states_of_operation: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          additional_details?: string | null
          airtable_id?: string | null
          appraiser_type?: string | null
          claim_threshold?: string | null
          company?: string | null
          company_and_contact?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          fax_number?: string | null
          id?: string
          mailing_address?: string | null
          managed_cases?: string | null
          managed_cases_2?: string | null
          managed_cases_3?: string | null
          mobile_number?: string | null
          office_number?: string | null
          physical_address?: string | null
          professional_partner_role?: string | null
          requires_client_agreement?: string | null
          ring_central_direct_dial?: string | null
          states_of_operation?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          additional_details?: string | null
          airtable_id?: string | null
          appraiser_type?: string | null
          claim_threshold?: string | null
          company?: string | null
          company_and_contact?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          fax_number?: string | null
          id?: string
          mailing_address?: string | null
          managed_cases?: string | null
          managed_cases_2?: string | null
          managed_cases_3?: string | null
          mobile_number?: string | null
          office_number?: string | null
          physical_address?: string | null
          professional_partner_role?: string | null
          requires_client_agreement?: string | null
          ring_central_direct_dial?: string | null
          states_of_operation?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referred_cases: {
        Row: {
          address: string | null
          airtable_id: string | null
          appraiser: string | null
          associated_case: string | null
          cases_copy: string | null
          cause_of_loss: string[] | null
          claim_number: string | null
          claim_state: string[] | null
          claim_summary_for_litigation: string | null
          claim_type: string[] | null
          client_name: string | null
          client_phone_number: string | null
          client_phone_number_2: string | null
          companycam_link: string | null
          contractor: string | null
          create_date: string | null
          create_managed_case: boolean | null
          created_at: string
          damage_overview_slides_link: string | null
          date_of_loss: string | null
          email: string | null
          estimate_amount: number | null
          fail_test_a: string | null
          first_name: string | null
          ic_adjuster_contact_info: string | null
          id: string
          insurance_company: string | null
          last_name: string | null
          opposing_appraiser: string | null
          policy_number: string | null
          property_type: string | null
          referred_attorney: string[] | null
          sync_source: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          airtable_id?: string | null
          appraiser?: string | null
          associated_case?: string | null
          cases_copy?: string | null
          cause_of_loss?: string[] | null
          claim_number?: string | null
          claim_state?: string[] | null
          claim_summary_for_litigation?: string | null
          claim_type?: string[] | null
          client_name?: string | null
          client_phone_number?: string | null
          client_phone_number_2?: string | null
          companycam_link?: string | null
          contractor?: string | null
          create_date?: string | null
          create_managed_case?: boolean | null
          created_at?: string
          damage_overview_slides_link?: string | null
          date_of_loss?: string | null
          email?: string | null
          estimate_amount?: number | null
          fail_test_a?: string | null
          first_name?: string | null
          ic_adjuster_contact_info?: string | null
          id?: string
          insurance_company?: string | null
          last_name?: string | null
          opposing_appraiser?: string | null
          policy_number?: string | null
          property_type?: string | null
          referred_attorney?: string[] | null
          sync_source?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          airtable_id?: string | null
          appraiser?: string | null
          associated_case?: string | null
          cases_copy?: string | null
          cause_of_loss?: string[] | null
          claim_number?: string | null
          claim_state?: string[] | null
          claim_summary_for_litigation?: string | null
          claim_type?: string[] | null
          client_name?: string | null
          client_phone_number?: string | null
          client_phone_number_2?: string | null
          companycam_link?: string | null
          contractor?: string | null
          create_date?: string | null
          create_managed_case?: boolean | null
          created_at?: string
          damage_overview_slides_link?: string | null
          date_of_loss?: string | null
          email?: string | null
          estimate_amount?: number | null
          fail_test_a?: string | null
          first_name?: string | null
          ic_adjuster_contact_info?: string | null
          id?: string
          insurance_company?: string | null
          last_name?: string | null
          opposing_appraiser?: string | null
          policy_number?: string | null
          property_type?: string | null
          referred_attorney?: string[] | null
          sync_source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          airtable_id: string | null
          alternative_number: string | null
          associated_partner: string | null
          conveyor_id: string | null
          create_date: string | null
          created_at: string
          direct_number: string | null
          email_address: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          managed_cases: string | null
          partner_id: string | null
          partner_name_lookup: string | null
          partner_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          airtable_id?: string | null
          alternative_number?: string | null
          associated_partner?: string | null
          conveyor_id?: string | null
          create_date?: string | null
          created_at?: string
          direct_number?: string | null
          email_address?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          managed_cases?: string | null
          partner_id?: string | null
          partner_name_lookup?: string | null
          partner_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          airtable_id?: string | null
          alternative_number?: string | null
          associated_partner?: string | null
          conveyor_id?: string | null
          create_date?: string | null
          created_at?: string
          direct_number?: string | null
          email_address?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          managed_cases?: string | null
          partner_id?: string | null
          partner_name_lookup?: string | null
          partner_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
