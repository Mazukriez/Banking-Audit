export interface Control {
  id: string;
  name: string;
  description: string;
  guidelines?: string;
}

export interface Framework {
  id: string;
  name: string;
  fullName: string;
  authority: string;
  region: string;
  scope: string;
  controls: Control[];
}

export const frameworks: Framework[] = [
  {
    id: "nist_csf",
    name: "NIST CSF 2.0",
    fullName: "NIST Cybersecurity Framework 2.0",
    authority: "National Institute of Standards and Technology",
    region: "United States (Global Standard)",
    scope: "Core cybersecurity functions to govern, identify, protect, detect, respond, and recover.",
    controls: [
      { id: "GV.OC", name: "Organizational Context (Govern)", description: "The circumstances, mission, stakeholder expectations, and legal, regulatory, and contractual requirements of the enterprise are understood." },
      { id: "GV.RM", name: "Risk Management Strategy (Govern)", description: "The organization's priorities, constraints, risk tolerances, and assumptions are established and used to support risk decisions." },
      { id: "ID.AM", name: "Asset Management (Identify)", description: "Assets (data, technology, personnel, facilities, software) are inventoried and managed consistent with their relative importance to organizational goals." },
      { id: "ID.RA", name: "Risk Assessment (Identify)", description: "The organization understands the cybersecurity risk to organizational operations, assets, and individuals." },
      { id: "PR.AA", name: "Identity Management & Access Control (Protect)", description: "Access to physical and logical assets is limited to authorized users, processes, and devices, managed in accordance with assessed risk." },
      { id: "PR.AT", name: "Awareness & Training (Protect)", description: "The organization's personnel and partners are provided cybersecurity awareness and training to perform their cybersecurity-related duties." },
      { id: "PR.DS", name: "Data Security (Protect)", description: "Data is managed consistent with the organization's risk strategy to protect the confidentiality, integrity, and availability of information." },
      { id: "PR.PS", name: "Platform Security (Protect)", description: "The hardware, software, and services comprising organizational platforms are secured to protect systems and networks." },
      { id: "DE.CM", name: "Continuous Monitoring (Detect)", description: "The network, systems, physical environment, and personnel are monitored to identify anomalous events and cyber threats." },
      { id: "RS.MA", name: "Incident Mitigation (Respond)", description: "Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident." },
      { id: "RC.RP", name: "Recovery Planning (Recover)", description: "Recovery plans and processes are maintained to ensure timely restoration of systems and assets affected by cybersecurity incidents." }
    ]
  },
  {
    id: "iso_27001",
    name: "ISO/IEC 27001:2022",
    fullName: "Information Security Management Systems (Annex A)",
    authority: "International Organization for Standardization",
    region: "Global",
    scope: "Requirements for establishing, implementing, maintaining, and continually improving an ISMS.",
    controls: [
      { id: "A.5", name: "Organizational Controls", description: "Covers information security policies, roles, responsibilities, segregation of duties, relations with authorities, threat intelligence, and contact with special interest groups." },
      { id: "A.6", name: "People Controls", description: "Covers screening, employment agreements, security awareness, education, training, disciplinary processes, and termination/change of employment responsibilities." },
      { id: "A.7", name: "Physical Controls", description: "Covers physical security perimeters, physical entry controls, securing offices, physical security monitoring, protecting against physical and environmental threats, and working in secure areas." },
      { id: "A.8.1", name: "User Access and Identity (A.8.2-A.8.5)", description: "Access rights, user authentication, and privileged access rights must be restricted and controlled in accordance with security policies." },
      { id: "A.8.7", name: "Protection against Malware", description: "Detection, prevention, and recovery controls to protect against malware must be implemented, combined with user awareness." },
      { id: "A.8.12", name: "Data Leakage Prevention", description: "Data leakage prevention measures must be applied to systems, networks, and other devices that process, store, or transmit sensitive information." },
      { id: "A.8.16", name: "Monitoring Activities", description: "Networks, systems, and applications must be monitored for anomalous behavior and security events, and records must be retained." },
      { id: "A.8.20", name: "Network Security Management", description: "Networks and network devices must be secured and controlled to protect information in systems and applications." },
      { id: "A.8.24", name: "Use of Cryptography", description: "Rules for the effective and secure use of cryptography, including key management, must be defined and implemented." },
      { id: "A.8.28", name: "Secure Coding", description: "Secure coding principles must be applied to software development activities to reduce vulnerabilities." }
    ]
  },
  {
    id: "cobit_2019",
    name: "COBIT 2019",
    fullName: "Control Objectives for Information and Related Technology",
    authority: "ISACA",
    region: "Global",
    scope: "Enterprise governance of IT (EGIT) framework separating governance and management.",
    controls: [
      { id: "EDM03", name: "Ensured Risk Optimization", description: "Ensure that enterprise IT-related risk does not exceed risk appetite and risk tolerance, and IT risk is managed effectively." },
      { id: "APO12", name: "Managed Risk", description: "Identify, assess, and reduce IT-related risk within levels of tolerance set by enterprise executive management." },
      { id: "APO13", name: "Managed Security", description: "Define, establish, and maintain an information security management system (ISMS) aligned with business requirements." },
      { id: "BAI03", name: "Managed Solutions Identification & Build", description: "Establish and maintain a systematic process for designing, building, and sourcing tech solutions aligned with business strategies." },
      { id: "BAI06", name: "Managed IT Changes", description: "Control all changes in a controlled manner, including emergency changes, to minimize negative impacts on operations." },
      { id: "BAI10", name: "Managed Configuration", description: "Maintain a definition of all configuration items, including relationships, to enable impact assessments and audit traceability." },
      { id: "DSS01", name: "Managed Operations", description: "Coordinate and execute operational activities and procedures to deliver defined technology services." },
      { id: "DSS04", name: "Managed Continuity", description: "Establish and maintain a disaster recovery and business continuity capability to sustain critical operations." },
      { id: "DSS05", name: "Managed Security Services", description: "Protect enterprise information assets to maintain level of information security risk acceptable to the enterprise." },
      { id: "MEA02", name: "Managed System of Internal Control", description: "Monitor, evaluate, and report on the effectiveness of internal controls and management systems." }
    ]
  },
  {
    id: "cis_controls",
    name: "CIS Controls v8",
    fullName: "Center for Internet Security Critical Security Controls",
    authority: "Center for Internet Security",
    region: "Global",
    scope: "A prioritized set of 18 safeguard actions to defend against common cyber attacks.",
    controls: [
      { id: "CIS-1", name: "Inventory and Control of Enterprise Assets", description: "Actively manage all enterprise assets (endpoints, servers, network devices, IoT) connected to the infrastructure." },
      { id: "CIS-2", name: "Inventory and Control of Software Assets", description: "Actively manage all software on the network so that only authorized software is installed and can execute." },
      { id: "CIS-3", name: "Data Protection", description: "Develop processes and technical controls to identify, classify, securely handle, retain, and dispose of data." },
      { id: "CIS-4", name: "Secure Configuration of Assets and Software", description: "Establish and maintain the secure configuration of enterprise assets and software using trusted baseline images." },
      { id: "CIS-5", name: "Account Management", description: "Use processes and tools to assign and manage authorization to credentials for user and administrator accounts." },
      { id: "CIS-6", name: "Access Control Management", description: "Ensure access to enterprise assets is granted based on need-to-know, role-based authorization, and MFA." },
      { id: "CIS-8", name: "Audit Log Management", description: "Collect, alert, review, and retain audit logs of events to detect, understand, or recover from cyber attacks." },
      { id: "CIS-10", name: "Malware Defenses", description: "Prevent, detect, and remediate the installation, spread, and execution of malicious code." },
      { id: "CIS-14", name: "Security Awareness and Skills Training", description: "Establish and deliver security awareness programs to influence behaviors and reduce human cyber risk." },
      { id: "CIS-17", name: "Incident Response Management", description: "Develop and implement an incident response infrastructure (plans, roles, training, triage) to quickly discover and contain attacks." }
    ]
  },
  {
    id: "swift_csp",
    name: "SWIFT CSP (CSCF v2024)",
    fullName: "SWIFT Customer Security Programme - Customer Security Control Framework",
    authority: "SWIFT",
    region: "Global (Financial Sector)",
    scope: "Mandatory security controls for SWIFT users to protect their local SWIFT environments.",
    controls: [
      { id: "A1.1", name: "Physical Security", description: "Establish physical boundaries, secure entry controls, and CCTV coverage for rooms hosting SWIFT-related equipment." },
      { id: "A1.2", name: "System Recovery", description: "Ensure the capability to securely recover SWIFT operations (configurations, software, and databases) from offline backups." },
      { id: "A2.1", name: "Internal Data Flow Security", description: "Protect internal networks and segmentation to secure connection flows between SWIFT interfaces and back-office applications." },
      { id: "A2.2", name: "System Hardening", description: "Harden operating systems, applications, and database engines hosting SWIFT components. Disable unnecessary services." },
      { id: "A2.3", name: "Network Segmentation", description: "Segregate the local SWIFT infrastructure (Secure Zone) from the rest of the enterprise local area network." },
      { id: "A2.9", name: "Privileged Access Management", description: "Enforce strict approval, role separation, and multi-factor authentication (MFA) for administrative access to SWIFT systems." },
      { id: "A3.1", name: "Malware Protection", description: "Implement anti-virus/endpoint detection and response (EDR) agents to prevent malware execution within the SWIFT Secure Zone." },
      { id: "A3.2", name: "Security Monitoring", description: "Monitor active directories, firewalls, and SWIFT application logs in real-time to identify anomalous operational actions." },
      { id: "A3.3", name: "Log Management", description: "Centralize and protect security event logs. Keep logs immutable and retain them for at least 12 months." }
    ]
  },
  {
    id: "pci_dss",
    name: "PCI DSS v4.0",
    fullName: "Payment Card Industry Data Security Standard v4.0",
    authority: "PCI Security Standards Council",
    region: "Global (Payment/Retail Sector)",
    scope: "Technical and operational requirements designed to protect cardholder data.",
    controls: [
      { id: "Req 1", name: "Network Security Controls", description: "Install and maintain network security controls (firewalls, routers) to restrict traffic between cardholder data environments (CDE) and other networks." },
      { id: "Req 2", name: "Secure Configurations", description: "Apply secure configurations to all system components. Change all vendor-default settings and disable unnecessary protocols/ports." },
      { id: "Req 3", name: "Protect Stored Account Data", description: "Protect stored cardholder data (primary account numbers) using strong cryptography, truncation, masking, or hashing." },
      { id: "Req 5", name: "Malware Defenses", description: "Protect all systems and networks from malicious software. Ensure anti-malware tools are active and performing regular scans." },
      { id: "Req 7", name: "Restrict Access on Need-to-Know", description: "Restrict access to system components and cardholder data to only those individuals whose jobs require such access." },
      { id: "Req 8", name: "Identify and Authenticate Users", description: "Identify users and authenticate access to all system components using unique user IDs, strong passwords, and multi-factor authentication (MFA)." },
      { id: "Req 10", name: "Log and Monitor Access", description: "Log and monitor all access to system components and cardholder data. Maintain time-synchronized, immutable audit trails." },
      { id: "Req 12", name: "Support Information Security with Policies", description: "Support information security with organizational policies, risk assessment practices, security training, and incident response planning." }
    ]
  },
  {
    id: "bnm_rmit",
    name: "BNM RMiT",
    fullName: "Risk Management in Technology Guidelines",
    authority: "Bank Negara Malaysia (Central Bank of Malaysia)",
    region: "Malaysia (Financial Sector)",
    scope: "Mandatory guidelines specifying requirements for technology governance, risk appetite, and cybersecurity controls in Malaysian financial institutions.",
    controls: [
      { id: "S-8", name: "Technology Governance", description: "Board of Directors and senior management oversight, defining clear roles, technology risk appetite, and TRMF framework approvals." },
      { id: "S-9", name: "Technology Risk Management Framework (TRMF)", description: "Establish an independent Technology Risk Management function to identify, assess, control, and monitor technology risks." },
      { id: "S-10", name: "Technology Operations Management", description: "Formulate standards for asset management, patch management, capacity planning, and end-of-support tech lifecycle tracking." },
      { id: "S-11", name: "Network Security Management", description: "Enforce network segmentation, secure remote access controls, regular firewall reviews, and intrusion prevention systems (IPS)." },
      { id: "S-12", name: "System Development and Acquisition", description: "Encorporate secure coding standards, application security testing (SAST/DAST), and strict user acceptance testing (UAT)." },
      { id: "S-13", name: "Data Integrity and Data Security", description: "Implement data classification, cryptographic protections for data-at-rest/in-transit, and data loss prevention (DLP) controls." },
      { id: "S-14", name: "Cyber Security Operations", description: "Establish a 24/7 Security Operations Center (SOC), implement threat intelligence sharing, and perform regular threat hunting." },
      { id: "S-15", name: "Technology Disaster Recovery Plan (TDRP)", description: "Formulate a TDRP, conduct annual business continuity testing, and meet specific Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)." }
    ]
  },
  {
    id: "mas_trm",
    name: "MAS TRM Guidelines",
    fullName: "Technology Risk Management Guidelines (2021)",
    authority: "Monetary Authority of Singapore",
    region: "Singapore (Financial Sector)",
    scope: "Expected risk management practices for financial institutions in Singapore to manage technology and cyber risk.",
    controls: [
      { id: "MAS-3", name: "IT Governance and Oversight", description: "Establish IT steering committees, define roles, and ensure the Board has appropriate expertise to oversee technology risk." },
      { id: "MAS-4", name: "Technology Risk Management Framework", description: "Implement a TRMF to continuously identify and assess risks, evaluate controls, and monitor key risk indicators (KRIs)." },
      { id: "MAS-5", name: "User Access Management (IAM)", description: "Manage access rights on a need-to-know basis. Review privileged user activity and enforce multi-factor authentication (MFA)." },
      { id: "MAS-6", name: "Cryptographic Key Management", description: "Apply strong cryptography to safeguard sensitive data, and secure the generation, storage, distribution, and destruction of cryptographic keys." },
      { id: "MAS-7", name: "Data Protection", description: "Establish data classification guidelines, protect confidential data in transit and at rest, and prevent unauthorized data exfiltration." },
      { id: "MAS-8", name: "System and Application Security", description: "Adopt secure SDLC practices, enforce secure code reviews, secure configuration baselines, and disable unnecessary system services." },
      { id: "MAS-9", name: "Network Security Management", description: "Establish network defense-in-depth, configure firewalls, implement intrusion detection, and securely isolate sensitive networks." },
      { id: "MAS-10", name: "IT Operations Management", description: "Perform security patching, handle change management rigorously, and back up critical systems regularly to offsite storage." },
      { id: "MAS-11", name: "Cyber Incident Response and Recovery", description: "Maintain a cyber incident response plan, establish incident response teams, and conduct regular cyber crisis simulation exercises." }
    ]
  }
];

// Mapping Topics that act as standard alignment bridges between the 8 frameworks
export interface MappingTopic {
  id: string;
  title: string;
  iconName: string;
  mappings: { [frameworkId: string]: string };
  evidence: string[];
}

export const mappingTopics: MappingTopic[] = [
  {
    id: "access_control",
    title: "Access Control & IAM",
    iconName: "ShieldAlert",
    mappings: {
      nist_csf: "PR.AA",
      iso_27001: "A.8.1",
      cobit_2019: "DSS05",
      cis_controls: "CIS-5, CIS-6",
      swift_csp: "A2.9",
      pci_dss: "Req 7, Req 8",
      bnm_rmit: "S-11",
      mas_trm: "MAS-5"
    },
    evidence: [
      "Access Provisioning Policies and procedures",
      "MFA configuration screens and enforcement logs",
      "Quarterly user access review records signed off by owners",
      "Lists of active privileged accounts and access justification"
    ]
  },
  {
    id: "network_security",
    title: "Network Security & Segmentation",
    iconName: "Network",
    mappings: {
      nist_csf: "PR.PS",
      iso_27001: "A.8.20",
      cobit_2019: "DSS05",
      cis_controls: "CIS-4",
      swift_csp: "A2.1, A2.3",
      pci_dss: "Req 1",
      bnm_rmit: "S-11",
      mas_trm: "MAS-9"
    },
    evidence: [
      "Network architecture diagrams highlighting network zones/segmentation",
      "Firewall rule configuration reports and regular review logs",
      "Intrusion Detection/Prevention System (IDS/IPS) logs and rulesets",
      "Configuration baselines for network switches and routers"
    ]
  },
  {
    id: "data_protection",
    title: "Data Security & Cryptography",
    iconName: "Lock",
    mappings: {
      nist_csf: "PR.DS",
      iso_27001: "A.8.12, A.8.24",
      cobit_2019: "DSS05",
      cis_controls: "CIS-3",
      swift_csp: "A2.2",
      pci_dss: "Req 3",
      bnm_rmit: "S-13",
      mas_trm: "MAS-6, MAS-7"
    },
    evidence: [
      "Data Classification Policy and Data Inventory Matrix",
      "Key Management Procedures (generation, storage, distribution, rotation)",
      "Database encryption settings and screenshots of masked cardholder details",
      "Data Loss Prevention (DLP) alert logs and incident investigations"
    ]
  },
  {
    id: "incident_response",
    title: "Incident Response & Cyber Ops",
    iconName: "AlertTriangle",
    mappings: {
      nist_csf: "RS.MA",
      iso_27001: "A.5 (Incident Management)",
      cobit_2019: "DSS05",
      cis_controls: "CIS-17",
      swift_csp: "A3.2",
      pci_dss: "Req 12",
      bnm_rmit: "S-14",
      mas_trm: "MAS-11"
    },
    evidence: [
      "Cyber Security Incident Response Plan (CSIRP)",
      "SOC 24/7 SLA contracts or shift rosters",
      "Incident report ticket logs detailing containment and root-cause analysis",
      "Tabletop simulation/cyber crisis drill evidence (agendas, sign-in sheets, write-ups)"
    ]
  },
  {
    id: "vulnerability_patching",
    title: "Vulnerability & Patch Management",
    iconName: "Activity",
    mappings: {
      nist_csf: "PR.PS",
      iso_27001: "A.8.7",
      cobit_2019: "APO12",
      cis_controls: "CIS-4, CIS-10",
      swift_csp: "A2.2",
      pci_dss: "Req 5",
      bnm_rmit: "S-10",
      mas_trm: "MAS-10"
    },
    evidence: [
      "Patch Management Standard Operating Procedure (SOP)",
      "Vulnerability scan reports (internal/external network and application)",
      "Remediation exception approval forms",
      "WSUS or endpoint patch deployment reports showing compliance rates"
    ]
  },
  {
    id: "disaster_recovery",
    title: "Disaster Recovery & Continuity",
    iconName: "Server",
    mappings: {
      nist_csf: "RC.RP",
      iso_27001: "A.5 (Continuity)",
      cobit_2019: "DSS04",
      cis_controls: "CIS-11",
      swift_csp: "A1.2",
      pci_dss: "Req 12",
      bnm_rmit: "S-15",
      mas_trm: "MAS-10"
    },
    evidence: [
      "Business Impact Analysis (BIA) and Disaster Recovery Plan (DRP)",
      "DR drill reports showing actual vs target recovery times (RTO/RPO)",
      "Backup schedules, encryption logs, and offsite storage delivery receipts",
      "Backup restoration testing logs"
    ]
  },
  {
    id: "governance_risk",
    title: "IT Governance & Risk Management",
    iconName: "FileText",
    mappings: {
      nist_csf: "GV.OC, GV.RM, ID.RA",
      iso_27001: "A.5 (Policies)",
      cobit_2019: "EDM03, APO12",
      cis_controls: "CIS-18",
      swift_csp: "A1.1",
      pci_dss: "Req 12",
      bnm_rmit: "S-8, S-9",
      mas_trm: "MAS-3, MAS-4"
    },
    evidence: [
      "Board meeting minutes showing approval of IT Risk Appetite and TRMF",
      "Technology Risk Register listing identified risks, severity, and mitigations",
      "Independent IT security audit or assessment reports",
      "Third-party vendor technology risk assessment records"
    ]
  }
];

export interface AuditProject {
  id: string;
  name: string;
  organization: string;
  sector: string;
  createdAt: string;
  selectedFrameworks: string[];
  findings: { [controlKey: string]: AuditFinding };
}

export interface AuditFinding {
  status: "Compliant" | "Partially Compliant" | "Non-Compliant" | "Not Applicable";
  evidenceName: string;
  notes: string;
  auditor: string;
  updatedAt: string;
}

export interface GeneratedProgramStep {
  stepNumber: number;
  objective: string;
  procedure: string;
  evidenceRequested: string;
  sampleGuideline: string;
  interviewQuestions: string[];
}

export interface GeneratedAuditProgram {
  title: string;
  scope: string;
  alignedFrameworks: string[];
  steps: GeneratedProgramStep[];
  additionalRecommendations: string;
}
