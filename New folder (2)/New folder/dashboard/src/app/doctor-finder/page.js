"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, ShieldCheck, AlertTriangle, CheckCircle2, Globe, FileText, ScanSearch } from "lucide-react";

const WATCHLISTS = ["UN Consolidated", "OFAC SDN", "EU Sanctions", "PEP (Global)"];

function scoreFromName(name) {
  const n = (name || "").trim().toLowerCase();
  if (!n) return { hit: false, confidence: 0, list: null, rationale: "No query provided." };
  const seed = n.length * 97 + n.charCodeAt(0);
  const r = (k) => {
    const x = Math.sin(seed + k * 173) * 10000;
    return x - Math.floor(x);
  };
  const hit = r(1) > 0.72 || n.includes("patel") || n.includes("sharma");
  const confidence = Math.round((hit ? 0.78 + r(2) * 0.2 : 0.15 + r(2) * 0.25) * 100);
  const list = hit ? WATCHLISTS[Math.floor(r(3) * WATCHLISTS.length)] : null;
  const rationale = hit
    ? "Potential match found based on name similarity and watchlist metadata. Manual confirmation required."
    : "No match found in simulated watchlist screening.";
  return { hit, confidence, list, rationale };
}

export default function SanctionsScreener() {
  const [query, setQuery] = useState("");
  const [selectedLists, setSelectedLists] = useState(() => new Set(["UN Consolidated", "OFAC SDN"]));
  const [status, setStatus] = useState("idle"); // idle | screening | done
  const [result, setResult] = useState(null);

  const selectedLabel = useMemo(() => Array.from(selectedLists).join(", "), [selectedLists]);

  const toggle = (l) => {
    setSelectedLists((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  };

  const screen = (e) => {
    e.preventDefault();
    setStatus("screening");
    setResult(null);
    setTimeout(() => {
      const base = scoreFromName(query);
      const used = Array.from(selectedLists);
      const list = base.hit ? used[Math.min(used.length - 1, Math.floor(base.confidence / 25))] || base.list : null;
      setResult({ ...base, list, listsUsed: used });
      setStatus("done");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-slate-300 hover:text-white mb-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-[#0A192F] border-b border-[#1E2D3D] p-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <ShieldCheck className="w-56 h-56" />
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">Sanctions Screener</h1>
                  <p className="text-slate-400 font-medium text-sm">Simulated watchlist screening for compliance onboarding.</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="px-3 py-2 rounded-2xl border border-[#233554] bg-[#112240]">Lists: {selectedLabel || "None"}</span>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Screening Input</div>

                <form onSubmit={screen} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Customer name / alias"
                      className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-10 pr-3 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>

                  <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Watchlists</div>
                    <div className="grid grid-cols-2 gap-2">
                      {WATCHLISTS.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => toggle(l)}
                          className={`px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-colors ${
                            selectedLists.has(l) ? "bg-teal-600 border-teal-500 text-white" : "bg-slate-950/30 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!query.trim() || status === "screening" || selectedLists.size === 0}
                    className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-2xl transition-colors"
                  >
                    {status === "screening" ? "Screening…" : "Run Sanctions Screening"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 h-full">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Result</div>

                {status === "idle" && (
                  <div className="text-slate-500 text-sm font-medium flex items-center gap-3">
                    <ScanSearch className="w-5 h-5" /> Enter a name and select watchlists to screen.
                  </div>
                )}

                {status === "screening" && (
                  <div className="space-y-3">
                    <div className="text-white font-black text-sm">Querying watchlists…</div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-teal-500 transition-all duration-700" style={{ width: "70%" }} />
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">Simulated screening. For demo purposes only.</div>
                  </div>
                )}

                {status === "done" && result && (
                  <div className="space-y-5">
                    <div className={`rounded-2xl p-5 border flex items-start gap-4 ${
                      result.hit ? "bg-rose-500/10 border-rose-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                    }`}>
                      {result.hit ? (
                        <AlertTriangle className="w-6 h-6 text-rose-300 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-300 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-black text-white">
                          {result.hit ? "Potential Watchlist Match" : "No Match Found"}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium mt-1">{result.rationale}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confidence</div>
                        <div className="text-3xl font-black text-white tabular-nums">{result.confidence}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 border border-slate-800 rounded-2xl p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Lists Used</div>
                        <div className="text-sm font-bold text-slate-200">{result.listsUsed.join(", ")}</div>
                      </div>
                      <div className="bg-black/30 border border-slate-800 rounded-2xl p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Matched List</div>
                        <div className="text-sm font-bold text-slate-200">{result.hit ? result.list : "—"}</div>
                      </div>
                    </div>

                    <div className="bg-black/30 border border-slate-800 rounded-2xl p-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Officer Notes (Simulated)
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        {result.hit
                          ? "If the customer is a true match, escalate for enhanced due diligence and record the screening evidence."
                          : "Record the screening result in the onboarding audit trail."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
