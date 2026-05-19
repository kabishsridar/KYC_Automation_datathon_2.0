"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Smartphone,
  QrCode,
  IndianRupee,
  User,
  Shield,
  Globe,
  X,
  Plus,
  ArrowRight
} from "lucide-react";
import { useFraudGuardian, FraudRiskReport } from "../../components/FraudGuardian";

/**
 * DevFlow Voice Banking Kiosk - Professional Redesign
 * Enterprise-grade fintech interface for rural banking terminals.
 */

export default function VoiceBankingKiosk() {
  const [lang, setLang] = useState("en-US"); // en-US | ta-IN
  const [step, setStep] = useState("home");
  const [transactionData, setTransactionData] = useState({ amount: 0, receiver: "", type: "" });
  const [pin, setPin] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  
  const recognitionRef = useRef(null);

  // --- Voice Engine (TTS) ---
  const speak = useCallback((textEn, textTa) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    if (step === "pin") return;

    const text = lang === "en-US" ? textEn : textTa;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; 
    window.speechSynthesis.speak(utterance);
  }, [lang, step]);

  // --- Voice Control (STT) ---
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = lang;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setLastTranscript(transcript);
        processVoiceCommand(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [lang]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setLastTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const processVoiceCommand = (cmd) => {
    if (step === "home") {
      if (cmd.includes("send") || cmd.includes("பணம் அனுப்பு")) startSendFlow();
      if (cmd.includes("deposit") || cmd.includes("பணம் வை")) startDepositFlow();
      if (cmd.includes("balance") || cmd.includes("இருப்பு")) showBalance();
      if (cmd.includes("history") || cmd.includes("வரலாறு")) showHistory();
    }
  };

  const startSendFlow = () => {
    setStep("send_step_1");
    speak("Press Send Money to transfer funds.", "பணம் அனுப்ப 'Send Money' பொத்தானை அழுத்தவும்.");
  };

  const startDepositFlow = () => {
    setStep("deposit_1");
    speak("Deposit your cash at the kiosk.", "பணத்தை கியோஸ்க் மையத்தில் வை.");
  };

  const showBalance = () => {
    setStep("balance");
    speak("Your current balance is 12,450 Rupees.", "உங்கள் தற்போதைய இருப்பு 12,450 ரூபாய்.");
  };

  const showHistory = () => {
    setStep("history");
    speak("Here are your recent transactions.", "இவை உங்கள் சமீபத்திய பரிவர்த்தனைகள்.");
  };

  const handleSendAmount = (amt) => {
    setTransactionData(prev => ({ ...prev, amount: amt, type: "SEND" }));
    setStep("confirm");
    speak("Please confirm the transaction.", "பரிவர்த்தனையை உறுதிப்படுத்தவும்.");
  };

  const guardianReport = useFraudGuardian(step === "confirm" ? transactionData : null);

  const confirmTransaction = () => {
    if (guardianReport.status === "BLOCKED") {
      speak("Transaction blocked by Fraud Guardian.", "மோசடி பாதுகாப்பு காரணத்தால் பரிவர்த்தனை தடுக்கப்பட்டது.");
      return;
    }
    setStep("pin");
  };

  const finalizeTransaction = () => {
    setStep("success");
    speak("Your transaction was successful.", "உங்கள் பரிவர்த்தனை வெற்றிகரமாக முடிந்தது.");
  };

  useEffect(() => {
    if (step === "home") {
      speak("Welcome. Choose a service.", "வரவேற்கிறோம். ஒரு சேவையை தேர்வு செய்யவும்.");
    }
  }, [step, lang]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-[#0EA5A4]/30">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col min-h-screen">
        
        {/* Professional Header */}
        <header className="flex items-center justify-between mb-12 border-b border-[#1F2937] pb-8 shrink-0">
           <div className="flex items-center gap-6">
              <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
              </Link>
              <div className="h-4 w-px bg-[#1F2937]" />
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none mb-1 uppercase">DevFlow <span className="text-[#0EA5A4]">Voice Bank</span></h1>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Village Banking Terminal • Chennai Hub #01</div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              {/* Voice Indicator */}
              <div className="px-4 py-2 rounded-full bg-[#111827] border border-[#1F2937] flex items-center gap-3">
                 <div className="flex gap-1 h-3 items-center">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-1 rounded-full bg-[#0EA5A4] transition-all duration-300 ${isListening ? "animate-pulse h-3" : "h-1"}`} />
                    ))}
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                   {isListening ? "Listening..." : "Voice Assistant Active"}
                 </span>
                 <button 
                  onClick={toggleListen}
                  className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isListening ? "bg-rose-500 text-white" : "bg-[#1F2937] text-[#0EA5A4] hover:bg-[#2D3A4F]"}`}
                 >
                   {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                 </button>
              </div>

              <button 
                onClick={() => setLang(lang === "en-US" ? "ta-IN" : "en-US")}
                className="px-5 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#1F2937] transition-all flex items-center gap-2"
              >
                 <Globe className="w-4 h-4 text-[#0EA5A4]" />
                 {lang === "en-US" ? "TAMIL" : "ENGLISH"}
              </button>
           </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 flex flex-col">
          
          {/* --- HOME SCREEN --- */}
          {step === "home" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white mb-2">
                     {lang === "en-US" ? "Choose a Banking Service" : "ஒரு வங்கி சேவையைத் தேர்ந்தெடுக்கவும்"}
                  </h2>
                  <p className="text-slate-500 font-medium">
                     {lang === "en-US" ? "Select a service below or use voice commands to proceed." : "கீழே ஒரு சேவையைத் தேர்ந்தெடுக்கவும் அல்லது தொடர குரல் கட்டளைகளைப் பயன்படுத்தவும்."}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ServiceCard 
                    icon={<Send className="w-6 h-6" />} 
                    title="Send Money" 
                    subtitle="Transfer to any bank"
                    titleTa="பணம் அனுப்ப"
                    onClick={startSendFlow}
                    lang={lang}
                    accent="#0EA5A4"
                  />
                  <ServiceCard 
                    icon={<Plus className="w-6 h-6" />} 
                    title="Deposit Cash" 
                    subtitle="Add funds to a/c"
                    titleTa="பணம் வை"
                    onClick={startDepositFlow}
                    lang={lang}
                    accent="#10B981"
                  />
                  <ServiceCard 
                    icon={<Wallet className="w-6 h-6" />} 
                    title="Check Balance" 
                    subtitle="View savings"
                    titleTa="இருப்பு பார்க்க"
                    onClick={showBalance}
                    lang={lang}
                    accent="#F59E0B"
                  />
                  <ServiceCard 
                    icon={<Clock className="w-6 h-6" />} 
                    title="Transactions" 
                    subtitle="Payment history"
                    titleTa="வரலாறு"
                    onClick={showHistory}
                    lang={lang}
                    accent="#6366F1"
                  />
               </div>

               {/* Stats / Info Row */}
               <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937]">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Savings Account</div>
                    <div className="text-2xl font-bold text-white tracking-tight">₹12,450.00</div>
                  </div>
                  <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937]">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fraud Guardian</div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold text-white">Active Protection</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[#111827] to-[#0F172A] border border-[#1F2937] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Terminal ID</div>
                      <div className="text-xs font-bold text-white tracking-widest">K08-TN01</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center">
                       <Smartphone className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* --- SEND MONEY FLOWS --- */}
          {step.startsWith("send_") && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {lang === "en-US" ? "Send Money" : "பணம் அனுப்ப"}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Follow the instructions to transfer funds</p>
                  </div>
                  <button onClick={() => setStep("home")} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
               </div>

               {step === "send_step_1" && (
                 <div className="space-y-4">
                    <OptionRow icon={<IndianRupee className="w-5 h-5" />} label="Bank Account" desc="IMPS / NEFT Transfer" onClick={() => setStep("send_step_2")} />
                    <OptionRow icon={<Smartphone className="w-5 h-5" />} label="UPI ID" desc="Pay to any VPA handle" onClick={() => setStep("send_step_2")} />
                    <OptionRow icon={<QrCode className="w-5 h-5" />} label="Scan QR" desc="Scan merchant QR codes" onClick={() => setStep("send_step_2")} />
                 </div>
               )}

               {step === "send_step_2" && (
                 <div className="space-y-6">
                    <div className="p-8 rounded-xl bg-[#111827] border border-[#1F2937]">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Receiver Detail</label>
                       <input 
                         autoFocus
                         type="text"
                         placeholder="A/C Number or UPI ID"
                         className="w-full bg-transparent border-none text-2xl font-bold text-white outline-none placeholder:text-slate-800"
                         onChange={(e) => setTransactionData(p => ({ ...p, receiver: e.target.value }))}
                       />
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep("send_step_1")} className="px-8 py-4 rounded-xl border border-[#1F2937] text-sm font-bold uppercase">Back</button>
                      <button 
                        disabled={!transactionData.receiver}
                        onClick={() => setStep("send_step_3")}
                        className="flex-1 py-4 rounded-xl bg-[#0EA5A4] text-white font-bold hover:bg-[#0C8F8E] transition-all disabled:opacity-20"
                      >
                         Continue
                      </button>
                    </div>
                 </div>
               )}

               {step === "send_step_3" && (
                 <div className="space-y-6">
                    <div className="p-8 rounded-xl bg-[#111827] border border-[#1F2937]">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Enter Amount</label>
                       <div className="flex items-center gap-4 text-white">
                          <span className="text-4xl font-bold text-[#0EA5A4]">₹</span>
                          <input 
                            type="number"
                            placeholder="0.00"
                            className="flex-1 bg-transparent border-none text-4xl font-bold outline-none tabular-nums"
                            onChange={(e) => setTransactionData(p => ({ ...p, amount: Number(e.target.value) }))}
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       {[500, 1000, 2000, 5000].map(val => (
                         <button key={val} onClick={() => handleSendAmount(val)} className="py-3 rounded-xl border border-[#1F2937] bg-[#111827] text-sm font-bold text-white hover:border-[#0EA5A4] transition-colors hover:bg-slate-800">₹{val}</button>
                       ))}
                    </div>
                    <button 
                      onClick={() => handleSendAmount(transactionData.amount)}
                      className="w-full py-4 rounded-xl bg-[#0EA5A4] text-white font-bold hover:bg-[#0C8F8E] transition-all"
                    >
                       Confirm Amount
                    </button>
                 </div>
               )}
            </div>
          )}

          {/* --- CONFIRMATION --- */}
          {step === "confirm" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-7 space-y-6">
                  <div className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden p-6">
                     <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#1F2937]">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Review Order</h2>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction v2.1</span>
                     </div>
                     <div className="space-y-8">
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">To Receiver</div>
                              <div className="text-2xl font-bold text-white leading-tight">{transactionData.receiver || "Customer #129"}</div>
                           </div>
                           <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                             <User className="w-6 h-6" />
                           </div>
                        </div>
                        <div className="p-6 rounded-xl bg-[#0F172A] border border-[#1F2937]">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Amount to Pay</div>
                          <div className="text-4xl font-bold text-white tabular-nums">₹{transactionData.amount.toLocaleString()}</div>
                        </div>
                     </div>
                  </div>
                  
                  <button 
                    onClick={confirmTransaction}
                    className="w-full py-5 rounded-xl bg-[#0EA5A4] text-white font-bold text-lg hover:bg-[#0C8F8E] transition-all shadow-xl shadow-[#0EA5A4]/10"
                  >
                    Confirm & Proceed
                  </button>
                  <button onClick={() => setStep("send_step_3")} className="w-full text-xs font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Modify Request</button>
               </div>

               <div className="lg:col-span-5">
                  <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6 h-full">
                     <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-4 h-4 text-[#0EA5A4]" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-Time Security Check</span>
                     </div>
                     <FraudRiskReport report={guardianReport} />
                  </div>
               </div>
            </div>
          )}

          {/* --- PIN --- */}
          {step === "pin" && (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-sm mx-auto w-full py-12 flex-1 flex flex-col justify-center">
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                    <Lock className="w-6 h-6 text-rose-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">Security PIN</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Authorize via village terminal</p>
               </div>

               <div className="bg-[#111827] p-8 rounded-2xl border border-[#1F2937] shadow-2xl space-y-8">
                  <div className="flex gap-4 justify-center py-2">
                     {[0,1,2,3].map(i => (
                       <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${pin.length > i ? "bg-[#0EA5A4] scale-125" : "bg-slate-700"}`} />
                     ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     {[1,2,3,4,5,6,7,8,9].map(n => (
                       <button key={n} onClick={() => setPin(p => (p.length < 4 ? p + n : p))} className="h-16 rounded-xl border border-[#1F2937] text-xl font-bold text-white hover:bg-[#1F2937] transition-colors">{n}</button>
                     ))}
                     <button onClick={() => setPin("")} className="h-16 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/5 font-bold">CLEAR</button>
                     <button onClick={() => setPin(p => p + "0")} className="h-16 rounded-xl border border-[#1F2937] text-xl font-bold text-white hover:bg-[#1F2937] transition-colors">0</button>
                     <button 
                       disabled={pin.length < 4}
                       onClick={finalizeTransaction}
                       className="h-16 rounded-xl bg-[#0EA5A4] text-white flex items-center justify-center disabled:opacity-20 hover:bg-[#0C8F8E] transition-all"
                     >
                        <ArrowRight className="w-7 h-7" />
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* --- SUCCESS --- */}
          {step === "success" && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000">
               <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 relative">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-10" />
               </div>
               <h2 className="text-2xl font-bold text-white mb-1">Transaction Successful</h2>
               <p className="text-slate-500 mb-10 text-center text-sm font-medium">Payment of ₹{transactionData.amount.toLocaleString()} processed.<br/><span className="text-[10px] font-bold uppercase tracking-widest mt-2 block">REF: DF-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span></p>
               
               <div className="flex gap-4">
                  <button onClick={() => setStep("home")} className="px-10 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all">Continue Tasks</button>
               </div>
            </div>
          )}

          {/* --- DEPOSIT --- */}
          {step.startsWith("deposit_") && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto py-12 flex-1 flex flex-col justify-center">
               <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">Deposit Center</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Self-service cash integration</p>
               </div>

               {step === "deposit_1" && (
                 <div className="space-y-6">
                    <div className="p-10 bg-[#111827] border border-[#1F2937] rounded-xl flex flex-col items-center gap-6">
                       <QrCode className="w-40 h-40 text-white" />
                       <div className="text-center">
                          <p className="text-[#0EA5A4] text-xs font-bold uppercase tracking-widest leading-relaxed">Deposit Authentication Code</p>
                       </div>
                    </div>
                    <button onClick={() => setStep("deposit_2")} className="w-full py-4 rounded-xl bg-[#0EA5A4] text-white font-bold text-lg">Next: Amount</button>
                    <button onClick={() => setStep("home")} className="w-full text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Abort Deposit</button>
                 </div>
               )}

               {step === "deposit_2" && (
                 <div className="space-y-8">
                    <div className="p-8 rounded-xl bg-[#111827] border border-[#1F2937]">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Cash Value</label>
                       <div className="flex items-center gap-4 text-white">
                          <IndianRupee className="w-8 h-8 text-[#0EA5A4]" />
                          <input 
                            type="number"
                            placeholder="0.00"
                            className="flex-1 bg-transparent border-none text-5xl font-bold outline-none tabular-nums"
                            onChange={(e) => setTransactionData(p => ({ ...p, amount: Number(e.target.value) }))}
                          />
                       </div>
                    </div>
                    <button onClick={finalizeTransaction} className="w-full py-4 rounded-xl bg-[#0EA5A4] text-white font-bold text-lg">Confirm Deposit</button>
                 </div>
               )}
            </div>
          )}

          {/* --- BALANCE --- */}
          {step === "balance" && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 py-12">
               <div className="text-center mb-6">
                  <span className="text-[10px] font-bold text-[#0EA5A4] uppercase tracking-[0.3em]">Account 4291</span>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Available Funds</h2>
               </div>
               
               <div className="text-8xl font-bold text-white tracking-tighter mb-10 tabular-nums">
                 <span className="text-[#0EA5A4] text-3xl font-medium align-top mr-2">₹</span>12,450
               </div>

               <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-between w-full max-w-sm mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Status</div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">SECURE</div>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-[#1F2937]" />
                  <div className="text-right">
                    <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Updated</div>
                    <div className="text-xs font-bold text-white">Just now</div>
                  </div>
               </div>

               <button onClick={() => setStep("home")} className="px-12 py-3 rounded-xl border border-[#1F2937] bg-white text-black font-bold uppercase tracking-wider text-xs">Close Dashboard</button>
            </div>
          )}

          {/* --- HISTORY --- */}
          {step === "history" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col flex-1 pb-8">
               <div className="flex justify-between items-center mb-8 shrink-0">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight italic">Records</h2>
                  <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">Audited Access</div>
               </div>

               <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <HistoryItem label="Kiosk Cash Load" val="+₹5,000.00" date="Today, 02:45 PM" type="DEP" />
                  <HistoryItem label="Ref: RTGS-92812" val="-₹1,200.00" date="Yesterday, 11:30 AM" type="SEND" />
                  <HistoryItem label="Transfer to ID: 821" val="-₹3,500.00" date="14 Mar 2026" type="SEND" />
                  <HistoryItem label="Bill Payment #901" val="-₹499.00" date="12 Mar 2026" type="SEND" />
                  <HistoryItem label="Kiosk Cash Load" val="+₹800.00" date="10 Mar 2026" type="DEP" />
                  <HistoryItem label="Direct Benefit Transfer" val="+₹12,000.00" date="05 Mar 2026" type="REC" />
               </div>

               <button onClick={() => setStep("home")} className="mt-8 shrink-0 w-full py-4 rounded-xl bg-[#111827] border border-[#1F2937] text-white font-bold text-xs uppercase tracking-widest">Back to Front</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// --- REFINED SUB-COMPONENTS ---

const ServiceCard = ({ icon, title, subtitle, titleTa, onClick, lang, accent }) => (
  <button 
    onClick={onClick}
    className="bg-[#111827] border border-[#1F2937] rounded-xl p-5 text-left transition-all hover:bg-[#1E293B] hover:translate-y-[-2px] group relative overflow-hidden h-full flex flex-col items-start"
  >
     <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center mb-6 group-hover:bg-[#0EA5A4] group-hover:text-black transition-all shrink-0" style={{ color: accent }}>
        {icon}
     </div>
     <div className="mt-auto items-start text-left">
        <h3 className="text-base font-bold text-white mb-0.5">{lang === "en-US" ? title : titleTa}</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === "en-US" ? subtitle : title}</p>
     </div>
  </button>
);

const OptionRow = ({ icon, label, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-5 p-5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#0EA5A4] transition-all group"
  >
     <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#0EA5A4] group-hover:bg-[#0EA5A4] group-hover:text-black transition-all">
        {icon}
     </div>
     <div className="text-left flex-1 min-w-0">
        <div className="text-sm font-bold text-white uppercase tracking-tight">{label}</div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{desc}</div>
     </div>
     <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors shrink-0" />
  </button>
);

const HistoryItem = ({ label, val, date, type }) => (
  <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-between hover:bg-[#1F293B] transition-colors">
     <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type === "DEP" || type === "REC" ? "bg-emerald-500/10 text-emerald-500" : "bg-[#0F172A] text-slate-500"}`}>
           {type === "DEP" || type === "REC" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
           <div className="text-xs font-bold text-white uppercase tracking-tight">{label}</div>
           <div className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">{date}</div>
        </div>
     </div>
     <div className={`text-sm font-bold tabular-nums ${type === "DEP" || type === "REC" ? "text-emerald-500" : "text-white"}`}>
        {val}
     </div>
  </div>
);
