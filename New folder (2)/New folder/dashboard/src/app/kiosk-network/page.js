"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Navigation, Search, ShieldCheck, CheckCircle2 } from "lucide-react";

const KIOSKS = [
  { id: "KIOSK-CHN-01", city: "Chennai", area: "T. Nagar", status: "Online", utilization: "High" },
  { id: "KIOSK-TRY-02", city: "Trichy", area: "Srirangam", status: "Online", utilization: "Medium" },
  { id: "KIOSK-MDU-03", city: "Madurai", area: "Anna Nagar", status: "Online", utilization: "Low" },
  { id: "KIOSK-DGL-04", city: "Dindigul", area: "Railway Station Rd", status: "Online", utilization: "Medium" },
  { id: "KIOSK-CBE-05", city: "Coimbatore", area: "RS Puram", status: "Online", utilization: "High" },
];

export default function KioskNetwork() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(KIOSKS[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KIOSKS;
    return KIOSKS.filter((k) => (k.city + k.area + k.id).toLowerCase().includes(q));
  }, [query]);

  const selectedKiosk = useMemo(
    () => filtered.find((k) => k.id === selected) || KIOSKS.find((k) => k.id === selected) || KIOSKS[0],
    [filtered, selected]
  );

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
                <MapPin className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">Kiosk Network</h1>
                <p className="text-slate-400 font-medium text-sm">Select the nearest DevFlow verification kiosk location.</p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Locations</div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search city or kiosk ID…"
                    className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-10 pr-3 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                  />
                </div>

                <div className="space-y-2">
                  {filtered.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => setSelected(k.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-colors ${
                        selected === k.id ? "bg-slate-900 border-teal-500/40" : "bg-slate-950/30 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-black text-white">{k.city}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{k.area} • {k.id}</div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border bg-emerald-500/10 border-emerald-500/20 text-emerald-200">
                          {k.status}
                        </span>
                      </div>
                      <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Utilization: <span className="text-slate-200">{k.utilization}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Kiosk</div>
                    <div className="text-3xl font-black text-white mt-2">{selectedKiosk.city}</div>
                    <div className="text-[11px] text-slate-400 font-bold mt-1">{selectedKiosk.area} • {selectedKiosk.id}</div>
                  </div>
                  <div className="px-4 py-2 rounded-2xl border border-teal-500/20 bg-teal-500/10 text-teal-200 text-xs font-black uppercase tracking-widest">
                    Ready
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard title="Connectivity" value="Secure tunnel active" />
                  <InfoCard title="Queue Time" value={selectedKiosk.utilization === "High" ? "8–12 min" : selectedKiosk.utilization === "Medium" ? "3–6 min" : "0–3 min"} />
                  <InfoCard title="Supported IDs" value="Aadhaar / PAN / Passport / Driving License" />
                  <InfoCard title="Kiosk Mode" value="Self-service + assisted onboarding" />
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href="/kyc-verification-kiosk"
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-2xl transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" /> Start Verification Here
                  </Link>
                  <button
                    onClick={() => alert(`Nearest kiosk selected: ${selectedKiosk.city} (${selectedKiosk.id})`)}
                    className="px-5 py-3.5 rounded-2xl border border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-100 font-black uppercase tracking-widest text-xs transition-colors inline-flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Set as Nearest
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Note</div>
                <div className="text-sm text-slate-300 font-medium leading-relaxed">
                  This network view is simulated for demo purposes. In production, kiosk availability and telemetry would be sourced from a secure device registry and monitored by the Compliance Command Center.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/30">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</div>
      <div className="text-sm font-black text-white mt-2">{value}</div>
    </div>
  );
}

