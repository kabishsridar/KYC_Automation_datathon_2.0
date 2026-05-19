"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Network, 
  Search, 
  Fingerprint, 
  ShieldCheck, 
  Activity,
  Maximize2,
  Terminal,
  Layers,
  Cpu
} from "lucide-react";
import { useIdentityGraph, IdentityGraphVisualization, IdentityNetworkInsights } from "../../components/IdentityGraphEngine";

export default function AiIdentityGraphPage() {
  const [searchId, setSearchId] = useState("KYC-10291");
  const graphData = useIdentityGraph(searchId);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-8">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Link href="/" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Exit Engine
            </Link>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white">Identity Graph Engine</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cross-Identity Correlation & Fraud Mapping</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deep Learning Active</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input & Global Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Network Research</h3>
               
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Target Identity Pointer</label>
                    <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-teal-400 transition-colors" />
                       <input 
                         type="text"
                         value={searchId}
                         onChange={(e) => setSearchId(e.target.value)}
                         placeholder="Enter KYC ID or Fingerprint..."
                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:border-teal-500/50 transition-all"
                       />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                     <ControlToggle label="Deep Image Matching" active />
                     <ControlToggle label="Temporal IP Analysis" active />
                     <ControlToggle label="Synthetic ID Detection" active />
                     <ControlToggle label="Device ID Fingerprinting" active />
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-teal-400 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 mt-4">
                     <Activity className="w-4 h-4" /> Rebuild Graph Map
                  </button>
               </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Global Statistics</h4>
                <div className="space-y-4">
                   <StatRow label="Monitored Nodes" value="1.8M" />
                   <StatRow label="Active Clusters" value="482" />
                   <StatRow label="Fraud Probability" value="3.2%" />
                </div>
            </div>
          </div>

          {/* Right: Visualization & Insights */}
          <div className="lg:col-span-8 space-y-8">
            <div className="p-8 rounded-[3rem] bg-slate-900/20 border border-white/5 min-h-[500px] flex flex-col relative overflow-hidden">
               <div className="flex items-center justify-between mb-8 relative z-20">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                     <h2 className="text-xl font-black text-white tracking-tighter uppercase">Identity Link Workspace</h2>
                  </div>
                  <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                     <Maximize2 className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="flex-1 relative z-10 flex items-center justify-center">
                  <IdentityGraphVisualization data={graphData} />
               </div>

               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <Network className="w-[500px] h-[500px] text-white" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                     <Terminal className="w-4 h-4" /> Analysis Feed
                  </h3>
                  <IdentityNetworkInsights data={graphData} />
               </div>
               
               <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                     <Layers className="w-4 h-4" /> Identity Core
                  </h3>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-0.5">Primary ID</div>
                           <div className="text-sm font-black text-white">{searchId}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                           <Fingerprint className="w-5 h-5 text-teal-400" />
                        </div>
                     </div>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        The Identity Graph Engine correlations are derived from multi-dimensional telemetry data. 
                        A high Network Risk Score indicates repeated usage of identity markers across disjointed sessions.
                     </p>
                     <div className="pt-4">
                         <div className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Neural Recommendation</div>
                         <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] font-bold text-indigo-100 leading-relaxed">
                            {graphData.riskScore > 50 ? "Flagged for manual compliance escalation. Potential synthetic fraud cluster detected." : "No critical action required. Monitoring relationship status."}
                         </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ControlToggle = ({ label, active }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-xs font-bold text-slate-400">{label}</span>
    <div className={`w-10 h-5 rounded-full relative transition-all ${active ? "bg-teal-500/40 border border-teal-500/50" : "bg-slate-800 border border-slate-700"}`}>
       <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${active ? "right-1 bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" : "left-1 bg-slate-600"}`} />
    </div>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
    <span className="text-sm font-black text-white tracking-widest">{value}</span>
  </div>
);
