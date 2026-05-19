"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Fingerprint, ScanSearch, AlertTriangle, CheckCircle2, FileText, Search } from "lucide-react";

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function computeRisk({ fraudProb, docAuth, idMatch }) {
  const fraud = clamp01(fraudProb) * 55;
  const doc = (1 - clamp01(docAuth)) * 30;
  const face = (1 - clamp01(idMatch)) * 25;
  return Math.max(0, Math.min(100, Math.round(fraud + doc + face)));
}

function tone(score) {
  if (score <= 30) return "ok";
  if (score <= 70) return "warn";
  return "danger";
}

const initialProfiles = [
  { id: "CUST-001", name: "Rahul Sharma", docType: "Aadhaar", fraudProb: 0.18, docAuth: 0.92, idMatch: 0.91 },
  { id: "CUST-002", name: "Sarah Williams", docType: "PAN", fraudProb: 0.09, docAuth: 0.96, idMatch: 0.94 },
  { id: "CUST-003", name: "Amit Patel", docType: "Passport", fraudProb: 0.42, docAuth: 0.79, idMatch: 0.76 },
  { id: "CUST-004", name: "Meena Kumari", docType: "Driving License", fraudProb: 0.23, docAuth: 0.88, idMatch: 0.86 },
];

export default function IdentityRiskEngine() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialProfiles[0].id);

  const profiles = useMemo(
    () =>
      initialProfiles.map((p) => ({
        ...p,
        score: computeRisk({ fraudProb: p.fraudProb, docAuth: p.docAuth, idMatch: p.idMatch }),
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => (p.id + p.name + p.docType).toLowerCase().includes(q));
  }, [profiles, query]);

  const selected = useMemo(() => filtered.find((p) => p.id === selectedId) || profiles.find((p) => p.id === selectedId) || profiles[0], [filtered, profiles, selectedId]);

  const t = tone(selected.score);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-slate-300 hover:text-white mb-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-[#0A192F] border-b border-[#1E2D3D] p-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <ShieldCheck className="w-56 h-56" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">Identity Risk Engine</h1>
                <p className="text-slate-400 font-medium text-sm">Inspect identity verification signals and explain risk scoring outcomes.</p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Profiles</div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search customer…"
                    className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-10 pr-3 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
                <div className="space-y-2">
                  {filtered.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-colors ${
                        p.id === selected.id ? "bg-slate-900 border-teal-500/40" : "bg-slate-950/30 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-black text-white">{p.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.docType} • {p.id}</div>
                        </div>
                        <div className={`text-sm font-black tabular-nums ${
                          tone(p.score) === "danger" ? "text-rose-300" : tone(p.score) === "warn" ? "text-amber-200" : "text-emerald-300"
                        }`}>{p.score}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Metric title="Fraud Probability" value={`${Math.round(selected.fraudProb * 100)}%`} tone={selected.fraudProb > 0.35 ? "danger" : selected.fraudProb > 0.2 ? "warn" : "ok"} />
                <Metric title="Document Authenticity" value={`${Math.round(selected.docAuth * 100)}%`} tone={selected.docAuth < 0.8 ? "danger" : selected.docAuth < 0.9 ? "warn" : "ok"} />
                <Metric title="Identity Match" value={`${Math.round(selected.idMatch * 100)}%`} tone={selected.idMatch < 0.75 ? "danger" : selected.idMatch < 0.88 ? "warn" : "ok"} />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">KYC Risk Score</div>
                    <div className="text-5xl font-black text-white tabular-nums mt-2">{selected.score}</div>
                    <div className="text-[11px] text-slate-400 font-bold mt-2">Computed from fraud probability + document authenticity + identity match confidence.</div>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-widest ${
                    t === "danger" ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : t === "warn" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  }`}>
                    {t === "danger" ? "High Risk" : t === "warn" ? "Medium Risk" : "Low Risk"}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Rule active={selected.score <= 30} label="0–30" desc="Auto Approved" />
                  <Rule active={selected.score > 30 && selected.score <= 70} label="31–70" desc="Officer Review" />
                  <Rule active={selected.score > 70} label="71–100" desc="Fraud Alert" />
                </div>

                {t === "danger" && (
                  <div className="mt-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-300 mt-0.5" />
                    <div>
                      <div className="text-sm font-black text-white">Fraud alert threshold exceeded</div>
                      <div className="text-[11px] text-slate-300 font-medium mt-1">Recommended: manual review, enhanced verification, and sanctions screening.</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Explanation (Simulated)
                </div>
                <div className="text-sm text-slate-300 font-medium leading-relaxed">
                  The engine combines three signals:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><span className="text-white font-black">Fraud probability</span> from anomaly + pattern signals.</li>
                    <li><span className="text-white font-black">Document authenticity</span> from OCR confidence and integrity checks.</li>
                    <li><span className="text-white font-black">Identity match</span> from selfie-to-ID similarity metrics.</li>
                  </ul>
                  <div className="mt-4 text-slate-400 text-[11px] font-bold">This module is demo-only and uses simulated values.</div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black uppercase tracking-widest transition-colors inline-flex items-center gap-2">
                    <ScanSearch className="w-4 h-4" /> Re-run Analysis
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-200 text-xs font-black uppercase tracking-widest transition-colors inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Save to Audit Trail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, tone }) {
  const cls =
    tone === "danger"
      ? "border-rose-500/20 bg-rose-500/10"
      : tone === "warn"
      ? "border-amber-500/20 bg-amber-500/10"
      : "border-emerald-500/20 bg-emerald-500/10";
  const icon = tone === "danger" ? <AlertTriangle className="w-4 h-4 text-rose-300" /> : <CheckCircle2 className="w-4 h-4 text-emerald-300" />;
  return (
    <div className={`border rounded-2xl p-4 ${cls}`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">{title}</div>
        {icon}
      </div>
      <div className="text-2xl font-black text-white mt-2 tabular-nums">{value}</div>
    </div>
  );
}

function Rule({ active, label, desc }) {
  return (
    <div className={`p-3 rounded-xl border ${active ? "border-teal-500/40 bg-teal-500/5" : "border-slate-800 bg-slate-950/20"}`}>
      <div className="text-[10px] font-black text-white uppercase tracking-widest">{label}</div>
      <div className="text-[11px] text-slate-300 font-bold mt-1">{desc}</div>
    </div>
  );
}
