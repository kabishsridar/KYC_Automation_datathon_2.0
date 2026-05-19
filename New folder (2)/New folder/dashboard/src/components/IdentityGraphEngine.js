"use client";
import React, { useMemo } from "react";
import { 
  Network, 
  Phone, 
  Mail, 
  Smartphone, 
  Globe, 
  Home, 
  ShieldAlert, 
  Fingerprint,
  Link as LinkIcon,
  Circle,
  Zap
} from "lucide-react";

/**
 * DevFlow AI Identity Graph Engine
 * Detects cross-identity relationships and fraud networks.
 */

export const useIdentityGraph = (identityId) => {
  return useMemo(() => {
    if (!identityId) return null;

    // Deterministic simulation based on ID
    const seed = identityId.length;
    const rand = (n) => (Math.sin(seed * 1.5 + n * 72.3) * 10000) % 1;
    
    const accountsCount = Math.floor(Math.abs(rand(1) * 6)) + 1;
    const riskScore = Math.floor(Math.abs(rand(2) * 85));
    
    const connections = [
      { type: "Phone", detected: rand(3) > 0.4, value: "+91 98XXX XXX" + (Math.floor(Math.abs(rand(3) * 99))) },
      { type: "Email", detected: rand(4) > 0.6, value: "u***" + (Math.floor(Math.abs(rand(4) * 99))) + "@gmail.com" },
      { type: "Device", detected: rand(5) > 0.5, value: "iPhone_" + (Math.floor(Math.abs(rand(5) * 15))) + "_Pro" },
      { type: "IP Address", detected: rand(6) > 0.7, value: "192.168." + (Math.floor(Math.abs(rand(6) * 255))) + ".1" },
      { type: "Address", detected: rand(7) > 0.8, value: "Cluster_X" + (Math.floor(Math.abs(rand(7) * 99))) },
    ];

    const activeConnections = connections.filter(c => c.detected);

    return {
      id: identityId,
      accountsCount,
      riskScore,
      activeConnections,
      status: riskScore > 60 ? "CRITICAL_NETWORK" : riskScore > 30 ? "SUSPICIOUS_LINKS" : "CLEAN_IDENTITY"
    };
  }, [identityId]);
};

export const IdentityGraphVisualization = ({ data }) => {
  if (!data) return null;

  return (
    <div className="relative w-full h-80 bg-slate-950 rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center p-8 backdrop-blur-3xl shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Central Node */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-teal-500 flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.5)] border border-teal-300 animate-pulse">
          <Fingerprint className="w-8 h-8 text-black" />
        </div>
        <div className="mt-4 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-black uppercase text-teal-400">
          Root Identity
        </div>
      </div>

      {/* Connection Nodes */}
      {data.activeConnections.map((conn, idx) => {
        const total = data.activeConnections.length;
        const radius = 120;
        const angle = (idx / total) * (2 * Math.PI);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <React.Fragment key={idx}>
            {/* Connection Line */}
            <div 
              className="absolute h-0.5 bg-gradient-to-r from-teal-500/40 to-transparent origin-left transition-all duration-1000"
              style={{
                width: radius,
                left: '50%',
                top: '50%',
                transform: `rotate(${angle}rad)`
              }}
            />
            
            {/* Node */}
            <div 
              className="absolute flex flex-col items-center animate-in zoom-in duration-700"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                left: 'calc(50% - 20px)',
                top: 'calc(50% - 20px)',
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-teal-500/20 flex items-center justify-center text-teal-300 shadow-xl group hover:border-teal-500 transition-all cursor-crosshair">
                <ConnectionIcon type={conn.type} />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 hidden group-hover:block whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[10px] font-bold text-white shadow-2xl z-50">
                  {conn.type}: {conn.value}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Empty State / Legend */}
      <div className="absolute bottom-6 left-8 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Links: {data.activeConnections.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Network: {data.accountsCount} Users</span>
        </div>
      </div>
    </div>
  );
};

const ConnectionIcon = ({ type }) => {
  switch (type) {
    case "Phone": return <Phone className="w-5 h-5" />;
    case "Email": return <Mail className="w-5 h-5" />;
    case "Device": return <Smartphone className="w-5 h-5" />;
    case "IP Address": return <Globe className="w-5 h-5" />;
    case "Address": return <Home className="w-5 h-5" />;
    default: return <LinkIcon className="w-5 h-5" />;
  }
};

export const IdentityNetworkInsights = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Connected Accounts</div>
          <div className="text-2xl font-black text-white">{data.accountsCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Network Risk</div>
          <div className={`text-2xl font-black ${data.riskScore > 60 ? "text-rose-400" : data.riskScore > 30 ? "text-amber-400" : "text-emerald-400"}`}>
            {data.riskScore}%
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-950 border border-white/5 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-teal-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Detection Logic Results
        </h3>
        <div className="space-y-3">
          {data.activeConnections.map((conn, idx) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <ConnectionIcon type={conn.type} />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-white">{conn.type} Reuse Detected</div>
                   <div className="text-[9px] font-bold text-slate-500 uppercase">{conn.value}</div>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[8px] font-black uppercase">
                CONFLICT
              </div>
            </div>
          ))}
          {data.activeConnections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
               <Zap className="w-8 h-8 text-teal-500/20 mb-3" />
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">No cross-identity links detected</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
