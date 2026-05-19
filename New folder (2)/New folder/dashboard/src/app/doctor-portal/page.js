"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  FileText,
  Fingerprint,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  AlertTriangle,
  Cpu,
  Terminal,
  Zap,
  Network
} from "lucide-react";
import { useDocumentIntelligence, DocumentIntelligenceReport } from "../../components/DocumentIntelligenceEngine";
import { useIdentityGraph, IdentityGraphVisualization, IdentityNetworkInsights } from "../../components/IdentityGraphEngine";

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

function statusTone(status) {
  if (status === "Approved") return "ok";
  if (status === "Rejected") return "danger";
  if (status === "Additional Docs Requested") return "warn";
  if (status === "Manual Review") return "danger";
  return "warn"; // Pending Verification
}

const initialCases = [
  {
    id: "KYC-10291",
    customer: { name: "Rahul Sharma", phone: "+91 98XXX 12XXX", email: "rahul.sharma@example.com" },
    docType: "Aadhaar",
    status: "Pending Verification",
    submittedVia: "KYC Verification Kiosk • Munnar #12",
    signals: { fraudProb: 0.18, docAuth: 0.92, idMatch: 0.91, faceMatch: 0.93 },
    doc: { fileName: "aadhaar_front.jpg", extractedName: "Rahul Sharma", dob: "1989-07-21", docIdMasked: "XXXX-XXXX-1234", expiryValid: true },
    notes: [
      { at: "10:21", by: "System", text: "KYC request created from kiosk workflow." },
      { at: "10:23", by: "AI", text: "OCR extraction complete. Authenticity confidence high." },
    ],
  },
  {
    id: "KYC-10292",
    customer: { name: "Sarah Williams", phone: "+91 97XXX 44XXX", email: "sarah.williams@example.com" },
    docType: "PAN Card",
    status: "Pending Verification",
    submittedVia: "Mobile Onboarding • App",
    signals: { fraudProb: 0.09, docAuth: 0.96, idMatch: 0.94, faceMatch: 0.95 },
    doc: { fileName: "pan_card.png", extractedName: "Sarah Williams", dob: "1996-02-11", docIdMasked: "ABCDE1234F", expiryValid: true },
    notes: [
      { at: "09:55", by: "System", text: "KYC request created from mobile onboarding." },
      { at: "09:56", by: "AI", text: "Face match confidence strong. Low fraud signal." },
    ],
  },
  {
    id: "KYC-10293",
    customer: { name: "Amit Patel", phone: "+91 91XXX 77XXX", email: "amit.patel@example.com" },
    docType: "Passport",
    status: "Manual Review",
    submittedVia: "KYC Verification Kiosk • Idukki #08",
    signals: { fraudProb: 0.42, docAuth: 0.79, idMatch: 0.76, faceMatch: 0.78 },
    doc: { fileName: "passport_scan.pdf", extractedName: "Amit Patel", dob: "1977-10-08", docIdMasked: "P<INDXXXXXXX", expiryValid: true },
    notes: [
      { at: "10:02", by: "AI", text: "Potential tampering artifacts detected. Escalating to manual review." },
      { at: "10:04", by: "System", text: "High-risk routing applied based on model thresholds." },
    ],
  },
  {
    id: "KYC-10294",
    customer: { name: "Meena Kumari", phone: "+91 90XXX 55XXX", email: "meena.kumari@example.com" },
    docType: "Driving License",
    status: "Additional Docs Requested",
    submittedVia: "Branch Assisted • Desk",
    signals: { fraudProb: 0.23, docAuth: 0.88, idMatch: 0.86, faceMatch: 0.84 },
    doc: { fileName: "dl_photo.jpg", extractedName: "Meena Kumari", dob: "1984-05-03", docIdMasked: "DL-XX-XXXX", expiryValid: false },
    notes: [
      { at: "08:40", by: "Officer", text: "Expiry validation failed. Request updated document or alternate ID." },
    ],
  },
];

export default function ComplianceOfficerPortal() {
  const [cases, setCases] = useState(() =>
    initialCases.map((c) => ({
      ...c,
      riskScore: computeRiskScore({ fraudProb: c.signals.fraudProb, docAuth: c.signals.docAuth, idMatch: c.signals.idMatch }),
    }))
  );
  const [selectedId, setSelectedId] = useState(initialCases[0].id);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("customer"); // customer | documents | ai
  const { analyze, isAnalyzing, result: aiResult } = useDocumentIntelligence();
  const graphData = useIdentityGraph(selectedId);

  useEffect(() => {
    // Simulate re-running analysis when a case is selected
    const dummyFile = { name: selectedId + ".jpg" };
    analyze([dummyFile], "Identity Document");
  }, [selectedId]);

  const selected = useMemo(() => cases.find((c) => c.id === selectedId) || cases[0], [cases, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) => (c.customer.name + c.id + c.docType + c.status).toLowerCase().includes(q));
  }, [cases, query]);

  const act = (id, action) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const now = new Date();
        const at = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (action === "approve") {
          return { ...c, status: "Approved", notes: [{ at, by: "Officer", text: "Verification approved." }, ...c.notes] };
        }
        if (action === "reject") {
          return { ...c, status: "Rejected", notes: [{ at, by: "Officer", text: "Verification rejected due to risk indicators." }, ...c.notes] };
        }
        return { ...c, status: "Additional Docs Requested", notes: [{ at, by: "Officer", text: "Additional documents requested from customer." }, ...c.notes] };
      })
    );
  };

  const overall = useMemo(() => {
    const total = cases.length;
    const approved = cases.filter((c) => c.status === "Approved").length;
    const pending = cases.filter((c) => c.status === "Pending Verification").length;
    const highRisk = cases.filter((c) => category(c.riskScore).tone === "danger").length;
    return { total, approved, pending, highRisk };
  }, [cases]);

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] text-[#1A1F2B] font-sans overflow-hidden">
      <header className="h-14 bg-[#0A192F] border-b border-[#1E2D3D] flex items-center justify-between px-4 shrink-0 shadow-lg z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-9 h-9 rounded-xl bg-[#112240] border border-[#233554] flex items-center justify-center hover:bg-[#0f2a52] transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-200" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              DevFlow <span className="text-teal-400">Compliance Officer Portal</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
            <span className="px-2 py-1 rounded border border-[#233554] bg-[#112240]">Total: {overall.total}</span>
            <span className="px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Approved: {overall.approved}</span>
            <span className="px-2 py-1 rounded border border-amber-500/20 bg-amber-500/10 text-amber-200">Pending: {overall.pending}</span>
            <span className="px-2 py-1 rounded border border-rose-500/20 bg-rose-500/10 text-rose-200">High Risk: {overall.highRisk}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/compliance-command-center" className="text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider px-3 py-2 rounded-lg border border-[#233554] bg-[#112240]">
            Compliance Command Center
          </Link>
          <div className="h-9 w-9 bg-teal-600 rounded-full flex items-center justify-center font-black text-white border border-teal-400/30">
            CO
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* LEFT: VERIFICATION QUEUE */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" /> Customer Verification Queue
              </h2>
              <div className="bg-slate-100 text-[10px] font-black px-2 py-0.5 rounded text-slate-600">Active: {filtered.length}</div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ID, name, doc type…"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {filtered.map((c) => {
              const cat = category(c.riskScore);
              const selectedCls = c.id === selectedId ? "bg-slate-100/60 border-teal-500" : "bg-white border-transparent";
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3 border-b border-slate-50 border-l-4 cursor-pointer transition-all hover:bg-slate-50 ${selectedCls}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{c.customer.name}</div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {c.docType} • {c.id}
                      </div>
                    </div>
                    <StatusPill tone={statusTone(c.status)} text={c.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">KYC Risk Score</div>
                    <div className={`text-sm font-black tabular-nums ${cat.tone === "danger" ? "text-rose-600" : cat.tone === "warn" ? "text-amber-600" : "text-emerald-600"}`}>
                      {c.riskScore}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 font-bold">Source: {c.submittedVia}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: CASE DETAIL */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">Selected Case</div>
              <div className="text-xl font-black text-slate-900">{selected.customer.name}</div>
              <div className="text-[11px] text-slate-500 font-bold mt-0.5">{selected.id} • {selected.docType}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => act(selected.id, "approve")} className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-colors">
                Approve Verification
              </button>
              <button onClick={() => act(selected.id, "reject")} className="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest transition-colors">
                Reject Verification
              </button>
              <button onClick={() => act(selected.id, "request-docs")} className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest transition-colors">
                Request Additional Documents
              </button>
            </div>
          </div>

          <div className="px-4 pt-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-[#F8FAFC] border-b border-slate-200 px-4 flex">
                <TabButton active={activeTab === "customer"} onClick={() => setActiveTab("customer")}>Customer Information</TabButton>
                <TabButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")}>Uploaded Documents</TabButton>
                <TabButton active={activeTab === "ai"} onClick={() => setActiveTab("ai")}>AI Verification Results</TabButton>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(100vh-210px)]">
                {activeTab === "customer" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Customer Details" icon={<UserCheck className="w-4 h-4 text-teal-600" />}>
                      <Row k="Name" v={selected.customer.name} />
                      <Row k="Phone" v={selected.customer.phone} />
                      <Row k="Email" v={selected.customer.email} />
                      <Row k="Source" v={selected.submittedVia} />
                      <Row k="Status" v={selected.status} />
                    </Card>
                    <Card title="Case Timeline" icon={<Activity className="w-4 h-4 text-teal-600" />}>
                      <div className="space-y-3">
                        {selected.notes.slice(0, 6).map((n, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{n.at} • {n.by}</div>
                            <div className="text-sm font-bold text-slate-800 mt-1">{n.text}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Uploaded Identity Document" icon={<FileText className="w-4 h-4 text-teal-600" />}>
                      <Row k="Document Type" v={selected.docType} />
                      <Row k="File Name" v={selected.doc.fileName} />
                      <Row k="Extracted Name" v={selected.doc.extractedName} />
                      <Row k="DOB" v={selected.doc.dob} />
                      <Row k="Document ID" v={selected.doc.docIdMasked} />
                      <Row k="Expiry Validation" v={selected.doc.expiryValid ? "Passed" : "Failed"} />
                    </Card>
                    <Card title="Document Authenticity" icon={<FileCheck2 className="w-4 h-4 text-teal-600" />}>
                      <div className="text-sm font-medium text-slate-600 leading-relaxed">
                        DevFlow simulates OCR extraction, image integrity checks, and metadata heuristics to estimate authenticity confidence.
                      </div>
                      <div className="mt-4">
                        <SignalBar label="Authenticity Confidence" value={Math.round(selected.signals.docAuth * 100)} tone={selected.signals.docAuth < 0.8 ? "danger" : selected.signals.docAuth < 0.9 ? "warn" : "ok"} />
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === "ai" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                       <div className="lg:col-span-12">
                          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5">
                               <Network className="w-24 h-24" />
                             </div>
                             <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                      <Network className="w-5 h-5 text-purple-400" />
                                   </div>
                                   <div>
                                      <h3 className="text-lg font-black text-white tracking-tight">Cross-Identity Network Mapping</h3>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Relationship Graph Engine</p>
                                   </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                   Dynamic Correlation
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <IdentityGraphVisualization data={graphData} />
                                <IdentityNetworkInsights data={graphData} />
                             </div>
                          </div>
                       </div>

                       <div className="lg:col-span-12">
                          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5">
                               <Cpu className="w-24 h-24" />
                             </div>
                             <div className="flex items-center gap-3 mb-6">
                               <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
                                 <Terminal className="w-5 h-5 text-teal-400" />
                               </div>
                               <div>
                                  <h3 className="text-lg font-black text-white tracking-tight">Neural Intelligence Deep Dive</h3>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Advanced Tamper & Fraud Pattern Detection</p>
                               </div>
                             </div>
                             
                             {isAnalyzing ? (
                               <div className="py-12 flex flex-col items-center justify-center text-center">
                                  <Zap className="w-8 h-8 text-teal-500 animate-pulse mb-4" />
                                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Running Neural Correlation...</div>
                               </div>
                             ) : (
                               <DocumentIntelligenceReport result={aiResult} />
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Card title="Legacy Scoring Interface" icon={<Activity className="w-4 h-4 text-slate-400" />}>
                          <div className="grid grid-cols-2 gap-4">
                            <Metric title="Fraud Prob" value={`${Math.round(selected.signals.fraudProb * 100)}%`} tone={selected.signals.fraudProb > 0.35 ? "danger" : "ok"} />
                            <Metric title="Face Match" value={`${Math.round(selected.signals.faceMatch * 100)}%`} tone={selected.signals.faceMatch < 0.8 ? "warn" : "ok"} />
                          </div>
                       </Card>
                       <Card title="Decision Thresholds" icon={<ShieldCheck className="w-4 h-4 text-slate-400" />}>
                          <div className="flex items-end justify-between">
                            <div className="text-5xl font-black tabular-nums text-slate-900">{selected.riskScore}</div>
                            <StatusPill tone={category(selected.riskScore).tone} text={category(selected.riskScore).label} />
                          </div>
                       </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: QUICK INSIGHTS */}
        <div className="w-[340px] bg-[#0A192F] border-l border-[#1E2D3D] flex flex-col shrink-0 overflow-hidden text-slate-300">
          <div className="p-4 border-b border-[#1E2D3D]">
            <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
              AI Risk Analysis <ShieldCheck className="w-3.5 h-3.5" />
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#112240] p-3 rounded border border-[#233554] shadow-inner">
                <div className="text-[8px] text-slate-500 font-black uppercase mb-1">Fraud Probability</div>
                <div className={`text-lg font-black tabular-nums ${selected.signals.fraudProb > 0.35 ? "text-rose-400" : selected.signals.fraudProb > 0.2 ? "text-amber-300" : "text-emerald-300"}`}>
                  {Math.round(selected.signals.fraudProb * 100)}%
                </div>
                <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Signal: {selected.signals.fraudProb > 0.35 ? "High" : selected.signals.fraudProb > 0.2 ? "Medium" : "Low"}</div>
              </div>
              <div className="bg-[#112240] p-3 rounded border border-[#233554] shadow-inner">
                <div className="text-[8px] text-slate-500 font-black uppercase mb-1">Identity Match</div>
                <div className="text-lg font-black text-emerald-300 tabular-nums">{Math.round(selected.signals.idMatch * 100)}%</div>
                <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Confidence: {selected.signals.idMatch >= 0.88 ? "High" : selected.signals.idMatch >= 0.75 ? "Medium" : "Low"}</div>
              </div>
            </div>

            {category(selected.riskScore).tone === "danger" ? (
              <div className="p-3 bg-red-900/10 border-l-2 border-red-500 rounded-r-md">
                <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">High-Risk Case</div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Escalate to manual review. Consider enhanced document verification and watchlist screening.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-900/10 border-l-2 border-emerald-500 rounded-r-md">
                <div className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-1">Case Stable</div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Signals are within standard policy thresholds. Proceed with standard verification steps.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-teal-600" /> Case Notes
            </h3>
            <div className="space-y-2">
              {selected.notes.map((n, i) => (
                <div key={i} className="bg-slate-900/30 p-2 rounded border border-[#233554]">
                  <div className="text-[9px] font-black text-slate-500 uppercase">{n.at} • {n.by}</div>
                  <div className="text-[11px] font-bold text-slate-200 mt-1">{n.text}</div>
                </div>
              ))}
            </div>
          </div>

          <footer className="p-4 border-t border-[#1E2D3D] bg-[#071029] text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
            <span>Policy: KYC v2.4</span>
            <span className="text-teal-300">Secure Mode</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
        active ? "text-teal-600 border-teal-500" : "text-slate-400 border-transparent hover:text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
      <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{k}</div>
      <div className="text-sm font-bold text-slate-800 text-right">{v}</div>
    </div>
  );
}

function toneClasses(tone) {
  if (tone === "danger") return "border-rose-500/20 bg-rose-500/10 text-rose-700";
  if (tone === "warn") return "border-amber-500/20 bg-amber-500/10 text-amber-700";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700";
}

function StatusPill({ tone, text }) {
  const cls = toneClasses(tone);
  return <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider border ${cls}`}>{text}</span>;
}

function Metric({ title, value, tone }) {
  return (
    <div className={`border rounded-2xl p-4 ${toneClasses(tone)}`}>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</div>
      <div className="text-2xl font-black mt-2 tabular-nums text-slate-900">{value}</div>
    </div>
  );
}

function SignalBar({ label, value, tone }) {
  const bar =
    tone === "danger" ? "bg-rose-500" : tone === "warn" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div>
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
        <span>{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Rule({ active, label, desc }) {
  return (
    <div className={`p-3 rounded-xl border ${active ? "border-teal-500/30 bg-teal-50" : "border-slate-200 bg-white"}`}>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-[11px] font-bold text-slate-800 mt-1">{desc}</div>
    </div>
  );
}

function ChecklistItem({ label, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={() => setChecked((v) => !v)} className="w-4 h-4 accent-teal-600" />
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </label>
  );
}
