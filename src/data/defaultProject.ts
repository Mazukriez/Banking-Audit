import { AuditProject } from "../types";

export const defaultProject: AuditProject = {
  id: "sample_bank_audit_2026",
  name: "Asia-Pacific Core Banking Cyber Audit",
  organization: "Nexus Trust Bank",
  sector: "Banking & Financial Services",
  createdAt: "2026-06-30T00:00:00.000Z",
  selectedFrameworks: ["iso_27001", "swift_csp", "bnm_rmit", "mas_trm"],
  customFocus: "Evaluate identity management, core Swift gateway segmentations, 24/7 SOC detection SLAs, and disaster recovery replication under regional guidelines.",
  findings: {
    "1": {
      status: "Compliant",
      evidenceName: "NTB-IAM-PROV-SOP v2.4, ActiveDirectory MFA Config Screenshots",
      notes: "Checked random sample of 25 administrator accounts across Active Directory and core Swift gateway. MFA is strictly enforced. Privileged access approvals are routed through SailPoint with formal sign-off.",
      auditor: "S. Harris (Lead Auditor)",
      updatedAt: "2026-06-30T01:00:00.000Z"
    },
    "2": {
      status: "Compliant",
      evidenceName: "Fortinet Segment Map v4.1, SWIFT-SECURE-ZONE-RULES",
      notes: "Reviewed network zoning. SWIFT terminal zone is strictly segregated using next-gen firewalls. Direct inbound traffic from the corporate LAN is completely blocked, satisfying SWIFT CSCF A2.3 and BNM RMiT S-11.",
      auditor: "S. Harris (Lead Auditor)",
      updatedAt: "2026-06-30T01:15:00.000Z"
    },
    "3": {
      status: "Partially Compliant",
      evidenceName: "Database Cryptographic Spec, Hardware Security Module (HSM) Logs",
      notes: "Core transactional databases employ AES-256 transparent data encryption (TDE). However, rotation of master keys was overdue by 45 days. Discovered that backup databases in the secondary recovery site were encrypted but with a static key.",
      auditor: "M. Low (Tech Auditor)",
      updatedAt: "2026-06-30T02:10:00.000Z"
    },
    "4": {
      status: "Non-Compliant",
      evidenceName: "SOC Incident Log Excerpts, Splunk Alert Rules",
      notes: "Discovered that Splunk alerts for multiple failed administrative login attempts were configured but the alert severity was set to 'Low'. No incident response tickets were generated during a simulated brute-force test of the Swift database. This fails to meet the 24/7 real-time monitoring and threat escalation timelines expected under BNM RMiT S-14 and MAS TRM Section 11.",
      auditor: "S. Harris (Lead Auditor)",
      updatedAt: "2026-06-30T02:45:00.000Z"
    },
    "5": {
      status: "Non-Compliant",
      evidenceName: "Tabletop Scenario Report Dec 2025",
      notes: "The last cyber tabletop simulation drill was conducted 14 months ago. Both MAS TRM and BNM RMiT strictly mandate annual comprehensive crisis simulation drills. Furthermore, key business unit owners were absent from the last tabletop, resulting in fragmented incident coordination protocols.",
      auditor: "S. Harris (Lead Auditor)",
      updatedAt: "2026-06-30T03:10:00.000Z"
    },
    "6": {
      status: "Compliant",
      evidenceName: "TDRP Report Q1 2026, Veeam replication dashboard",
      notes: "Daily differential backup jobs successfully write to secure, air-gapped immutable storage. Checked Q1 disaster recovery failover drill logs: critical bank ledger replication was fully functional inside the target Recovery Time Objective (RTO) of 2 hours, well within RMiT limits.",
      auditor: "M. Low (Tech Auditor)",
      updatedAt: "2026-06-30T04:15:00.000Z"
    }
  },
  generatedProgram: {
    title: " Nexus Trust Core Banking Audit & Work Program",
    scope: "Independent validation of cybersecurity governance, operational defenses, and incident readiness aligned with global GRC standards (ISO 27001, SWIFT CSP) and regional guidelines (Bank Negara Malaysia RMiT, MAS Singapore Technology Risk Guidelines).",
    alignedFrameworks: ["ISO/IEC 27001", "SWIFT CSP CSCF", "BNM RMiT", "MAS TRM"],
    steps: [
      {
        stepNumber: 1,
        objective: "Enforce Secure Access & Privileged Identity Governance",
        procedure: "Verify that all administrative access to core database layers, directories, and SWIFT terminals is protected by MFA. Inspect SailPoint provisioning systems to ensure access is granted on a strict need-to-know basis and subject to periodic re-validation.",
        evidenceRequested: "Identity provisioning logs, active MFA policy configuration screens, privileged account registry, and recent quarterly review sign-offs.",
        sampleGuideline: "Review a random sample of 25 systems administrative accounts and 100% of emergency fire-fighter accounts.",
        interviewQuestions: [
          "What is your process for immediate revocation of privileged credentials upon employee offboarding?",
          "How frequently are active administrative roles reviewed and re-approved?"
        ]
      },
      {
        stepNumber: 2,
        objective: "Validate Boundary Security & Network Isolation Zones",
        procedure: "Analyze firewall configuration scripts and network routing maps. Confirm that the core payment architecture (SWIFT terminal secure zone) is fully segregated from the general enterprise workspace and user networks.",
        evidenceRequested: "Network architecture topology, next-generation firewall ingress/egress rulesets, and quarterly firewall rule clean-up audit reports.",
        sampleGuideline: "Select the past 3 network change request tickets and inspect actual configured firewall rules to verify alignment with original approvals.",
        interviewQuestions: [
          "Are there any direct network routing pathways from standard corporate workstations into the SWIFT database?",
          "How often are firewall rulesets reviewed for redundant or overly permissive ports?"
        ]
      },
      {
        stepNumber: 3,
        objective: "Assess Cryptographic Key Protection & Data-at-Rest Security",
        procedure: "Review encryption configurations on database engines and secondary storage arrays storing Customer Identifiable Information (CII) and primary transaction records. Confirm physical HSM keys are securely managed.",
        evidenceRequested: "Database encryption status logs, HSM key rotation schedules, key custodian agreement sign-offs, and backup encryption configurations.",
        sampleGuideline: "Inspect master key rotation records for the past 12 months for 5 primary ledger databases.",
        interviewQuestions: [
          "Who are the designated key custodians, and how is the split-knowledge (M-of-N) protocol enforced during key reconstitution?",
          "Are backup tapes or secondary site block storage replication targets encrypted under the same parameters?"
        ]
      },
      {
        stepNumber: 4,
        objective: "Evaluate 24/7 SIEM Detection SLAs & Alert Severity Tuning",
        procedure: "Audit SIEM (Splunk/QRadar) alert thresholds for critical security events, including multiple failed admin logins and system-level configuration changes. Check the Security Operations Center (SOC) incident ticketing logs to ensure response times meet target SLAs.",
        evidenceRequested: "Splunk log ingestion status, configured alert logic for authentication failures, incident response SLA metrics, and 3 active SOC alert ticket workflows.",
        sampleGuideline: "Simulate 5 failed administrative logins on a test database to check if a high-severity alert is ingested and actioned by the SOC team within 15 minutes.",
        interviewQuestions: [
          "How are cyber threats escalated from Tier 1 analyst triage to Tier 3 incident handlers?",
          "What is the average Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR) for critical severity alerts?"
        ]
      },
      {
        stepNumber: 5,
        objective: "Confirm Annual Tabletop Cyber Drills & Cyber Operations Readiness",
        procedure: "Verify that the institution has conducted at least one annual comprehensive cybersecurity tabletop scenario exercise involving both IT personnel and business executives. Ensure the simulation scenario includes critical ransomware or gateway compromise factors.",
        evidenceRequested: "Tabletop exercise agenda, participant attendance roster, tested scenario slides, and Post-Incident Review (PIR) report with action items.",
        sampleGuideline: "Review documentation and executive sign-off for the most recent tabletop drill (must be dated within the last 12 months).",
        interviewQuestions: [
          "How are executive management and external public relations teams integrated into cyber breach tabletop simulations?",
          "What mechanisms exist to track and remediate gaps identified during simulation tabletop exercises?"
        ]
      },
      {
        stepNumber: 6,
        objective: "Review Disaster Recovery Plan (DRP) & Backup Immutability Controls",
        procedure: "Inspect the secondary hot-site disaster recovery plans and check the Q1 failover testing results. Verify backups are stored in a physically isolated, immutable storage repository to guard against systemic ransomware.",
        evidenceRequested: "IT Disaster Recovery Plan, backup job configuration logs, evidence of offsite or air-gapped vaults, and the latest DR failover sign-off report.",
        sampleGuideline: "Examine backup logs for the past 30 days to confirm daily differential and weekly full runs completed successfully without exception.",
        interviewQuestions: [
          "What are the specific target Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) for core customer ledger accounts?",
          "How do you test backup immutability against active malware attempting directory overwrite?"
        ]
      }
    ],
    additionalRecommendations: "To strengthen regulatory standing with Bank Negara Malaysia (BNM) and the Monetary Authority of Singapore (MAS), Nexus Trust Bank must immediately adjust its SIEM alert weights to escalate authentication anomalies to high priority. Establish a rigid, automated annual trigger for tabletop simulations, and implement a key rotation script for secondary database replication nodes."
  }
};
