"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Navigation, 
  Camera, 
  UploadCloud, 
  ShieldCheck, 
  Terminal,
  Cpu,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useDocumentIntelligence, DocumentIntelligenceReport } from "../../components/DocumentIntelligenceEngine";

export default function KycVerificationKiosk() {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({ name: "", customerId: "", phone: "", email: "" });
  const [docType, setDocType] = useState("Aadhaar");
  const [file, setFile] = useState(null);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const { analyze, isAnalyzing, analysisProgress, result } = useDocumentIntelligence();

  const handleStartAnalysis = (e) => {
    e.preventDefault();
    if (!file) return;
    analyze([file], docType);
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setCustomer({ name: "", customerId: "", phone: "", email: "" });
    setFile(null);
    setSelfieCaptured(false);
    analyze([], ""); // clear result
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white leading-none">DevFlow</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Intelligence Kiosk v4.0</div>
            </div>
          </div>
          <Link href="/" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Terminate Session
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Verification Sequence</h2>
              <div className="space-y-2">
                <ProgressItem n={1} label="Customer Identity" active={step === 1} done={step > 1} />
                <ProgressItem n={2} label="Document Acquisition" active={step === 2} done={step > 2} />
                <ProgressItem n={3} label="Biometric Capture" active={step === 3} done={step > 3} />
                <ProgressItem n={4} label="Neural Intelligence" active={step === 4} done={step > 4} />
                <ProgressItem n={5} label="Verification Result" active={step === 5} done={step > 5} />
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">Location</div>
                  <div className="text-xs font-bold text-slate-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-teal-500" /> Chennai Hub #01
                  </div>
                </div>
                <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors">
                  Reset System
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-teal-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Edge Computing</h3>
              </div>
              <p className="text-[11px] text-teal-100/60 font-medium leading-relaxed">
                Analysis is performed locally on this kiosk using DevFlow Neural Core. No identity data is transmitted to the cloud during initial verification.
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 min-h-[600px] shadow-2xl backdrop-blur-xl transition-all duration-700">
              
              {/* Step 1: Customer Details */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Identify Yourself</h2>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-md">Initialize the secure verification session by entering your primary details.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputBox 
                      label="Full Legal Name" 
                      icon={<User className="w-4 h-4 text-teal-400" />} 
                      placeholder="As per ID document"
                      value={customer.name}
                      onChange={v => setCustomer({...customer, name: v})}
                    />
                    <InputBox 
                      label="Customer ID / Ref" 
                      icon={<Fingerprint className="w-4 h-4 text-teal-400" />} 
                      placeholder="CUST-XXXX-XXXX"
                      value={customer.customerId}
                      onChange={v => setCustomer({...customer, customerId: v})}
                    />
                    <InputBox 
                      label="Phone Number" 
                      icon={<Navigation className="w-4 h-4 text-teal-400" />} 
                      placeholder="+91 XXXXX XXXXX"
                      value={customer.phone}
                      onChange={v => setCustomer({...customer, phone: v})}
                    />
                    <InputBox 
                      label="Email Address" 
                      icon={<FileText className="w-4 h-4 text-teal-400" />} 
                      placeholder="name@domain.com"
                      value={customer.email}
                      onChange={v => setCustomer({...customer, email: v})}
                    />
                  </div>

                  <button
                    disabled={!customer.name || !customer.customerId}
                    onClick={() => setStep(2)}
                    className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-teal-400 transition-all duration-500 disabled:bg-slate-800 disabled:text-slate-500 flex items-center justify-center gap-2 group"
                  >
                    Establish Secure Session <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* Step 2: Document Acquisition */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Acquire Document</h2>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-md">The Intelligence Engine supports Aadhaar, PAN, Passport, and Driving Licenses.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Select Document Class</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {["Aadhaar", "PAN Card", "Passport", "Driving License"].map(t => (
                          <button
                            key={t}
                            onClick={() => setDocType(t)}
                            className={`px-3 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                              docType === t 
                                ? "bg-white border-white text-black shadow-xl" 
                                : "bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/20"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="cursor-pointer block group">
                      <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center bg-slate-900/30 group-hover:bg-slate-900/60 group-hover:border-teal-400/50 transition-all duration-500">
                        <UploadCloud className="w-10 h-10 text-teal-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <div className="text-xl font-black text-white mb-2">Insert or Upload ID</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Supports scans from this kiosk hardware</div>
                        {file && (
                          <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black uppercase animate-in bounce-in">
                            <FileText className="w-4 h-4" /> {file.name}
                          </div>
                        )}
                      </div>
                      <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0])} />
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="px-8 py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Back</button>
                    <button
                      disabled={!file}
                      onClick={() => setStep(3)}
                      className="flex-1 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-teal-400 transition-all duration-500 disabled:bg-slate-800 disabled:text-slate-500"
                    >
                      Authenticate Source
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Biometric Capture */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Biometric Capture</h2>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-md">Look into the kiosk camera. We will match your live face against the extracted document photo.</p>
                  </div>

                  <div className="relative aspect-video bg-slate-950 rounded-[2.5rem] border border-white/5 overflow-hidden flex items-center justify-center group">
                    {!selfieCaptured ? (
                      <>
                        <div className="absolute inset-0 opacity-20 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="text-center space-y-4 relative z-10">
                          <Camera className="w-12 h-12 text-teal-500 mx-auto animate-pulse" />
                          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500/70">Kiosk Sensor Active</div>
                        </div>
                        <div className="absolute inset-12 border-2 border-dashed border-white/10 rounded-full" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center gap-4">
                         <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                         </div>
                         <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Capture Sequence Success</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="px-8 py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Back</button>
                    {!selfieCaptured ? (
                      <button
                        onClick={() => setSelfieCaptured(true)}
                        className="flex-1 py-5 rounded-2xl bg-teal-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-teal-500 transition-all duration-500"
                      >
                        Capture Biometrics
                      </button>
                    ) : (
                      <button
                        onClick={handleStartAnalysis}
                        className="flex-1 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-400 transition-all duration-500 flex items-center justify-center gap-2 group"
                      >
                         Execute Neural Intelligence <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Neural Intelligence */}
              {step === 4 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-[500px]">
                      <div className="w-32 h-32 relative mb-12 scale-150">
                        <div className="absolute inset-0 border-8 border-teal-500/10 rounded-full" />
                        <div className="absolute inset-0 border-8 border-teal-400 border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-10 h-10 text-teal-400 animate-pulse" />
                        </div>
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-4">Neural Processing</h2>
                      <div className="w-full max-w-md bg-slate-950 border border-white/10 rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300" style={{ width: `${analysisProgress}%` }} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mt-6 animate-pulse">
                        Analyzing Pixel Consistency & Cryptographic Marks
                      </p>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                      <div className="mb-8 flex items-center justify-between">
                         <h2 className="text-4xl font-black tracking-tighter text-white">Analysis Report</h2>
                         <div className="px-4 py-1.5 rounded-full bg-slate-950 border border-white/10 text-[10px] font-mono text-teal-400">ID: DF-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                      </div>
                      <DocumentIntelligenceReport result={result} />
                      <button
                        onClick={() => setStep(5)}
                        className="w-full mt-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-teal-400 transition-all duration-500"
                      >
                         Finalize Verification
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Result */}
              {step === 5 && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                  <div className="text-center space-y-6 py-12">
                    <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-3xl ${
                      result.status === "VERIFIED" ? "bg-emerald-500 shadow-emerald-500/30" : result.status === "REJECTED" ? "bg-rose-500 shadow-rose-500/30" : "bg-amber-500 shadow-amber-500/30"
                    }`}>
                      {result.status === "VERIFIED" ? <CheckCircle2 className="w-16 h-16 text-white" /> : <AlertTriangle className="w-16 h-16 text-white" />}
                    </div>
                    
                    <div>
                      <h2 className="text-5xl font-black tracking-tighter text-white mb-2">{result.status === "VERIFIED" ? "Verified" : result.status === "REJECTED" ? "Rejected" : "Flagged"}</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Onboarding Sequence Completed</p>
                    </div>

                    <div className="bg-slate-950/60 border border-white/5 rounded-[2rem] p-8 max-w-md mx-auto">
                       <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Summary for {result.extractedData.name}</div>
                       <div className="space-y-3">
                          <SummaryRow label="Doc Authenticity" value={`${result.docAuthScore}%`} />
                          <SummaryRow label="Face Match" value={`${result.faceMatchConfidence}%`} />
                          <SummaryRow label="Final Risk Score" value={result.status === "VERIFIED" ? "LOW" : result.status === "REJECTED" ? "CRITICAL" : "MEDIUM"} />
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-8">
                      <button onClick={reset} className="flex-1 py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">New Onboarding</button>
                      <Link href="/" className="flex-1 py-5 rounded-2xl bg-teal-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-teal-500 transition-all duration-500">Return to Dashboard</Link>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const ProgressItem = ({ n, label, active, done }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
    active ? "bg-white border-white scale-105 shadow-xl shadow-white/5" : done ? "bg-emerald-500/10 border-emerald-500/30" : "bg-transparent border-white/5 opacity-40"
  }`}>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${
      active ? "bg-black border-black text-white" : done ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"
    }`}>
      {done ? <CheckCircle2 className="w-4 h-4" /> : n}
    </div>
    <div className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-black" : done ? "text-emerald-400" : "text-slate-500"}`}>
      {label}
    </div>
  </div>
);

const InputBox = ({ label, icon, placeholder, value, onChange }) => (
  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus-within:border-teal-500/50 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      {icon}
    </div>
    <input 
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-transparent border-none outline-none w-full text-sm font-bold text-white placeholder:text-slate-700"
    />
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
    <span className="text-xs font-black text-white">{value}</span>
  </div>
);

const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
  </svg>
);
