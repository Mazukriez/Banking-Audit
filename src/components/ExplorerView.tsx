import React, { useState } from "react";
import { frameworks } from "../data/frameworks";
import { Framework, Control } from "../types";
import { Search, Globe, Landmark, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ExplorerView() {
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>("nist_csf");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentFramework = frameworks.find((f) => f.id === selectedFrameworkId) || frameworks[0];

  // Filter controls based on search query
  const filteredControls = currentFramework.controls.filter(
    (c) =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Selector */}
      <div className="lg:col-span-1 space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Framework</h2>
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {frameworks.map((f) => {
            const isSelected = f.id === selectedFrameworkId;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFrameworkId(f.id);
                  setSearchQuery("");
                }}
                className={`flex-shrink-0 text-left px-4 py-3.5 rounded-xl border text-xs transition-all flex flex-col justify-between cursor-pointer shadow-sm ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white font-semibold"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-950"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-blue-100" : "text-slate-400"}`}>{f.name}</span>
                </div>
                <span className="block text-[11px] font-medium truncate mt-1.5 w-full max-w-[160px] lg:max-w-none opacity-95">
                  {f.fullName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel */}
      <div className="lg:col-span-3 space-y-6">
        {/* Framework Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{currentFramework.fullName}</h1>
              <p className="text-slate-400 text-xs font-mono mt-1 font-medium">{currentFramework.authority}</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-full">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {currentFramework.region}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                <Landmark className="w-3.5 h-3.5 text-blue-500" />
                Regulatory Compliance
              </span>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 p-4 rounded-xl">{currentFramework.scope}</p>
        </div>

        {/* Search and Controls List */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              Standard Control Registers ({filteredControls.length} of {currentFramework.controls.length})
            </h2>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search control id, name, details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-xs border border-slate-200 focus:border-slate-400 pl-8 pr-3 py-2.5 rounded-lg transition-all focus:outline-none placeholder-slate-400 text-slate-700 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto pr-1">
            {filteredControls.map((control) => (
              <div key={control.id} className="py-4 first:pt-0 last:pb-0 hover:bg-slate-50/30 transition-colors px-2 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start gap-3 justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-slate-100 border border-slate-200 text-slate-800 font-bold px-2.5 py-0.5 rounded-md">
                        {control.id}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800">{control.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{control.description}</p>
                  </div>
                  <span className="flex-shrink-0 flex items-center gap-1.5 text-[9px] font-bold font-mono text-slate-400 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-full mt-2 sm:mt-0 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                    Control Unit
                  </span>
                </div>
              </div>
            ))}

            {filteredControls.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xs italic text-slate-400">No controls match your search criteria.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-blue-600 underline mt-2 hover:text-blue-700 cursor-pointer"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
