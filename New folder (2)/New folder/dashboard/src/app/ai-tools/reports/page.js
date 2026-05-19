"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  Cpu, 
  ShieldCheck, 
  Zap,
  Terminal
} from "lucide-react";
import { useDocumentIntelligence, DocumentIntelligenceReport } from "../../../components/DocumentIntelligenceEngine";

export default function DocumentProcessor() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("Aadhaar");
  const { analyze, isAnalyzing, analysisProgress, result } = useDocumentIntelligence();

  const handleRunAnalysis = (e) => {
    e.preventDefault();
    if (!file) return;
    analyze([file], docType);
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-slate-400 hover:text-white transition-all inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
            <ArrowLeft className="w-4 h-4" /> Home Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">
              System: Online
            </div>
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Agent: Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0A1120] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Cpu className="w-32 h-32" />
               </div>
               
               <h1 className="text-2xl font-black tracking-tighter text-white mb-2">Intelligence Input</h1>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-8">DevFlow Document Engine v4.0</p>

               <div className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Target Document Class</label>
                   <div className="grid grid-cols-2 gap-2">
                     {["Aadhaar", "PAN Card", "Passport", "Driving License"].map((t) => (
                       <button
                         key={t}
                         onClick={() => setDocType(t)}
                         className={`px-3 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                           docType === t 
                            ? "bg-teal-600 border-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] ring-2 ring-teal-500/20" 
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                         }`}
                       >
                         {t}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Upload Source File</label>
                   <label className="cursor-pointer block group">
                     <div className="border-2 border-dashed border-slate-800 rounded-[2rem] p-8 text-center bg-slate-900/40 group-hover:bg-slate-900 group-hover:border-teal-500/50 transition-all duration-500">
                       <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700 group-hover:scale-110 group-hover:bg-teal-500/10 group-hover:border-teal-500/40 transition-all">
                        <UploadCloud className="w-6 h-6 text-teal-400" />
                       </div>
                       <div className="text-sm font-black text-white mb-1">Select Document</div>
                       <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Neural analysis will run automatically</div>
                       
                       {file && (
                         <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-black uppercase animate-in zoom-in-95">
                           <FileText className="w-4 h-4" /> {file.name}
                         </div>
                       )}
                     </div>
                     <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                   </label>
                 </div>

                 <button
                   disabled={!file || isAnalyzing}
                   onClick={handleRunAnalysis}
                   className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${
                     !file || isAnalyzing
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xl hover:shadow-teal-500/20 border border-teal-400/50 active:scale-95"
                   }`}
                 >
                   {isAnalyzing ? (
                     <>
                        <Zap className="w-4 h-4 animate-pulse" /> Processing Intelligence...
                     </>
                   ) : (
                     <>
                        <Terminal className="w-4 h-4" /> Start Analysis Scan
                     </>
                   )}
                 </button>
               </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-8">
            {!result && !isAnalyzing ? (
              <div className="h-full bg-[#0A1120] border border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-24 h-24 bg-slate-900 rounded-[2rem] border border-slate-800 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-slate-700" />
                </div>
                <h2 className="text-xl font-black text-slate-300 mb-2 uppercase tracking-widest">Awaiting Input</h2>
                <p className="max-w-xs text-sm text-slate-500 font-medium leading-relaxed">
                  The Document Intelligence Engine is initialized and ready for secure identity analysis.
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="h-full bg-[#0A1120] border border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center">
                <div className="w-20 h-20 relative mb-8">
                  <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-4 bg-teal-500/10 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-teal-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Analyzing Core Identity</h2>
                <div className="w-full max-w-sm space-y-4">
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500" 
                      style={{ width: `${analysisProgress}%` }} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] text-center">
                    {analysisProgress < 30 ? "Initializing Neural Scanner..." : analysisProgress < 70 ? "Cross-referencing Global Datasets..." : "Validating Cryptographic Signatures..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-[#0A1120]/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-inner overflow-y-auto max-h-[80vh] custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-teal-400" /> Analysis Report
                  </h2>
                  <button 
                    onClick={() => { setFile(null); analyze([], ""); }}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800"
                  >
                    Clear Results
                  </button>
                </div>
                <DocumentIntelligenceReport result={result} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

