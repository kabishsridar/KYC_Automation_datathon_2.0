"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, AlertTriangle, CheckCircle2, ShieldCheck, Search, FileText, UserCheck, ClipboardList, Timer, Layers } from "lucide-react";

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function computeRiskScore({ fraudProb, docAuth, idMatch }) {
  const fraud = clamp01(fraudProb) * 55;
  const doc = (1 - clamp01(docAuth)) * 30;
  const face = (1 - clamp01(idMatch)) * 25;
  return Math.max(0, Math.min(100, Math.round(fraud + doc + face)));
}

const seedCases = [
  { id: "KYC-10291", customer: "Rahul Sharma", stage: "Document Processing", docType: "Aadhaar", fraudProb: 0.18, docAuth: 0.92, idMatch: 0.91, eta: "2m" },
  { id: "KYC-10292", customer: "Sarah Williams", stage: "Face Verification", docType: "PAN", fraudProb: 0.09, docAuth: 0.96, idMatch: 0.94, eta: "1m" },
  { id: "KYC-10293", customer: "Amit Patel", stage: "Manual Review", docType: "Passport", fraudProb: 0.42, docAuth: 0.79, idMatch: 0.76, eta: "—" },
  { id: "KYC-10294", customer: "Meena Kumari", stage: "Additional Documents", docType: "Driving License", fraudProb: 0.23, docAuth: 0.88, idMatch: 0.86, eta: "—" },
];

export default function VerificationOpsConsole() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(seedCases[0].id);
  const [tasks, setTasks] = useState([
    { id: "OPS-201", text: "Review manual queue backlog for high-risk cases", done: false },
    { id: "OPS-202", text: "Verify kiosk connectivity and document upload success rates", done: true },
    { id: "OPS-203", text: "Audit failed expiry validations and trigger doc re-requests", done: false },
  ]);

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
    return cases.filter((c) => (c.id + c.customer + c.stage + c.docType).toLowerCase().includes(q));
  }, [cases, query]);

  const selected = useMemo(() => filtered.find((c) => c.id === selectedId) || cases.find((c) => c.id === selectedId) || cases[0], [filtered, cases, selectedId]);

  const stats = useMemo(() => {
    const total = cases.length;
    const active = cases.filter((c) => c.stage !== "Manual Review").length;
    const manual = cases.filter((c) => c.stage === "Manual Review").length;
    const highRisk = cases.filter((c) => c.riskScore > 70).length;
    return { total, active, manual, highRisk };
  }, [cases]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex">
      <div className="w-80 bg-slate-950 text-white flex flex-col hidden md:flex border-r border-white/5">
        <div className="p-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20 group-hover:scale-110 transition-transform">
              <Layers className="w-8 h-8 text-teal-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-widest text-white">DEVFLOW</h1>
              <div className="text-[10px] font-black text-teal-400 tracking-[0.3em] -mt-1">OPS CONSOLE</div>
            </div>
          </Link>
        </div>

        <div className="p-6 space-y-4 flex-grow">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
            <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Pipeline Snapshot
            </div>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest">
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">
                <div className="text-slate-500">Total</div>
                <div className="text-white text-lg">{stats.total}</div>
              </div>
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">
                <div className="text-slate-500">Active</div>
                <div className="text-white text-lg">{stats.active}</div>
              </div>
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">
                <div className="text-slate-500">Manual</div>
                <div className="text-amber-300 text-lg">{stats.manual}</div>
              </div>
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">
                <div className="text-slate-500">High Risk</div>
                <div className="text-rose-300 text-lg">{stats.highRisk}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-300" /> Ops Tasks
            </div>
            <div className="space-y-2">
              {tasks.map((t) => (
                <label key={t.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-slate-900/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                    className="mt-1 accent-teal-400"
                  />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.id}</div>
                    <div className={`text-[11px] font-bold ${t.done ? "text-slate-500 line-through" : "text-slate-200"}`}>{t.text}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5">
          <div className="bg-teal-500/5 p-5 rounded-3xl border border-teal-500/10">
            <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2">System Status</div>
            <div className="flex items-center gap-2 text-xs font-black">
              <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-white">Pipeline Online</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Latency: 42ms • Audit: Enabled</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="bg-white/80 backdrop-blur-xl px-10 py-6 border-b border-slate-200 flex justify-between items-center shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1">
            <Link href="/" className="md:hidden text-slate-700 font-black uppercase tracking-widest text-xs inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-3 w-96 transition-all max-w-full">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search case, customer, stage…"
                className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-900 font-bold placeholder:text-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-black text-slate-900 leading-none">IDENTITY CHECKS ACTIVE</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mode: Monitoring</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 flex gap-10 flex-col lg:flex-row bg-[#F8FAFC]">
          <div className="w-full lg:w-[420px] flex flex-col gap-8 shrink-0">
            <div className="bg-slate-950 rounded-[40px] p-8 shadow-2xl shadow-slate-900/40 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
                  <Timer className="w-4 h-4 text-teal-300" /> Live Pipeline Feed
                </h2>
              </div>
              <div className="space-y-4">
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-5 rounded-3xl border transition-all hover:translate-x-1 cursor-pointer ${
                      c.id === selected.id ? "bg-white/10 border-teal-500/30" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase px-3 py-1 rounded-xl tracking-widest bg-white/10 text-white border border-white/10">
                        {c.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-black">{c.eta}</span>
                    </div>
                    <p className="font-black text-sm leading-relaxed text-white uppercase tracking-tight">{c.customer}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{c.stage}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        c.riskScore > 70 ? "text-rose-300" : c.riskScore > 30 ? "text-amber-200" : "text-emerald-300"
                      }`}>
                        Risk {c.riskScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-200">
              <h2 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[11px] mb-6 flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-teal-600" /> Operational Actions
              </h2>
              <div className="space-y-3">
                <ActionRow icon={<UserCheck className="w-4 h-4 text-teal-600" />} title="Route manual review" desc="Send selected case to officer queue." />
                <ActionRow icon={<FileText className="w-4 h-4 text-indigo-600" />} title="Request documents" desc="Trigger additional document upload request." />
                <ActionRow icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />} title="Audit snapshot" desc="Write checkpoint to audit trail." />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-[40px] p-8 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected</div>
                <h2 className="text-3xl font-black text-slate-900">{selected.customer}</h2>
                <div className="text-sm text-slate-500 font-bold mt-1">{selected.id} • {selected.docType} • {selected.stage}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Score</div>
                <div className={`text-4xl font-black tabular-nums ${
                  selected.riskScore > 70 ? "text-rose-600" : selected.riskScore > 30 ? "text-amber-600" : "text-emerald-600"
                }`}>{selected.riskScore}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Metric title="Fraud Probability" value={`${Math.round(selected.fraudProb * 100)}%`} tone={selected.fraudProb > 0.35 ? "danger" : selected.fraudProb > 0.2 ? "warn" : "ok"} />
              <Metric title="Document Authenticity" value={`${Math.round(selected.docAuth * 100)}%`} tone={selected.docAuth < 0.8 ? "danger" : selected.docAuth < 0.9 ? "warn" : "ok"} />
              <Metric title="Identity Match" value={`${Math.round(selected.idMatch * 100)}%`} tone={selected.idMatch < 0.75 ? "danger" : selected.idMatch < 0.88 ? "warn" : "ok"} />
            </div>

            {selected.riskScore > 70 ? (
              <Banner tone="danger" title="Fraud Risk Alert" text="High-risk indicators present. Ensure manual review and enhanced verification steps are applied." />
            ) : selected.riskScore > 30 ? (
              <Banner tone="warn" title="Officer Review Recommended" text="Moderate risk. Route to compliance officer for final verification decision." />
            ) : (
              <Banner tone="ok" title="Auto Approval Eligible" text="Signals are within policy thresholds. The case can proceed to automated approval if configured." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionRow({ icon, title, desc }) {
  return (
    <div className="p-5 rounded-3xl border border-slate-200 bg-[#F8FAFC] hover:border-teal-200 transition-colors flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</div>
        <div className="text-[11px] text-slate-500 font-bold mt-1">{desc}</div>
      </div>
    </div>
  );
}

function Metric({ title, value, tone }) {
  const cls =
    tone === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-900"
      : tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-emerald-200 bg-emerald-50 text-emerald-900";
  const icon = tone === "danger" ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  return (
    <div className={`border rounded-2xl p-4 ${cls}`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</div>
        {icon}
      </div>
      <div className="text-2xl font-black mt-2 tabular-nums">{value}</div>
    </div>
  );
}

function Banner({ tone, title, text }) {
  const cls =
    tone === "danger"
      ? "bg-rose-50 border-rose-200"
      : tone === "warn"
      ? "bg-amber-50 border-amber-200"
      : "bg-emerald-50 border-emerald-200";
  const icon = tone === "danger" ? <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />;
  return (
    <div className={`border rounded-3xl p-5 flex items-start gap-4 ${cls}`}>
      {icon}
      <div>
        <div className="text-sm font-black text-slate-900 uppercase tracking-wider">{title}</div>
        <div className="text-sm text-slate-700 font-medium mt-1">{text}</div>
      </div>
    </div>
  );
}

