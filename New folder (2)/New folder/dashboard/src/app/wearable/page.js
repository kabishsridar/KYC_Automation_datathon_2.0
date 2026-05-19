"use client";
import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  ScanSearch,
  Fingerprint,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Cpu,
  Terminal,
  Zap,
  Network
} from "lucide-react";
import Link from "next/link";
import { useDocumentIntelligence, DocumentIntelligenceReport } from "../../components/DocumentIntelligenceEngine";
import { useIdentityGraph, IdentityNetworkInsights } from "../../components/IdentityGraphEngine";

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function computeRiskScore({ fraudProb, docAuth, idMatch }) {
  const fraud = clamp01(fraudProb) * 55;
  const doc = (1 - clamp01(docAuth)) * 30;
  const face = (1 - clamp01(idMatch)) * 25;
  return Math.max(0, Math.min(100, Math.round(fraud + doc + face)));
}

function category(score) {
  if (score <= 30) return { label: "Low Risk", tone: "ok" };
  if (score <= 70) return { label: "Medium Risk", tone: "warn" };
  return { label: "High Risk", tone: "danger" };
}

export default function AiRiskLab() {
  const [customerId, setCustomerId] = useState("CUST-001");
  const [docAuthenticity, setDocAuthenticity] = useState("0.94");
  const [identityMatch, setIdentityMatch] = useState("0.91");
  const [fraudProbability, setFraudProbability] = useState("0.08");
  
  const { analyze, isAnalyzing, analysisProgress, result } = useDocumentIntelligence();
  const graphData = useIdentityGraph(customerId);

  const handleGenerate = () => {
    const dummyFile = { name: customerId + "_id.jpg" };
    analyze([dummyFile], "Laboratory Simulation");
  };

  const outputs = useMemo(() => {
    const docAuth = clamp01(parseFloat(docAuthenticity));
    const idMatch = clamp01(parseFloat(identityMatch));
    const fraudProb = clamp01(parseFloat(fraudProbability));
    const score = computeRiskScore({ fraudProb, docAuth, idMatch });
    const cat = category(score);
    return { docAuth, idMatch, fraudProb, score, cat };
  }, [docAuthenticity, identityMatch, fraudProbability]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-slate-400 hover:text-white mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
          <ArrowLeft className="w-4 h-4" /> Home Dashboard
        </Link>

        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="bg-[#0A1120] border-b border-white/5 p-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-5">
              <Cpu className="w-56 h-56" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-white">AI Risk Lab</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Advanced Verification Scenario Simulator</p>
              </div>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> Input Parameters
                </div>

                <div className="space-y-4">
                  <Input label="Customer Pointer" icon={<Fingerprint className="w-4 h-4" />} value={customerId} onChange={setCustomerId} />
                  <Input label="Base Fraud Signal (0-1)" icon={<ScanSearch className="w-4 h-4" />} value={fraudProbability} onChange={setFraudProbability} />
                  <Input label="Doc Confidece (0-1)" icon={<FileCheck2 className="w-4 h-4" />} value={docAuthenticity} onChange={setDocAuthenticity} />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isAnalyzing}
                  className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? <><Zap className="w-4 h-4 animate-pulse" /> Running Simulation...</> : <><Cpu className="w-4 h-4" /> Execute Intelligence Scan</>}
                </button>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Laboratory Modules</div>
                <div className="space-y-2">
                  <ModuleLink title="Document Engine" desc="v4.0 Core Infrastructure" href="/ai-tools/reports" />
                  <ModuleLink title="Kiosk Interface" desc="Neural-First Onboarding" href="/kyc-verification-kiosk" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              {!result && !isAnalyzing ? (
                <div className="h-full bg-slate-950/30 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center p-12 opacity-50">
                   <div className="w-20 h-20 bg-slate-900 rounded-full border border-white/5 flex items-center justify-center mb-6">
                      <ScanSearch className="w-8 h-8 text-slate-700" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Laboratory Idle</h3>
                   <p className="text-xs text-slate-600 font-bold mt-2">Modify input parameters and execute the scan to generate results.</p>
                </div>
              ) : isAnalyzing ? (
                <div className="h-full bg-slate-900/20 border border-white/5 rounded-[2rem] p-12 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 relative mb-12">
                     <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full" />
                     <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                     <Zap className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="w-full max-w-sm space-y-4">
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${analysisProgress}%` }} />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400 text-center">Neural Correlator: {Math.round(analysisProgress)}%</div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                   <DocumentIntelligenceReport result={result} />
                   
                   <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <Network className="w-5 h-5" />
                         </div>
                         <h3 className="text-lg font-black text-white tracking-tight">Identity Network Mapping</h3>
                      </div>
                      <IdentityNetworkInsights data={graphData} />
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleLink({ title, desc, href }) {
  return (
    <Link href={href} className="block p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
      <div className="text-[10px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-widest">{title}</div>
      <div className="text-[9px] text-slate-500 font-bold mt-1">{desc}</div>
    </Link>
  );
}

function Input({ label, icon, value, onChange, placeholder }) {
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 focus-within:border-indigo-500/40 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
        <div className="text-slate-600">{icon}</div>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-slate-800"
      />
    </div>
  );
}

