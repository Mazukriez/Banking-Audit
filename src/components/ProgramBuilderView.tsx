import React, { useState } from "react";
import { frameworks } from "../data/frameworks";
import { 
  AuditProject, 
  GeneratedAuditProgram, 
  GeneratedProgramStep, 
  AuditFinding,
  RemediationPlan 
} from "../types";
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  MinusCircle, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  HelpCircle, 
  FlameKindling,
  BookOpen, 
  Activity, 
  ShieldCheck, 
  Layers,
  Check,
  RotateCw,
  FolderOpen
} from "lucide-react";

interface ProgramBuilderViewProps {
  project: AuditProject;
  onUpdateFinding: (stepId: string, finding: AuditFinding) => void;
  onGenerateProgram: (name: string, organization: string, sector: string, selectedFrameworks: string[], customFocus: string) => Promise<void>;
  isLoadingProgram: boolean;
  onLoadProject: (proj: AuditProject) => void;
  savedProjects: AuditProject[];
}

export default function ProgramBuilderView({ 
  project, 
  onUpdateFinding, 
  onGenerateProgram,
  isLoadingProgram,
  onLoadProject,
  savedProjects
}: ProgramBuilderViewProps) {
  
  // Workspace Form Setup
  const [projName, setProjName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [sector, setSector] = useState("Banking & Wealth Management");
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["iso_27001"]);
  const [customFocus, setCustomFocus] = useState("");

  // Active step in workspace accordion
  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);

  // Active findings editor inputs
  const [fStatus, setFStatus] = useState<"Compliant" | "Partially Compliant" | "Non-Compliant" | "Not Applicable">("Compliant");
  const [fEvidence, setFEvidence] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [fAuditor, setFAuditor] = useState("Lead GRC Auditor");

  // Remediation states
  const [remediatingStep, setRemediatingStep] = useState<number | null>(null);
  const [remediationPlan, setRemediationPlan] = useState<RemediationPlan | null>(null);
  const [isLoadingRemediation, setIsLoadingRemediation] = useState(false);

  // Form check
  const handleFrameworkToggle = (fId: string) => {
    if (selectedFrameworks.includes(fId)) {
      setSelectedFrameworks(selectedFrameworks.filter(id => id !== fId));
    } else {
      setSelectedFrameworks([...selectedFrameworks, fId]);
    }
  };

  // Sync editor inputs when selecting a different step
  const handleSelectStep = (stepNumber: number) => {
    setActiveStepNumber(stepNumber);
    setRemediatingStep(null);
    setRemediationPlan(null);
    const existing = project.findings[stepNumber.toString()];
    if (existing) {
      setFStatus(existing.status);
      setFEvidence(existing.evidenceName || "");
      setFNotes(existing.notes || "");
      setFAuditor(existing.auditor || "Lead GRC Auditor");
    } else {
      setFStatus("Compliant");
      setFEvidence("");
      setFNotes("");
      setFAuditor("Lead GRC Auditor");
    }
  };

  // Save current step findings to global project state
  const handleSaveFinding = (stepNumber: number) => {
    const finding: AuditFinding = {
      status: fStatus,
      evidenceName: fEvidence,
      notes: fNotes,
      auditor: fAuditor,
      updatedAt: new Date().toISOString()
    };
    onUpdateFinding(stepNumber.toString(), finding);
  };

  // Trigger AI Remediation Guide
  const handleGetRemediation = async (step: GeneratedProgramStep, currentFindingNotes: string) => {
    setIsLoadingRemediation(true);
    setRemediatingStep(step.stepNumber);
    setRemediationPlan(null);

    const fName = project.selectedFrameworks.map(fId => frameworks.find(f => f.id === fId)?.name).filter(Boolean).join(", ");

    try {
      const response = await fetch("/api/gemini/remediate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          controlId: `STEP-${step.stepNumber}`,
          controlName: step.objective,
          frameworkName: fName,
          findingDetails: currentFindingNotes || "Control needs implementation and formal testing."
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate remediation guide.");
      }

      const data = await response.json();
      setRemediationPlan(data);
    } catch (e) {
      console.error(e);
      alert("Failed to retrieve remediation guidance. Ensure server is online.");
    } finally {
      setIsLoadingRemediation(false);
    }
  };

  // Handle program creation submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFrameworks.length === 0) {
      alert("Please select at least one framework to generate.");
      return;
    }
    await onGenerateProgram(projName, orgName, sector, selectedFrameworks, customFocus);
    // Select step 1 automatically upon successful generation
    setActiveStepNumber(1);
  };

  const steps = project.generatedProgram?.steps || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar: New Audit Form and Projects List */}
      <div className="lg:col-span-1 space-y-6">
        {/* Project Selector List */}
        {savedProjects.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              Saved Audit Projects
            </h3>
            <div className="space-y-2">
              {savedProjects.map(p => {
                const isSelected = p.id === project.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onLoadProject(p);
                      // Clear remediations
                      setRemediatingStep(null);
                      setRemediationPlan(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex justify-between items-center cursor-pointer ${
                      isSelected 
                        ? "bg-blue-50 border-blue-200 font-bold text-blue-700" 
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="truncate">
                      <p className="font-bold truncate">{p.name}</p>
                      <p className="text-[10px] opacity-75 mt-0.5 font-medium">{p.organization}</p>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Generate Custom Program Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Configure Custom Audit
            </h3>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-medium">
              Construct a targeted audit program with testing steps matching regional bank standards or e-commerce regulations.
            </p>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. FY2026 Payment Portal Audit"
                value={projName}
                onChange={e => setProjName(e.target.value)}
                className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-slate-400 rounded-lg p-2.5 focus:outline-none text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organization Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Fintech Ltd"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-slate-400 rounded-lg p-2.5 focus:outline-none text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Industry Sector</label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value)}
                className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none text-slate-700 font-semibold"
              >
                <option value="Banking & Financial Services">Banking & Financial Services</option>
                <option value="E-Commerce & Retail Payments">E-Commerce & Retail Payments</option>
                <option value="Fintech & Digital Wealth">Fintech & Digital Wealth</option>
                <option value="General Software & Enterprise SaaS">General Software & Enterprise SaaS</option>
                <option value="Government & Public Critical Infrastructure">Government & Public Infrastructure</option>
              </select>
            </div>

            {/* Target Frameworks checklist */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Align Regulations & Standards</label>
              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                {frameworks.map(f => {
                  const isChecked = selectedFrameworks.includes(f.id);
                  return (
                    <label key={f.id} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleFrameworkToggle(f.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">{f.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Special Scope Focus (Optional)</label>
              <textarea
                placeholder="e.g. Focus on physical data centers, HSM key rotation protocols, and backup immutability."
                value={customFocus}
                onChange={e => setCustomFocus(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-slate-400 rounded-lg p-2.5 focus:outline-none text-slate-700 resize-none font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoadingProgram}
              className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer mt-3 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-100" />
              {isLoadingProgram ? "Drafting with Gemini..." : "Generate Audit Program"}
            </button>
          </form>
        </div>
      </div>

      {/* Main Panel: Generated Audit Steps and Findings Form */}
      <div className="lg:col-span-2 space-y-6">
        {isLoadingProgram ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="relative">
              <RotateCw className="w-8 h-8 text-blue-600 animate-spin" />
              <Sparkles className="w-4 h-4 text-blue-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mt-4">Drafting Audit Program</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
              Gemini is assessing chosen frameworks, mapping control overlaps, and writing custom testing procedures tailored for your target sector...
            </p>
            {/* Loading queue ticker */}
            <div className="mt-6 space-y-1.5 text-left bg-slate-50 p-4 rounded-xl border border-slate-200 w-full max-w-md">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Audit Builder Queue:</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                Reviewing MAS TRM / BNM RMiT mandates...
              </p>
              <p className="text-[11px] text-slate-500 font-medium">&bull; Organizing physical & network segmentation scripts...</p>
              <p className="text-[11px] text-slate-500 font-medium">&bull; Writing auditor testing procedures & evidence checklists...</p>
            </div>
          </div>
        ) : steps.length > 0 ? (
          <div className="space-y-6">
            {/* Project Header in Main panel */}
            <div className="bg-blue-600 text-white rounded-xl p-5 shadow-sm border border-blue-700">
              <span className="font-mono text-[9px] text-blue-100 font-bold uppercase tracking-wider bg-blue-700/60 px-2 py-0.5 rounded">ACTIVE WORKING PROGRAM</span>
              <h2 className="text-lg font-bold mt-2 text-white">{project.generatedProgram?.title}</h2>
              <p className="text-blue-50 text-xs mt-1.5 leading-relaxed font-medium">{project.generatedProgram?.scope}</p>
            </div>

            {/* Test steps selector layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Steps selection rail */}
              <div className="md:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {steps.map(step => {
                  const isSelected = step.stepNumber === activeStepNumber;
                  const finding = project.findings[step.stepNumber.toString()];
                  
                  return (
                    <button
                      key={step.stepNumber}
                      onClick={() => handleSelectStep(step.stepNumber)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex flex-col justify-between cursor-pointer shadow-sm ${
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white" 
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className={`font-mono text-[10px] font-bold ${isSelected ? "text-blue-100" : "text-slate-400"}`}>STEP #{step.stepNumber}</span>
                        {finding && (
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            finding.status === "Compliant" ? "bg-emerald-500 border border-emerald-600" :
                            finding.status === "Partially Compliant" ? "bg-amber-500 border border-amber-600" :
                            finding.status === "Non-Compliant" ? "bg-rose-500 border border-rose-600" : "bg-slate-300"
                          }`} title={finding.status}></span>
                        )}
                      </div>
                      <p className="font-bold mt-2.5 truncate w-full">{step.objective}</p>
                    </button>
                  );
                })}
              </div>

              {/* Step workspace details */}
              <div className="md:col-span-2 space-y-6">
                {steps.map(step => {
                  if (step.stepNumber !== activeStepNumber) return null;
                  
                  const activeFinding = project.findings[step.stepNumber.toString()];
                  
                  return (
                    <div key={step.stepNumber} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                      {/* Step Header */}
                      <div className="border-b border-slate-200 pb-4">
                        <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-600 font-bold px-2.5 py-1 rounded">
                          AUDIT STEP #{step.stepNumber}
                        </span>
                        <h3 className="text-sm font-bold text-slate-800 mt-2.5">{step.objective}</h3>
                      </div>

                      {/* Detail Items */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-slate-500" />
                            Testing Audit Procedure
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium bg-slate-50/50 p-2.5 border border-slate-200/40 rounded-lg">{step.procedure}</p>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-slate-500" />
                            Evidence requested from client
                          </h4>
                          <p className="text-xs text-slate-800 leading-relaxed mt-1 font-bold bg-slate-50/50 p-2.5 border border-slate-200/40 rounded-lg">{step.evidenceRequested}</p>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                            Auditing Sample Guidelines
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1 italic bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-medium">{step.sampleGuideline}</p>
                        </div>

                        {/* Interview questions */}
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                            Key Interview Questions
                          </h4>
                          <ul className="mt-1 space-y-1 bg-slate-50/50 p-2.5 border border-slate-200/40 rounded-lg">
                            {step.interviewQuestions.map((q, qidx) => (
                              <li key={qidx} className="text-xs text-slate-600 flex items-start gap-1.5 py-0.5 font-medium">
                                <span className="text-blue-600 font-bold">{qidx + 1}.</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* FINDINGS LOGGER SHEET */}
                      <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-blue-600" />
                          Auditor Verification & Findings Log
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Compliance Status</label>
                            <select
                              value={fStatus}
                              onChange={e => setFStatus(e.target.value as any)}
                              className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none text-slate-700 font-bold"
                            >
                              <option value="Compliant">Compliant</option>
                              <option value="Partially Compliant">Partially Compliant</option>
                              <option value="Non-Compliant">Non-Compliant</option>
                              <option value="Not Applicable">Not Applicable</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Auditor / Assessor Name</label>
                            <input
                              type="text"
                              value={fAuditor}
                              onChange={e => setFAuditor(e.target.value)}
                              className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none text-slate-700 font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Evidence Document / File Inspected</label>
                          <input
                            type="text"
                            placeholder="e.g. NTB-IAM-MFA-LOGS v2.3, splice-firewall-configs.conf"
                            value={fEvidence}
                            onChange={e => setFEvidence(e.target.value)}
                            className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none text-slate-700 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Detailed Findings and Deficiency Notes</label>
                          <textarea
                            placeholder="Write audit logs here. Include date of test, specific parameters checked, deficiency findings, or compliance justification."
                            value={fNotes}
                            onChange={e => setFNotes(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-50 text-xs border border-slate-200 focus:border-slate-400 rounded-lg p-2.5 focus:outline-none text-slate-700 resize-none font-medium"
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          {/* Remediation Action button */}
                          {(fStatus === "Non-Compliant" || fStatus === "Partially Compliant") && (
                            <button
                              type="button"
                              onClick={() => handleGetRemediation(step, fNotes)}
                              disabled={isLoadingRemediation}
                              className="flex items-center gap-1.5 border border-amber-300 hover:border-amber-400 bg-amber-50 hover:bg-amber-100/50 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              <FlameKindling className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                              {isLoadingRemediation ? "Generating Playbook..." : "AI Remediation Plan"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleSaveFinding(step.stepNumber)}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Save Findings Log
                          </button>
                        </div>
                      </div>

                      {/* AI Remediation Display */}
                      {remediatingStep === step.stepNumber && (
                        <div className="mt-5 p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                              <FlameKindling className="w-4 h-4 text-amber-600 animate-pulse" />
                              AI Remediation Playbook (Step #{step.stepNumber})
                            </h5>
                            {isLoadingRemediation && <RotateCw className="w-3 h-3 text-amber-600 animate-spin" />}
                          </div>

                          {isLoadingRemediation && (
                            <p className="text-[11px] text-amber-700 italic">Gemini is formulating exact corrective measures, milestones, and testing checklists for this deficiency...</p>
                          )}

                          {remdiationPlanIsLoaded(remPlan(remediatingStep, remediationPlan)) && (
                            <div className="space-y-3.5 text-xs">
                              <div className="grid grid-cols-2 gap-3 text-[10px]">
                                <div className="bg-white border border-amber-200 p-2.5 rounded-lg shadow-sm">
                                  <span className="font-bold text-amber-800 uppercase">Estimated Timeline: </span>
                                  <span className="font-bold text-slate-700">{remPlan(remediatingStep, remediationPlan).estimatedTimeline}</span>
                                </div>
                                <div className="bg-white border border-amber-200 p-2.5 rounded-lg shadow-sm">
                                  <span className="font-bold text-amber-800 uppercase">Remediation Owner: </span>
                                  <span className="font-bold text-slate-700">{remPlan(remediatingStep, remediationPlan).remediationOwner}</span>
                                </div>
                              </div>

                              <div className="bg-white border border-amber-200 p-3 rounded-lg shadow-sm">
                                <span className="block font-bold text-amber-800 uppercase mb-1.5">Immediate Corrective Action (48-72h)</span>
                                <p className="text-slate-600 leading-relaxed font-medium">{remPlan(remediatingStep, remediationPlan).immediateActions}</p>
                              </div>

                              <div className="bg-white border border-amber-200 p-3 rounded-lg shadow-sm">
                                <span className="block font-bold text-amber-800 uppercase mb-1.5">Permanent Solutions & Policies</span>
                                <p className="text-slate-600 leading-relaxed font-medium">{remPlan(remediatingStep, remediationPlan).longTermRemediation}</p>
                              </div>

                              <div className="bg-white border border-amber-200 p-3 rounded-lg shadow-sm">
                                <span className="block font-bold text-amber-800 uppercase mb-1.5">Evidentiary Proof Required For Follow-up</span>
                                <p className="text-slate-600 leading-relaxed font-mono text-[10px]">{remPlan(remediatingStep, remediationPlan).testingProof}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Recommendations Banner */}
            {project.generatedProgram?.additionalRecommendations && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  Executive Audit Board Advisory
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                  &ldquo;{project.generatedProgram.additionalRecommendations}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-sm flex flex-col items-center justify-center text-center">
            <BookOpen className="w-12 h-12 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800 mt-4">No Audit Program Active</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed font-medium">
              Use the sidebar configuration panel to customize and generate a professional, standard-aligned Cybersecurity Audit Program.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick safe access helpers to prevent typescript errors on dynamic states
function remPlan(stepNum: number | null, plan: RemediationPlan | null): any {
  return plan || {};
}

function remdiationPlanIsLoaded(plan: any): boolean {
  return !!plan && !!plan.immediateActions;
}
