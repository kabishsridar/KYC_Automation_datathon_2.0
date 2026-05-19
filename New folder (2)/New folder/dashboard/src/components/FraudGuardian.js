"use client";
import React, { useMemo } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone, 
  MapPin, 
  Network, 
  Activity,
  AlertTriangle,
  Fingerprint
} from "lucide-react";

/**
 * DevFlow AI Fraud Guardian
 * Monitors transactions in real-time and detects suspicious patterns.
 */

export const useFraudGuardian = (transactionData) => {
  return useMemo(() => {
    if (!transactionData) return null;

    const { amount, receiverId, type } = transactionData;
    
    // Simulation Logic
    const isNewDevice = Math.random() > 0.8;
    const isUnusualLocation = Math.random() > 0.85;
    const isAbnormalAmount = amount > 10000;
    const connectedToSuspicious = Math.random() > 0.9;

    let score = 5; // Base risk
    const signals = [];

    if (isNewDevice) {
      score += 25;
      signals.push({ type: "Device", label: "New Device Fingerprint", risk: "MEDIUM" });
    }
    if (isUnusualLocation) {
      score += 20;
      signals.push({ type: "Location", label: "Unusual Geo-Location", risk: "LOW" });
    }
    if (isAbnormalAmount) {
      score += 30;
      signals.push({ type: "Behavior", label: "Abnormal Transaction Volume", risk: "HIGH" });
    }
    if (connectedToSuspicious) {
      score += 40;
      signals.push({ type: "Identity", label: "Identity Network Conflict", risk: "CRITICAL" });
    }

    score = Math.min(100, score);
    
    const status = score > 70 ? "BLOCKED" : score > 30 ? "OTP_REQUIRED" : "APPROVED";

    return {
      score,
      signals,
      status,
      timestamp: new Date().toISOString(),
      transactionId: "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
  }, [transactionData]);
};

export const FraudRiskReport = ({ report }) => {
  if (!report) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`p-6 rounded-[2rem] border ${
        report.status === "APPROVED" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
        report.status === "BLOCKED" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
        "bg-amber-500/10 border-amber-500/20 text-amber-400"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              report.status === "APPROVED" ? "bg-emerald-500/20" :
              report.status === "BLOCKED" ? "bg-rose-500/20" :
              "bg-amber-500/20"
            }`}>
              {report.status === "APPROVED" ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Guardian Decision</div>
              <div className="text-xl font-black">{report.status.replace("_", " ")}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Risk Score</div>
            <div className="text-3xl font-black tabular-nums">{report.score}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.signals.map((signal, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
             <div className="p-2 rounded-lg bg-slate-800">
                {signal.type === "Device" && <Smartphone className="w-4 h-4 text-sky-400" />}
                {signal.type === "Location" && <MapPin className="w-4 h-4 text-orange-400" />}
                {signal.type === "Behavior" && <Activity className="w-4 h-4 text-purple-400" />}
                {signal.type === "Identity" && <Network className="w-4 h-4 text-rose-400" />}
             </div>
             <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{signal.label}</div>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${
                     signal.risk === "CRITICAL" ? "bg-rose-500" : signal.risk === "HIGH" ? "bg-orange-500" : "bg-amber-500"
                   }`} />
                   <span className="text-[9px] font-black uppercase tracking-widest text-white">{signal.risk} Risk Signal</span>
                </div>
             </div>
          </div>
        ))}
        {report.signals.length === 0 && (
          <div className="col-span-2 py-8 flex flex-col items-center justify-center border border-white/5 bg-white/5 rounded-3xl">
             <ShieldCheck className="w-12 h-12 text-emerald-500/20 mb-3" />
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 font-black">No Suspicious Markers Detected</div>
             <div className="text-[9px] font-bold text-slate-700 uppercase mt-1">Transaction Clean Pattern verified</div>
          </div>
        )}
      </div>

      <div className="p-5 rounded-3xl bg-slate-950 border border-white/5 flex items-center gap-4">
         <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-indigo-400" />
         </div>
         <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Neural Audit Trail</div>
            <div className="text-[11px] font-bold text-slate-300">Transaction ID: {report.transactionId}</div>
         </div>
         <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase text-slate-500">Real-Time Core Active</span>
         </div>
      </div>
    </div>
  );
};
