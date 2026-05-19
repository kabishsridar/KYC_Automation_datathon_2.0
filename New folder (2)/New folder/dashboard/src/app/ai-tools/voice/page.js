"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Mic, MicOff, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Headphones } from "lucide-react";

export default function KycVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-US"); // en-US, ta-IN, hi-IN
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("Hello. I am the DevFlow KYC Voice Assistant. How can I help you start verification?");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          processQuery(transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error === "no-speech") {
          setResponse("I didn’t catch that. Please try again.");
        } else if (event.error === "not-allowed") {
          setResponse("Microphone access is blocked. Please allow microphone permissions in your browser.");
        } else {
          setResponse("Voice input stopped.");
        }
        setIsListening(false);
      };
    }
  }, [transcript, isListening, language]);

  const speakText = (text) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    setTranscript("");
    setResponse("");
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      setResponse("Speech Recognition is not supported in this browser.");
    }
  };

  const processQuery = (query) => {
    if (!query) return;
    const lower = query.toLowerCase();

    setTimeout(() => {
      let aiResponse =
        "I can help with KYC verification: document upload, face verification, and next steps. Ask: “How do I upload my Aadhaar?” or “Why is my case pending review?”";

      if (lower.includes("start") || lower.includes("begin") || lower.includes("kyc")) {
        aiResponse =
          "To start KYC verification: enter your name, phone number, and email. Then upload a supported ID document, capture a selfie, and review the risk score result.";
      } else if (lower.includes("upload") || lower.includes("document") || lower.includes("aadhaar") || lower.includes("pan") || lower.includes("passport") || lower.includes("license")) {
        aiResponse =
          "For document upload: select the document type (Aadhaar, PAN, Passport, or Driving License), then upload a clear scan. Make sure the text is readable and the image is not cropped.";
      } else if (lower.includes("selfie") || lower.includes("face") || lower.includes("match")) {
        aiResponse =
          "For face verification: capture a selfie in good lighting. Keep your face centered and avoid glare. The system compares your selfie to the ID photo to compute a face match confidence score.";
      } else if (lower.includes("pending") || lower.includes("review")) {
        aiResponse =
          "If your status is pending officer review, it usually means the risk score is in the medium range or some checks need manual validation. You may be asked for additional documents.";
      } else if (lower.includes("rejected") || lower.includes("fraud")) {
        aiResponse =
          "If your case is rejected or flagged as fraud alert, it indicates high-risk signals such as low document authenticity confidence or weak identity match. A compliance officer can review the case for final resolution.";
      }

      setResponse(aiResponse);
      speakText(aiResponse);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-1000 ${
          isListening ? "bg-rose-500 w-96 h-96 opacity-30" : isSpeaking ? "bg-teal-500 w-80 h-80 opacity-25" : "bg-transparent w-40 h-40 opacity-0"
        }`} />
      </div>

      <div className="max-w-3xl w-full z-10">
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="text-slate-300 hover:text-white inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="en-US">English</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
            </select>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
            <Headphones className="w-9 h-9 text-teal-300" />
            DevFlow KYC Voice Assistant
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
            Voice-guided help for document upload, face verification, and understanding verification outcomes.
          </p>
        </div>

        <div className="bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col p-8 md:p-12">
          <div className="min-h-[160px] flex flex-col justify-center text-center space-y-6 mb-10">
            {transcript && <div className="text-xl font-medium text-slate-400 italic">“{transcript}”</div>}

            {response && <div className="text-2xl md:text-3xl font-bold text-slate-100 leading-snug">{response}</div>}

            {!transcript && !response && <div className="text-2xl font-bold text-slate-500">Listening…</div>}
          </div>

          <div className="flex justify-center relative mt-auto">
            <button
              onClick={toggleListen}
              className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 focus:outline-none ${
                isListening ? "bg-rose-600 text-white shadow-rose-600/40 scale-110" : "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30"
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10 animate-pulse" /> : <Mic className="w-12 h-12" />}
            </button>

            {isListening && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-rose-400 rounded-full animate-ping opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-rose-300 rounded-full animate-ping opacity-25" />
              </>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-bold">
            <Hint icon={<ShieldCheck className="w-4 h-4 text-teal-300" />} label="Ask about KYC steps" text="“How do I start verification?”" />
            <Hint icon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />} label="Ask about documents" text="“How do I upload PAN?”" />
            <Hint icon={<AlertTriangle className="w-4 h-4 text-rose-300" />} label="Ask about outcomes" text="“Why is my case pending review?”" />
          </div>

          <div className="mt-10 text-center flex justify-center gap-6 text-xs text-slate-400 font-black uppercase tracking-widest">
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Assist</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance Safe</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hint({ icon, label, text }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
        {icon}
      </div>
      <div className="text-slate-200 mt-2">{text}</div>
    </div>
  );
}
