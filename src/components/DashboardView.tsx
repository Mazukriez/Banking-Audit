import React from "react";
import { AuditProject, Framework } from "../types";
import { frameworks } from "../data/frameworks";
import { 
  Shield, 
  Building2, 
  Activity, 
  Calendar, 
  FileCheck2, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  FileText,
  AlertTriangle,
  Download
} from "lucide-react";

interface DashboardViewProps {
  project: AuditProject;
  onNavigateToTab: (tab: string) => void;
  onExportMarkdown: () => void;
}

export default function DashboardView({ project, onNavigateToTab, onExportMarkdown }: DashboardViewProps) {
  const steps = project.generatedProgram?.steps || [];
  const totalStepsCount = steps.length;
  
  // Calculate compliance statistics
  const evaluatedSteps = Object.keys(project.findings).length;
  const statusCounts = {
    Compliant: 0,
    "Partially Compliant": 0,
    "Non-Compliant": 0,
    "Not Applicable": 0
  };

  Object.values(project.findings).forEach(finding => {
    statusCounts[finding.status] = (statusCounts[finding.status] || 0) + 1;
  });

  const compliantCount = statusCounts.Compliant;
  const partialCount = statusCounts["Partially Compliant"];
  const nonCompliantCount = statusCounts["Non-Compliant"];
  
  // Compliance score: Compliant = 100%, Partially Compliant = 50%
  const scoreBase = compliantCount * 1.0 + partialCount * 0.5;
  const complianceScore = evaluatedSteps > 0 
    ? Math.round((scoreBase / evaluatedSteps) * 100) 
    : 100;

  const progressPercent = totalStepsCount > 0 
    ? Math.round((evaluatedSteps / totalStepsCount) * 100) 
    : 0;

  // Active framework models
  const projectFrameworks = frameworks.filter(f => project.selectedFrameworks.includes(f.id));

  // Extract non-compliant and partially compliant steps for direct actionable feedback
  const outstandingFindings = steps.filter(step => {
    const finding = project.findings[step.stepNumber.toString()];
    return finding && (finding.status === "Non-Compliant" || finding.status === "Partially Compliant");
  });

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div id="project-overview-card" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full w-fit uppercase tracking-wide">
              <Shield className="w-3.5 h-3.5" />
              Active GRC Audit Workspace
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mt-2.5">{project.name}</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">{project.organization} &bull; {project.sector}</p>
          </div>
          <button 
            onClick={onExportMarkdown}
            className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Audit Program (.md)
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-slate-600">
              <Building2 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sector Focus</p>
              <p className="text-xs font-bold text-slate-700 truncate">{project.sector}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-slate-600">
              <Calendar className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audit Initiated</p>
              <p className="text-xs font-bold text-slate-700">
                {new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-slate-600">
              <Activity className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Program</p>
              <p className="text-xs font-bold text-slate-700">{totalStepsCount} Testing Steps</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-slate-600">
              <FileCheck2 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Progress Evaluated</p>
              <p className="text-xs font-bold text-slate-700">{evaluatedSteps} of {totalStepsCount} ({progressPercent}%)</p>
            </div>
          </div>
        </div>
        
        {project.customFocus && (
          <div className="mt-4 p-3 bg-slate-50/70 rounded-lg text-xs text-slate-600 border border-slate-200/60">
            <span className="font-semibold text-slate-700">Audit Focus Scope: </span>
            {project.customFocus}
          </div>
        )}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Rating Circle */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 self-start">Compliance Rating Score</h2>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className={`transition-all duration-1000 ease-out ${
                  complianceScore >= 80 ? "stroke-blue-600" : complianceScore >= 50 ? "stroke-amber-500" : "stroke-rose-500"
                }`}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - complianceScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{complianceScore}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weighted Score</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 max-w-xs leading-relaxed">
            Calculated as Compliant (100% weight) and Partially Compliant (50% weight) across all {evaluatedSteps} tested procedures.
          </p>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Audit Status Distribution</h2>
          
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>Compliant</span>
                <span className="font-semibold text-slate-700">{compliantCount} steps</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${evaluatedSteps > 0 ? (compliantCount / evaluatedSteps) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Partially Compliant</span>
                <span className="font-semibold text-slate-700">{partialCount} steps</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${evaluatedSteps > 0 ? (partialCount / evaluatedSteps) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Non-Compliant</span>
                <span className="font-semibold text-slate-700">{nonCompliantCount} steps</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${evaluatedSteps > 0 ? (nonCompliantCount / evaluatedSteps) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>Not Tested / Pending</span>
                <span className="font-semibold text-slate-700">{totalStepsCount - evaluatedSteps} steps</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: `${totalStepsCount > 0 ? ((totalStepsCount - evaluatedSteps) / totalStepsCount) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Framework Coverage Alignment */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Standards Mapping Footprint</h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">The current audit program covers the following regulatory and governance frameworks:</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {projectFrameworks.map(f => (
              <div key={f.id} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-700 truncate">{f.name}</p>
                  <p className="text-[9px] text-slate-400 truncate">{f.authority}</p>
                </div>
              </div>
            ))}
            {projectFrameworks.length === 0 && (
              <p className="text-xs italic text-slate-400 col-span-2">No frameworks selected. Generate an audit program to begin.</p>
            )}
          </div>

          <button 
            onClick={() => onNavigateToTab("explorer")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-4 block text-left"
          >
            Explore detailed controls of these standards &rarr;
          </button>
        </div>
      </div>

      {/* Actionable Findings and To-Dos */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          Outstanding Non-Compliance Findings ({outstandingFindings.length})
        </h2>

        {outstandingFindings.length > 0 ? (
          <div className="space-y-4">
            {outstandingFindings.map(step => {
              const finding = project.findings[step.stepNumber.toString()];
              return (
                <div key={step.stepNumber} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50/80 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      PROCEDURE STEP #{step.stepNumber} &bull; {step.objective}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                      finding.status === "Non-Compliant" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {finding.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 font-bold uppercase mt-2.5 tracking-wider">Audit Finding Discovered:</p>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-white p-2.5 rounded border border-slate-200/60 font-medium">{finding.notes}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-200/60 text-[10px] text-slate-400">
                    <div>
                      <span className="font-bold text-slate-500">Evidence Inspected: </span>
                      <span className="italic font-medium">{finding.evidenceName || "None documented"}</span>
                    </div>
                    <div>&bull;</div>
                    <div>
                      <span className="font-bold text-slate-500">Auditor: </span>
                      <span className="font-medium">{finding.auditor}</span>
                    </div>
                    <div>&bull;</div>
                    <div>
                      <span className="font-bold text-slate-500">Updated: </span>
                      <span className="font-medium">{new Date(finding.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>

                  <div className="mt-3.5 flex justify-end">
                    <button 
                      onClick={() => onNavigateToTab("workspace")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Remediate with AI Assistant &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
            <p className="text-sm font-bold text-slate-700 mt-3">All Audited Controls Compliant</p>
            <p className="text-xs text-slate-400 mt-1 text-center max-w-md leading-relaxed">
              No outstanding non-compliance or partial-compliance findings are registered. Use the Auditor Workspace to log findings, or generate a new program.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
