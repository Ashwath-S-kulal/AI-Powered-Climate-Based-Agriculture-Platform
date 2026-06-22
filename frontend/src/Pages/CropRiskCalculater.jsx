import React, { useState } from 'react';
import CropRiskCalculator from "./RiskTool1.jsx";
import ClimateRiskCalculator from "./RiskTool2.jsx";
import Header from "../Components/Header.jsx";
import { FaChartBar } from 'react-icons/fa';

// Sleek micro-scale SVG Icons
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const SlidersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" />
    <line x1="18" y1="16" x2="22" y2="16" />
  </svg>
);

export default function WorkspaceManager() {
  const [activeTab, setActiveTab] = useState('tool1');

  return (
    <>
      <Header />
      <div className="w-full bg-white border-b border-slate-200/80 pt-5 md:pt-8 px-4 sm:px-6">
        <div className="text-left md:text-left md:flex md:items-left md:justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-left justify-left md:justify-start gap-2 ">
              <FaChartBar className="text-emerald-600" size={26} /> AgriSense Climate Risk Tool
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Evaluate real-time crop resilience margins, predict contextual hazards, and map optimal environmental risk distributions.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-screen mx-auto px-2 md:px-8 py-5 pb-16 font-sans antialiased text-slate-900 selection:bg-slate-200">
        <div className="inline-flex items-center w-full sm:w-auto bg-[#edf2f6] p-0.5 rounded-lg border border-slate-200/50 shadow-3xs mb-5 transition-all">
          <button
            onClick={() => setActiveTab('tool1')}
            className={`flex items-center justify-center gap-2 px-3.5 py-1.5 text-[11px] tracking-tight rounded-md font-semibold transition-all duration-150 focus:outline-none flex-1 sm:flex-initial select-none ${activeTab === 'tool1'
              ? 'bg-white text-slate-900 shadow-3xs border border-slate-200/20'
              : 'text-slate-400 hover:text-slate-600 bg-transparent'
              }`}
          >
            <SearchIcon className={`w-3 h-3 flex-shrink-0 stroke-[2.5px] transition-colors ${activeTab === 'tool1' ? 'text-slate-900' : 'text-slate-400'}`} />
            <span>Tool 1: Climate Risk Finder</span>
          </button>

          <button
            onClick={() => setActiveTab('tool2')}
            className={`flex items-center justify-center gap-2 px-3.5 py-1.5 text-[11px] tracking-tight rounded-md font-semibold transition-all duration-150 focus:outline-none flex-1 sm:flex-initial select-none ${activeTab === 'tool2'
              ? 'bg-white text-slate-900 shadow-3xs border border-slate-200/20'
              : 'text-slate-400 hover:text-slate-600 bg-transparent'
              }`}
          >
            <SlidersIcon className={`w-3 h-3 flex-shrink-0 stroke-[2.5px] transition-colors ${activeTab === 'tool2' ? 'text-slate-900' : 'text-slate-400'}`} />
            <span>Tool 2: Risk Calculator</span>
          </button>
        </div>

        <div className="w-full bg-[#f8fafc] rounded-xl border border-slate-200/60 shadow-3xs p-1 md:p-2 transition-all duration-200 min-h-[350px]">
          <div className="w-full animate-fadeIn transition-opacity duration-150">
            {activeTab === 'tool1' ? (
              <CropRiskCalculator />
            ) : (
              <ClimateRiskCalculator />
            )}
          </div>
        </div>

      </div>
    </>
  );
}