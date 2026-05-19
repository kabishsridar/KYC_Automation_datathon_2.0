"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Network
} from "lucide-react";

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function computeRiskScore({ fraudProb, docAuth, idMatch }) {
  const fraud = clamp01(fraudProb) * 55;
  const doc = (1 - clamp01(docAuth)) * 30;
  const face = (1 - clamp01(idMatch)) * 25;
  return Math.max(0, Math.min(100, Math.round(fraud + doc + face)));
}

function riskTone(score) {
  if (score <= 30) return "ok";
  if (score <= 70) return "warn";
  return "danger";
}

const seedCases = [
  { id: "KYC-10291", customer: "Rahul Sharma", docType: "Aadhaar", stage: "Active Verification", fraudProb: 0.18, docAuth: 0.92, idMatch: 0.91, kiosk: "Munnar #12" },
  { id: "KYC-10292", customer: "Sarah Williams", docType: "PAN", stage: "Approved", fraudProb: 0.09, docAuth: 0.96, idMatch: 0.94, kiosk: "Mobile" },
  { id: "KYC-10293", customer: "Amit Patel", docType: "Passport", stage: "Manual Review", fraudProb: 0.42, docAuth: 0.79, idMatch: 0.76, kiosk: "Idukki #08" },
  { id: "KYC-10294", customer: "Meena Kumari", docType: "Driving License", stage: "Pending Manual Review", fraudProb: 0.23, docAuth: 0.88, idMatch: 0.86, kiosk: "Branch Desk" },
  { id: "KYC-10295", customer: "Michael Wilson", docType: "Aadhaar", stage: "Approved", fraudProb: 0.12, docAuth: 0.94, idMatch: 0.92, kiosk: "Wayanad #05" },
  { id: "KYC-10296", customer: "Linda Martinez", docType: "Passport", stage: "High Risk Alert", fraudProb: 0.55, docAuth: 0.74, idMatch: 0.71, kiosk: "Remote" },
];

export default function ComplianceCommandCenter() {
  const [query, setQuery] = useState("");

  const cases = useMemo(
    () =>
      seedCases.map((c) => ({
        ...c,
        riskScore: computeRiskScore({ fraudProb: c.fraudProb, docAuth: c.docAuth, idMatch: c.idMatch }),
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) => (c.id + c.customer + c.docType + c.stage + c.kiosk).toLowerCase().includes(q));
  }, [cases, query]);

  const metrics = useMemo(() => {
    const total = 1832;
    const approved = 1198;
    const pendingManual = cases.filter((c) => c.stage.toLowerCase().includes("manual")).length;
    const highRisk = cases.filter((c) => c.stage.toLowerCase().includes("high risk") || c.riskScore > 70).length;
    return { total, approved, pendingManual, highRisk };
  }, [cases]);

  const aiPanel = useMemo(() => {
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
    const fraud = avg(cases.map((c) => c.fraudProb));
    const doc = avg(cases.map((c) => c.docAuth));
    const face = avg(cases.map((c) => c.idMatch));
    return {
      fraudProb: Math.round(fraud * 1000) / 10,
      docAuth: Math.round(doc * 1000) / 10,
      faceMatch: Math.round(face * 1000) / 10,
    };
  }, [cases]);

  const activeVerifications = filtered.filter((c) => c.stage === "Active Verification");
  const manualQueue = filtered.filter((c) => c.stage.includes("Manual"));
  const approvedList = filtered.filter((c) => c.stage === "Approved");
  const highRiskAlerts = filtered.filter((c) => c.stage.includes("High Risk") || c.riskScore > 70);

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col text-slate-200">
      <nav className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex justify-between items-center shadow-2xl relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              COMPLIANCE COMMAND CENTER
            </h1>
            <div className="text-xs text-slate-400 font-bold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              SYSTEM ACTIVE • IDENTITY VERIFICATION MONITORING
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col bg-slate-900 border border-slate-700 px-5 py-1.5 rounded-xl shadow-inner max-w-sm">
          <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3" /> AI Throughput Forecast (Next 2 Hours)
          </div>
          <div className="flex justify-between items-end gap-6 text-xs font-bold font-mono">
            <div><span className="text-slate-500">Predicted Reviews:</span> <span className="text-amber-300">+18</span></div>
            <div><span className="text-slate-500">Alert Risk:</span> <span className="text-rose-300">Medium</span></div>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-slate-800 mt-1 pt-1">
            Action: <span className="text-white">Allocate 2 additional officers</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider px-3 py-1.5">
            Exit Center
          </Link>
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-400">
            CM
          </div>
        </div>
      </nav>

      {/* Metrics */}
      <div className="bg-slate-900 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
          <MetricCard title="Total KYC Requests" value={metrics.total.toLocaleString()} tone="teal" />
          <MetricCard title="Approved Customers" value={metrics.approved.toLocaleString()} tone="emerald" />
          <MetricCard title="High Risk Cases" value={metrics.highRisk.toLocaleString()} tone="rose" />
          <MetricCard title="Pending Manual Review" value={metrics.pendingManual.toLocaleString()} tone="amber" />
        </div>
      </div>

      {/* AI risk analytics */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 text-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          <MiniPanel title="Fraud Probability" value={`${aiPanel.fraudProb}%`} desc="Aggregate anomaly risk signal" tone="rose" />
          <MiniPanel title="Document Authenticity Confidence" value={`${aiPanel.docAuth}%`} desc="OCR + integrity confidence average" tone="emerald" />
          <MiniPanel title="Face Match Accuracy" value={`${aiPanel.faceMatch}%`} desc="Selfie-to-ID match confidence average" tone="teal" />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden flex flex-col xl:flex-row p-4 gap-4 h-[calc(100vh-80px)]">
        <div className="w-full xl:w-1/3 flex flex-col gap-4 overflow-hidden h-full">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                <Users className="w-4 h-4 text-teal-400" /> Pipeline Overview
              </h2>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                <Search className="w-3 h-3 text-indigo-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search cases..."
                  className="bg-transparent border-none outline-none text-[9px] text-slate-300 w-28 placeholder:text-slate-600 font-bold"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 custom-scrollbar">
              {filtered.map((c) => (
                <div key={c.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/30 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black text-white">{c.customer}</div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border ${pillCls(riskTone(c.riskScore))}`}>
                      {c.riskScore}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">{c.id} • {c.docType}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold">{c.stage}</span>
                    <span className="text-[10px] text-slate-500 font-bold">Source: {c.kiosk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> High Risk Alerts
              </h2>
              <Link href="/hospital/call-room" className="text-[10px] font-black uppercase tracking-widest text-teal-300 hover:text-white inline-flex items-center gap-1">
                Open Review Room <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-3 space-y-2">
              {highRiskAlerts.length === 0 ? (
                <div className="text-slate-500 text-sm font-medium p-3">No active high-risk alerts.</div>
              ) : (
                highRiskAlerts.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-black text-white">{c.customer}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-rose-200">{c.id}</div>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium mt-1">
                      Risk {c.riskScore} • Fraud {Math.round(c.fraudProb * 100)}% • Doc {Math.round(c.docAuth * 100)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
          <Panel title="Active Verifications" icon={<Activity className="w-4 h-4 text-teal-300" />}>
            <Table rows={activeVerifications} empty="No active verifications." />
          </Panel>
          <Panel title="Manual Review Queue" icon={<UserCheck className="w-4 h-4 text-amber-300" />}>
            <Table rows={manualQueue} empty="No cases in manual review." />
          </Panel>
          <Panel title="Approved Customers" icon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />}>
            <Table rows={approvedList} empty="No approvals yet." />
          </Panel>
        </div>

        <div className="w-full xl:w-[340px] flex flex-col gap-4 overflow-hidden h-full">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-indigo-300" /> Quick Links
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <QuickLink href="/compliance-officer-portal" title="Compliance Officer Portal" desc="Review cases and take verification decisions." />

              <QuickLink href="/voice-banking" title="Voice Banking Kiosk" desc="Universal access banking with AI Fraud Guardian." />

              <QuickLink href="/wearable" title="AI Risk Lab" desc="Inspect model signals and scoring." />

              <QuickLink href="/ai-identity-graph" title="Identity Graph Engine" desc="Map relationships and detect fraud networks." />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex-1">
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-teal-300" /> Intelligence Insights
              </h2>
            </div>
            <div className="p-4 space-y-3 text-sm text-slate-300 font-medium">
              <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800">
                Neural Engine v4.0 active. Identifying pixel-level tampering and document forgeries in real-time.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800">
                AI Fraud Guardian deployed. Real-time transaction monitoring active across rural kiosk network.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800">
                Recent Alert: Unusual transaction volume detected in Kiosk #08. Multi-factor authentication enforced.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, tone }) {
  const color =
    tone === "rose"
      ? "text-rose-300"
      : tone === "amber"
      ? "text-amber-300"
      : tone === "emerald"
      ? "text-emerald-300"
      : "text-teal-300";
  return (
    <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{title}</div>
      <div className={`text-2xl font-black mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function MiniPanel({ title, value, desc, tone }) {
  const color = tone === "rose" ? "text-rose-400" : tone === "emerald" ? "text-emerald-300" : "text-teal-300";
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-400">{title}</div>
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-400">{desc}</div>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
        <h2 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
          {icon} {title}
        </h2>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Table({ rows, empty }) {
  if (!rows || rows.length === 0) {
    return <div className="text-slate-500 text-sm font-medium p-3">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-950/40 text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <tr>
            <th className="px-4 py-3">Case</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Document</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-slate-950/30 transition-colors group">
              <td className="px-4 py-3 text-xs font-black text-white">{c.id}</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-200">{c.customer}</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-300">{c.docType}</td>
              <td className="px-4 py-3 text-xs font-black">
                <span className={`px-2 py-1 rounded border ${pillCls(riskTone(c.riskScore))}`}>{c.riskScore}</span>
              </td>
              <td className="px-4 py-3 text-xs font-bold text-slate-400">{c.stage}</td>
              <td className="px-4 py-3 text-right">
                <Link href="/compliance-officer-portal" className="text-teal-300 font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuickLink({ href, title, desc }) {
  return (
    <Link href={href} className="block p-4 rounded-xl bg-slate-950/30 border border-slate-800 hover:border-slate-700 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="text-sm font-black text-white">{title}</div>
        <ChevronRight className="w-4 h-4 text-teal-300 group-hover:translate-x-0.5 transition-transform" />
      </div>
      <div className="text-[11px] text-slate-400 font-medium mt-1">{desc}</div>
    </Link>
  );
}

function pillCls(tone) {
  if (tone === "danger") return "bg-rose-500/10 border-rose-500/20 text-rose-200";
  if (tone === "warn") return "bg-amber-500/10 border-amber-500/20 text-amber-200";
  return "bg-emerald-500/10 border-emerald-500/20 text-emerald-200";
}

