import React, { useState } from "react";
import { frameworks, mappingTopics } from "../data/frameworks";
import { MappingTopic, MappingResult, Control, Framework } from "../types";
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  Scale, 
  CheckCircle, 
  ShieldAlert, 
  Layers, 
  Download,
  FlameKindling,
  Workflow
} from "lucide-react";

export default function MappingMatrixView() {
  // Pre-seeded topics state
  const [selectedTopicId, setSelectedTopicId] = useState<string>("access_control");
  
  // Interactive AI Mapping States
  const [sourceFrameworkId, setSourceFrameworkId] = useState<string>("nist_csf");
  const [sourceControlId, setSourceControlId] = useState<string>("PR.AA");
  const [targetFrameworkId, setTargetFrameworkId] = useState<string>("iso_27001");
  const [targetControlId, setTargetControlId] = useState<string>("auto");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mappingResult, setMappingResult] = useState<MappingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Get active pre-seeded topic
  const activeTopic = mappingTopics.find(t => t.id === selectedTopicId) || mappingTopics[0];

  // Helper variables for source/target selection dropdowns
  const sourceFramework = frameworks.find(f => f.id === sourceFrameworkId) || frameworks[0];
  const targetFramework = frameworks.find(f => f.id === targetFrameworkId) || frameworks[0];
  const sourceControls = sourceFramework.controls;
  const targetControls = targetFramework.controls;

  // Change source control list automatically when source framework changes
  const handleSourceFrameworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fId = e.target.value;
    setSourceFrameworkId(fId);
    const firstControl = frameworks.find(f => f.id === fId)?.controls[0]?.id || "";
    setSourceControlId(firstControl);
  };

  // Perform Gemini Audit Mapping Query
  const runAiMapping = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setMappingResult(null);

    const sControl = sourceFramework.controls.find(c => c.id === sourceControlId);
    const tControl = targetFramework.controls.find(c => c.id === targetControlId);

    try {
      const response = await fetch("/api/gemini/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceFramework: sourceFramework.fullName,
          sourceControl: sControl,
          targetFramework: targetFramework,
          targetControl: targetControlId === "auto" ? null : tControl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate AI mapping.");
      }

      const data = await response.json();
      setMappingResult(data);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An error occurred while calling the mapping engine.");
    } finally {
      setIsLoading(false);
    }
  };

  // Export mapping result as markdown
  const exportMappingMarkdown = () => {
    if (!mappingResult) return;
    const sControl = sourceFramework.controls.find(c => c.id === sourceControlId);
    
    const content = `
# Cross-Framework Audit Mapping Alignment
Generated via GRC Audit Mapping Studio & Gemini AI

## Source Control Details
- **Framework**: ${sourceFramework.fullName}
- **Control**: ${sControl?.id} - ${sControl?.name}
- **Description**: ${sControl?.description}

## Target Control Details (Aligned)
- **Framework**: ${targetFramework.fullName}
- **Target Control ID**: ${mappingResult.targetControlId}
- **Target Control Name**: ${mappingResult.targetControlName}
- **Target Description**: ${mappingResult.targetControlDescription}
- **Alignment Confidence Level**: ${mappingResult.confidenceLevel}

---

## 🔗 Alignment Rationale & Overlap Analysis
${mappingResult.alignmentRationale}

## ⚠️ Regulatory Gap Analysis (Exceptions / Additional Targets)
${mappingResult.gapAnalysis}

## 📋 Consolidated Audit Testing Methodology
${mappingResult.testingMethodology}

## 📂 Suggested Evidence & Verification Artifacts
${mappingResult.suggestedArtifacts.map(art => `- [ ] ${art}`).join("\n")}
    `;

    const blob = new Blob([content.trim()], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GRC_Mapping_${sourceFrameworkId}_to_${targetFrameworkId}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Pre-seeded Standard Mapping Register */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-500" />
            Standard GRC Cross-Framework Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Choose a common operational cybersecurity topic below to view standard mapping references and combined auditing evidence targets.
          </p>
        </div>

        {/* Topic tabs bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mt-4 border-b border-slate-200/60">
          {mappingTopics.map(topic => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`flex-shrink-0 text-xs px-3.5 py-2 rounded-lg border font-bold transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {topic.title}
              </button>
            );
          })}
        </div>

        {/* Alignment Matrix Grid */}
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(activeTopic.mappings).map(([fId, controlCode]) => {
              const frameworkMeta = frameworks.find(f => f.id === fId);
              return (
                <div key={fId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{frameworkMeta?.name || fId}</p>
                  <p className="text-xs font-bold text-blue-600 mt-1 font-mono">{controlCode}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-blue-500" />
              Consolidated Audit Evidence (Satisfies All 8 Standards)
            </h4>
            <ul className="space-y-1.5">
              {activeTopic.evidence.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 font-medium">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: Dynamic AI Compliance Mapping Explorer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/60 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              AI Control Mapping & Gap Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              Select any control in a source standard, choose a target standard, and generate a customized alignment and audit procedures report.
            </p>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">1. Source Framework</label>
            <select
              value={sourceFrameworkId}
              onChange={handleSourceFrameworkChange}
              className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-slate-400 text-slate-700 font-medium"
            >
              {frameworks.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">2. Source Control</label>
            <select
              value={sourceControlId}
              onChange={(e) => setSourceControlId(e.target.value)}
              className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-slate-400 text-slate-700 font-medium"
            >
              {sourceControls.map(c => (
                <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">3. Target Framework</label>
            <select
              value={targetFrameworkId}
              onChange={(e) => setTargetFrameworkId(e.target.value)}
              className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-slate-400 text-slate-700 font-medium"
            >
              {frameworks.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">4. Target Control Target</label>
            <select
              value={targetControlId}
              onChange={(e) => setTargetControlId(e.target.value)}
              className="w-full bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-slate-400 text-slate-700 font-medium"
            >
              <option value="auto">AI Search Best Overlapping Control</option>
              {targetControls.map(c => (
                <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={runAiMapping}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-100" />
            {isLoading ? "Running GRC Gap Analysis..." : "Analyze Compliance Mapping"}
          </button>
        </div>

        {/* Loading and results sections */}
        {isLoading && (
          <div className="mt-6 p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-20"></span>
              <Sparkles className="w-6 h-6 text-blue-600 animate-bounce" />
            </div>
            <p className="text-xs font-bold text-slate-700 mt-4">Invoking Gemini Auditing Engine...</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-sm leading-relaxed">
              Analyzing control descriptors, evaluating organizational gaps, mapping evidence targets, and consolidating joint audit testing scripts.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-semibold">
            Error: {errorMsg}. Please try adjusting your parameters or verify your connection.
          </div>
        )}

        {mappingResult && (
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header banner */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-slate-800 border border-slate-300 text-white font-bold px-2.5 py-0.5 rounded">
                  {sourceControlId}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2.5 py-0.5 rounded">
                  {mappingResult.targetControlId}
                </span>
                <span className="text-xs font-bold text-slate-700">Mapping Overview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alignment Confidence:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  mappingResult.confidenceLevel === "High" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  mappingResult.confidenceLevel === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  {mappingResult.confidenceLevel} Confidence
                </span>
                <button 
                  onClick={exportMappingMarkdown}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded bg-white border border-slate-200 transition-colors cursor-pointer shadow-sm"
                  title="Export Mapping Report"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="p-6 bg-white space-y-6">
              {/* Controls display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-200 pb-5">
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{sourceFramework.name} (Source)</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">{sourceControlId} - {sourceFramework.controls.find(c => c.id === sourceControlId)?.name}</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">{sourceFramework.controls.find(c => c.id === sourceControlId)?.description}</p>
                </div>
                <div className="p-3 bg-blue-50/30 border border-blue-100 rounded-lg">
                  <p className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">{targetFramework.name} (Target)</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">{mappingResult.targetControlId} - {mappingResult.targetControlName}</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">{mappingResult.targetControlDescription}</p>
                </div>
              </div>

              {/* Rationale and Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Workflow className="w-3.5 h-3.5 text-blue-500" />
                    Alignment Rationale & Similarities
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 p-3 rounded-lg font-medium">
                    {mappingResult.alignmentRationale}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-500" />
                    Regulatory Gap Analysis
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 p-3 rounded-lg font-medium">
                    {mappingResult.gapAnalysis}
                  </p>
                </div>
              </div>

              {/* Testing procedures */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-blue-500" />
                  Consolidated Audit Testing Procedure
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 p-3 rounded-lg font-medium">
                  {mappingResult.testingMethodology}
                </p>
              </div>

              {/* Evidence Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  Suggested Evidence Checklists
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mappingResult.suggestedArtifacts.map((art, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{art}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
