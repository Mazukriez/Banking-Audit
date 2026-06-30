import React, { useState, useEffect } from "react";
import { AuditProject, AuditFinding, GeneratedAuditProgram } from "./types";
import { defaultProject } from "./data/defaultProject";
import DashboardView from "./components/DashboardView";
import ExplorerView from "./components/ExplorerView";
import MappingMatrixView from "./components/MappingMatrixView";
import ProgramBuilderView from "./components/ProgramBuilderView";
import { 
  ShieldCheck, 
  Layers, 
  Workflow, 
  BookOpen, 
  FileText, 
  Activity, 
  CheckCircle,
  Clock,
  Sparkles,
  Building
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeProject, setActiveProject] = useState<AuditProject>(defaultProject);
  const [savedProjects, setSavedProjects] = useState<AuditProject[]>([]);
  const [isLoadingProgram, setIsLoadingProgram] = useState<boolean>(false);

  // Load saved projects on startup
  useEffect(() => {
    const raw = localStorage.getItem("grc_audit_projects");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AuditProject[];
        if (parsed && parsed.length > 0) {
          setSavedProjects(parsed);
          // Set the first project in saved list or default
          const lastActiveId = localStorage.getItem("grc_last_active_project_id");
          const found = parsed.find(p => p.id === lastActiveId);
          setActiveProject(found || parsed[0]);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved GRC projects:", e);
      }
    }
    
    // Seed default project on first boot
    setSavedProjects([defaultProject]);
    setActiveProject(defaultProject);
    localStorage.setItem("grc_audit_projects", JSON.stringify([defaultProject]));
  }, []);

  // Save current active project updates into list and localStorage
  const saveProjectState = (updatedProj: AuditProject) => {
    setActiveProject(updatedProj);
    const updatedList = savedProjects.map(p => p.id === updatedProj.id ? updatedProj : p);
    
    // If it's a new project not yet in list, append it
    if (!updatedList.some(p => p.id === updatedProj.id)) {
      updatedList.push(updatedProj);
    }

    setSavedProjects(updatedList);
    localStorage.setItem("grc_audit_projects", JSON.stringify(updatedList));
    localStorage.setItem("grc_last_active_project_id", updatedProj.id);
  };

  // Switch to a different project
  const handleLoadProject = (proj: AuditProject) => {
    setActiveProject(proj);
    localStorage.setItem("grc_last_active_project_id", proj.id);
  };

  // Update findings for a specific audit step
  const handleUpdateFinding = (stepId: string, finding: AuditFinding) => {
    const updatedFindings = {
      ...activeProject.findings,
      [stepId]: finding
    };

    const updatedProj = {
      ...activeProject,
      findings: updatedFindings
    };

    saveProjectState(updatedProj);
    alert(`Findings successfully logged for Step #${stepId}!`);
  };

  // Trigger Gemini to generate a fully custom aligned audit program
  const handleGenerateProgram = async (
    name: string, 
    organization: string, 
    sector: string, 
    selectedFrameworks: string[], 
    customFocus: string
  ) => {
    setIsLoadingProgram(true);
    try {
      const response = await fetch("/api/gemini/generate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, organization, sector, selectedFrameworks, customFocus })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to compile custom audit program.");
      }

      const generatedProgram = await response.json() as GeneratedAuditProgram;

      // Seed a brand new AuditProject
      const newProj: AuditProject = {
        id: `audit_${Date.now()}`,
        name: name || `${organization} Aligned Compliance Audit`,
        organization: organization || "Enterprise Client",
        sector: sector,
        createdAt: new Date().toISOString(),
        selectedFrameworks: selectedFrameworks,
        customFocus: customFocus,
        findings: {}, // Start fresh with no findings evaluated yet
        generatedProgram: generatedProgram
      };

      // Save into list and make it active
      saveProjectState(newProj);
      alert("Success! Your custom-aligned GRC Audit Work Program has been successfully compiled and synchronized.");
    } catch (error: any) {
      console.error(error);
      alert(`GRC Compiler Error: ${error.message || "Failed to generate audit program."}`);
    } finally {
      setIsLoadingProgram(false);
    }
  };

  // Export full audit report as GRC Markdown document
  const handleExportMarkdown = () => {
    const prog = activeProject.generatedProgram;
    if (!prog) {
      alert("No active audit program available to export. Generate a program first.");
      return;
    }

    // Evaluate stats
    const totalSteps = prog.steps.length;
    const evaluatedSteps = Object.keys(activeProject.findings).length;
    
    let compliantCount = 0;
    let partialCount = 0;
    let nonCompliantCount = 0;

    (Object.values(activeProject.findings) as AuditFinding[]).forEach(finding => {
      if (finding.status === "Compliant") compliantCount++;
      else if (finding.status === "Partially Compliant") partialCount++;
      else if (finding.status === "Non-Compliant") nonCompliantCount++;
    });

    const score = evaluatedSteps > 0 
      ? Math.round(((compliantCount * 1.0 + partialCount * 0.5) / evaluatedSteps) * 100) 
      : 100;

    let content = `
# Cybersecurity Audit Alignment Report & Work Program
**Project**: ${activeProject.name}
**Assessed Organization**: ${activeProject.organization}
**Industry Sector**: ${activeProject.sector}
**Report Generation Date (UTC)**: ${new Date().toISOString().split('T')[0]}

---

## 📊 Compliance Audit Executive Summary
- **Overall Compliance Score**: ${score}%
- **Scope Alignment**: ${prog.alignedFrameworks.join(", ")}
- **Procedures Assessed**: ${evaluatedSteps} of ${totalSteps} (${Math.round((evaluatedSteps / totalSteps) * 100)}%)
  - *Compliant*: ${compliantCount} steps
  - *Partially Compliant*: ${partialCount} steps
  - *Non-Compliant (Deficiencies)*: ${nonCompliantCount} steps

### Audit Focus Mandate
> ${activeProject.customFocus || "Evaluate core controls and logging configurations across target frameworks."}

---

## 📋 Custom Aligned GRC Work Program & Testing Outcomes
    `;

    prog.steps.forEach(step => {
      const finding = activeProject.findings[step.stepNumber.toString()];
      const statusText = finding ? finding.status : "PENDING AUDIT / NOT TESTED";
      const auditorName = finding ? finding.auditor : "N/A";
      const evidence = finding ? finding.evidenceName : "N/A";
      const notes = finding ? finding.notes : "No audit findings logged yet. Testing procedure pending.";

      content += `
### Step #${step.stepNumber}: ${step.objective}
- **Audit Verification Status**: [ **${statusText}** ]
- **Assessing Auditor**: ${auditorName}
- **Evidence Inspected**: ${evidence}

#### A. Testing Procedure
${step.procedure}

#### B. Evidentiary Targets Requested
${step.evidenceRequested}

#### C. Auditor Sampling Strategy
${step.sampleGuideline}

#### D. Auditor Notes & Deficiency Records
> ${notes}

---
      `;
    });

    if (prog.additionalRecommendations) {
      content += `
## 🏛️ Executive GRC Strategic Board Advisory
${prog.additionalRecommendations}
      `;
    }

    const blob = new Blob([content.trim()], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GRC_Audit_Program_Report_${activeProject.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Sleek Professional Banner / Navigation Header */}
      <header id="app-main-header" className="bg-white text-slate-800 border-b border-slate-200 py-3 px-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm text-white">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-800 flex items-center gap-2 font-sans">
                AuditSense
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md font-mono uppercase font-bold">
                  GRC v2.5
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise GRC Audit Compiler & Alignments Manager</p>
            </div>
          </div>

          {/* Navigation Tab Menu */}
          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto justify-between md:justify-end">
            <nav className="flex bg-slate-100 border border-slate-200/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/40"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("explorer")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "explorer"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/40"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Frameworks
              </button>
              <button
                onClick={() => setActiveTab("mapping")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "mapping"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/40"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Cross-Framework Map
              </button>
              <button
                onClick={() => setActiveTab("workspace")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "workspace"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/40"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                Auditor Workspace
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-semibold text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              System Secure
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        
        {/* Render Active View Tab */}
        {activeTab === "dashboard" && (
          <DashboardView 
            project={activeProject} 
            onNavigateToTab={setActiveTab}
            onExportMarkdown={handleExportMarkdown}
          />
        )}

        {activeTab === "explorer" && (
          <ExplorerView />
        )}

        {activeTab === "mapping" && (
          <MappingMatrixView />
        )}

        {activeTab === "workspace" && (
          <ProgramBuilderView 
            project={activeProject}
            onUpdateFinding={handleUpdateFinding}
            onGenerateProgram={handleGenerateProgram}
            isLoadingProgram={isLoadingProgram}
            onLoadProject={handleLoadProject}
            savedProjects={savedProjects}
          />
        )}

      </main>

      {/* Studio Footer */}
      <footer className="border-t border-slate-200 mt-16 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-medium">
          <div>
            &copy; 2026 Audit Mapping & Program Studio &bull; Multi-Framework Compliance Matrix
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Empowered by Google Gemini Auditing Intel
          </div>
        </div>
      </footer>
    </div>
  );
}
