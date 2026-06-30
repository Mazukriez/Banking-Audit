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

export interface MappingTopic {
  id: string;
  title: string;
  iconName: string;
  mappings: { [frameworkId: string]: string };
  evidence: string[];
}

export interface AuditFinding {
  status: "Compliant" | "Partially Compliant" | "Non-Compliant" | "Not Applicable";
  evidenceName: string;
  notes: string;
  auditor: string;
  updatedAt: string;
}

export interface AuditProject {
  id: string;
  name: string;
  organization: string;
  sector: string;
  createdAt: string;
  selectedFrameworks: string[];
  customFocus: string;
  findings: { [stepId: string]: AuditFinding };
  generatedProgram: GeneratedAuditProgram | null;
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

export interface MappingResult {
  targetControlId: string;
  targetControlName: string;
  targetControlDescription: string;
  alignmentRationale: string;
  gapAnalysis: string;
  confidenceLevel: "High" | "Medium" | "Low";
  testingMethodology: string;
  suggestedArtifacts: string[];
}

export interface RemediationPlan {
  immediateActions: string;
  longTermRemediation: string;
  estimatedTimeline: string;
  remediationOwner: string;
  testingProof: string;
}
