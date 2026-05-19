import Link from "next/link";
import { Activity, ShieldCheck, UserCheck, Shield, FileCheck, Search, Headphones, MapPin, Network } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-teal-400" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
            DevFlow
          </span>
        </div>
        <div className="text-sm font-medium text-slate-400">Autonomous KYC Intelligence Platform</div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Next-Generation <br /> AI Compliance Platform
          </h1>
          <p className="text-xl text-slate-400">
            A unified ecosystem connecting identity verification kiosk, automated document processing, and compliance dashboards for real-time fraud detection and customer onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Links */}
          <DashboardCard
            title="Compliance Command Center"
            desc="Monitor overall KYC throughput, risk alerts, and onboarding velocity."
            icon={<Activity className="h-6 w-6 text-indigo-400" />}
            href="/compliance-command-center"
            color="bg-slate-900 border-slate-800 hover:border-indigo-500/50"
          />
          <DashboardCard
            title="Officer Portal"
            desc="Review customer verifications, AI risk insights, and approval actions."
            icon={<UserCheck className="h-6 w-6 text-teal-400" />}
            href="/compliance-officer-portal"
            color="bg-slate-900 border-slate-800 hover:border-teal-500/50"
          />
          <DashboardCard
            title="Voice Banking Kiosk"
            desc="Voice-guided banking for rural and senior citizens with real-time fraud protection."
            icon={<Headphones className="h-6 w-6 text-emerald-400" />}
            href="/voice-banking"
            color="bg-slate-900 border-slate-800 hover:border-emerald-500/50"
            tag="Accessibility First"
          />
          <DashboardCard
            title="KYC Verification Kiosk"
            desc="Self-service identity verification workflow for instant onboarding."
            icon={<Shield className="h-6 w-6 text-blue-400" />}
            href="/kyc-verification-kiosk"
            color="bg-slate-900 border-slate-800 hover:border-blue-500/50"
          />
          <DashboardCard
            title="AI Identity Graph Engine"
            desc="Detect fraud networks by mapping relationships between KYC submissions."
            icon={<Network className="h-6 w-6 text-purple-400" />}
            href="/ai-identity-graph"
            color="bg-slate-900 border-slate-800 hover:border-purple-500/50"
          />
          <DashboardCard
            title="AI Risk Lab"
            desc="Deep-dive into fraud models, authenticity scoring, and identity analytics."
            icon={<ShieldCheck className="h-6 w-6 text-orange-400" />}
            href="/wearable"
            color="bg-slate-900 border-slate-800 hover:border-orange-500/50"
          />
          <DashboardCard
            title="Kiosk Network"
            desc="Find nearby verification kiosks and route customers to the nearest location."
            icon={<MapPin className="h-6 w-6 text-teal-300" />}
            href="/kiosk-network"
            color="bg-slate-900 border-slate-800 hover:border-teal-500/50"
          />
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">AI Compliance Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolCard
              title="Document Intelligence Engine"
              desc="Advanced OCR, tamper detection, and authenticity analysis for identity records."
              icon={<FileCheck className="h-5 w-5 text-purple-400" />}
              href="/ai-tools/reports"
            />
            <ToolCard
              title="Sanctions Screener"
              desc="Dynamically screen customers against global watchlists using AI."
              icon={<Search className="h-5 w-5 text-emerald-400" />}
              href="/doctor-finder"
            />
            <ToolCard
              title="KYC Voice Assistant"
              desc="Multilingual voice guidance for complex verification steps."
              icon={<Headphones className="h-5 w-5 text-sky-400" />}
              href="/ai-tools/voice"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, desc, icon, href, color, tag }) {
  return (
    <Link href={href}>
      <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-[0_0_20px_rgba(45,212,191,0.1)] cursor-pointer h-full flex flex-col group ${color}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {tag && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase text-emerald-400 tracking-widest">
              {tag}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 flex-grow text-sm leading-relaxed">{desc}</p>
        <div className="mt-6 text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all text-teal-400">
          Enter Module <span>&rarr;</span>
        </div>
      </div>
    </Link>
  );
}

function ToolCard({ title, desc, icon, href }) {
  return (
    <Link href={href}>
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 hover:shadow-xl transition-all cursor-pointer flex gap-4 h-full items-start group">
        <div className="p-3 rounded-lg bg-slate-800 flex-shrink-0 group-hover:bg-slate-700 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
          <p className="text-xs text-slate-400 leading-normal">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
