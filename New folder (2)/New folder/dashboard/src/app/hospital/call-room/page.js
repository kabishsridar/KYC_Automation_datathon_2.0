"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Video, VideoOff, MonitorUp, Share2, Users, Settings, Activity, ShieldAlert, FileText, PhoneOff, CheckCircle2 } from "lucide-react";

export default function SecureCaseRoom() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTimer((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const events = useMemo(
    () => [
      { at: "00:42", type: "system", text: "Secure room created for manual review." },
      { at: "01:05", type: "ai", text: "High-risk routing: document authenticity below threshold." },
      { at: "01:18", type: "officer", text: "Requested enhanced document validation and watchlist screening." },
      { at: "01:34", type: "system", text: "Audit trail checkpoint recorded." },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col relative overflow-hidden">
      <header className="h-16 shrink-0 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-6 relative z-10">
        <div className="flex items-center gap-4">
          <Link href="/compliance-command-center" className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Secure Manual Review Room
            </h1>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Case: KYC-10293 • High-Risk Alert
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-mono font-bold">{formatTime(timer)}</span>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex p-2 gap-2 h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 shadow-xl flex items-start gap-4">
            <div className="bg-rose-600/20 border border-rose-600/30 p-2 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-[9px] uppercase font-black text-slate-400">Risk Summary</div>
              <div className="text-sm font-black text-white">Fraud probability elevated • Manual review required</div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">Recommended actions: verify document integrity, rerun sanctions screening, request additional docs.</div>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-800/50 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <Video className="w-32 h-32 text-slate-700" />
            </div>
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 border-2 border-slate-900 flex items-center justify-center overflow-hidden">
                <span className="font-black text-sm text-white">CO</span>
              </div>
              <div>
                <div className="text-sm font-black text-white drop-shadow-md">Compliance Officer</div>
                <div className="text-[10px] font-bold text-teal-200 uppercase tracking-widest bg-slate-950/70 px-1.5 py-0.5 rounded backdrop-blur w-fit">
                  Manual Review
                </div>
              </div>
              <div className="bg-emerald-500/20 text-emerald-300 p-1.5 rounded-full backdrop-blur-md ml-2 border border-emerald-500/20">
                <Mic className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="h-24 bg-slate-950 shrink-0 border-t border-slate-800 flex justify-center items-center gap-4 px-6 z-20">
            <button
              onClick={() => setMicOn((v) => !v)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                micOn ? "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white" : "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400"
              }`}
            >
              {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setCamOn((v) => !v)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                camOn ? "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white" : "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400"
              }`}
            >
              {camOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-white transition-all shadow-lg hover:text-sky-400 hover:border-sky-500/50">
              <MonitorUp className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-white transition-all shadow-lg">
              <Share2 className="w-6 h-6" />
            </button>
            <Link href="/compliance-command-center" className="w-16 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(225,29,72,0.35)] ml-8">
              <PhoneOff className="w-6 h-6" />
            </Link>
          </div>
        </div>

        <div className="w-[320px] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-300" /> Participants (3)
            </h3>
          </div>

          <div className="p-2 space-y-2 max-h-[45%] overflow-y-auto custom-scrollbar border-b border-slate-800">
            <Participant name="Compliance Officer A" role="Reviewer" />
            <Participant name="Compliance Officer B" role="Approver" muted />
            <Participant name="Risk Analyst" role="Support" />
          </div>

          <div className="flex-1 flex flex-col bg-slate-950">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="text-[10px] uppercase font-black tracking-widest text-teal-300 flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Live Event Log
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar text-xs">
              {events.map((e, i) => (
                <div key={i} className={`p-2 rounded border ${
                  e.type === "ai" ? "bg-rose-950/20 border-rose-900/30" : "bg-slate-900/50 border-slate-800"
                }`}>
                  <span className={`text-[9px] font-bold uppercase block mb-0.5 ${
                    e.type === "ai" ? "text-rose-400" : "text-slate-500"
                  }`}>
                    {e.at} • {e.type === "ai" ? "AI" : e.type === "system" ? "System" : "Officer"}
                  </span>
                  <span className="text-slate-300">{e.text}</span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-800">
              <button className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 py-2 rounded-lg text-[10px] font-bold text-slate-300 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                <FileText className="w-3 h-3" /> Export Audit Notes
              </button>
              <button className="w-full mt-2 bg-teal-600 hover:bg-teal-500 py-2 rounded-lg text-[10px] font-black text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> Mark Review Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Participant({ name, role, muted = false }) {
  return (
    <div className="h-20 bg-slate-800 rounded-xl relative overflow-hidden border border-slate-700 flex items-center justify-between px-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-white">
          {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div className="text-xs font-black text-white">{name}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</div>
        </div>
      </div>
      <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
        muted ? "bg-rose-500/10 border-rose-500/20 text-rose-300" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
      }`}>
        {muted ? "Muted" : "Live"}
      </div>
    </div>
  );
}
