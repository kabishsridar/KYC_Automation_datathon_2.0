"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  ShieldCheck, 
  Scan, 
  UserCircle, 
  Fingerprint, 
  AlertOctagon, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Search,
  Activity,
  Layers,
  Camera,
  Cpu
} from "lucide-react";

/**
 * DevFlow Document Intelligence Engine
 * A central simulation engine for advanced document verification.
 */

export const useDocumentIntelligence = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState(null);

  const analyze = async (files, docType) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResult(null);

    const steps = [
      "Initializing AI Neural Engine...",
      "Performing High-Res OCR Extraction...",
      "Analyzing Document Authenticity (Watermarks/Holograms)...",
      "Running Pixel-Level Tamper Detection...",
      "Extracting Face Geometry from Identity...",
      "Analyzing Image Metadata & EXIF Traces...",
      "Checking Global Fraud Database for Patterns...",
      "Generating Cryptographic Verification Report..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisProgress(((i + 1) / steps.length) * 100);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    }

    // Advanced Simulation Logic
    const fileName = files[0]?.name || "document.jpg";
    const isSuspicious = fileName.toLowerCase().includes("edit") || fileName.toLowerCase().includes("mock");
    const isLowRes = fileName.toLowerCase().includes("small") || fileName.toLowerCase().includes("thumb");
    
    // Deterministic simulation based on filename for demo consistency
    const seed = fileName.length;
    const rand = (min, max, offset) => {
      const x = Math.sin(seed * 997 + offset * 173) * 10000;
      const r = x - Math.floor(x);
      return min + r * (max - min);
    };

    const docAuthScore = Math.round(isSuspicious ? rand(30, 50, 1) : rand(88, 98, 1));
    const tamperRiskScore = Math.round(isSuspicious ? rand(70, 95, 2) : rand(2, 12, 2));
    const identityConsistency = Math.round(rand(85, 99, 3));
    const faceMatchConfidence = Math.round(rand(82, 97, 4));
    const fraudPatternRisk = Math.round(isSuspicious ? rand(40, 65, 5) : rand(1, 8, 5));

    const extractedData = {
      name: fileName.toLowerCase().includes("rahul") ? "RAHUL SHARMA" : "AADARSH KUMAR",
      dob: "14-08-1996",
      idNumber: docType === "PAN Card" ? "ABCDE1234F" : docType === "Aadhaar" ? "XXXX-XXXX-3829" : "P1239845",
      address: "H-42, GREEN PARK, NEW DELHI, 110016",
      metadata: {
        software: isSuspicious ? "Adobe Photoshop 2024" : "iPhone 15 Pro",
        modified: isSuspicious ? "Yes" : "No",
        location: "28.5672° N, 77.2100° E"
      }
    };

    setResult({
      docType,
      docAuthScore,
      tamperRiskScore,
      identityConsistency,
      faceMatchConfidence,
      fraudPatternRisk,
      extractedData,
      status: (docAuthScore > 70 && tamperRiskScore < 30) ? "VERIFIED" : (docAuthScore < 40 || tamperRiskScore > 60) ? "REJECTED" : "FLAGGED"
    });
    setIsAnalyzing(false);
  };

  return { analyze, isAnalyzing, analysisProgress, result };
};

export const DocumentIntelligenceReport = ({ result }) => {
  if (!result) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "VERIFIED": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "REJECTED": return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      case "FLAGGED": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      default: return "text-slate-400 border-slate-700 bg-slate-900";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Summary */}
      <div className={`p-6 rounded-3xl border ${getStatusColor(result.status)} flex items-center justify-between shadow-2xl backdrop-blur-md`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-black/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Intelligence Status</div>
            <div className="text-2xl font-black tracking-tighter">{result.status}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Engine ID</div>
          <div className="font-mono text-xs opacity-70 font-bold">DF-INTEL-X900</div>
        </div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricBox 
          icon={<Search className="w-4 h-4 text-teal-400" />} 
          label="Doc Authenticity" 
          value={`${result.docAuthScore}%`} 
          desc="Template & Font Match"
          tone={result.docAuthScore > 80 ? "ok" : result.docAuthScore > 50 ? "warn" : "danger"}
        />
        <MetricBox 
          icon={<AlertOctagon className="w-4 h-4 text-rose-400" />} 
          label="Tamper Risk" 
          value={`${result.tamperRiskScore}%`} 
          desc="Pixel Manipulation"
          tone={result.tamperRiskScore < 20 ? "ok" : result.tamperRiskScore < 50 ? "warn" : "danger"}
        />
        <MetricBox 
          icon={<Layers className="w-4 h-4 text-indigo-400" />} 
          label="Cross-Doc Affinity" 
          value={`${result.identityConsistency}%`} 
          desc="Data Point Consistency"
          tone={result.identityConsistency > 85 ? "ok" : "warn"}
        />
        <MetricBox 
          icon={<UserCircle className="w-4 h-4 text-blue-400" />} 
          label="Face Extraction" 
          value={`${result.faceMatchConfidence}%`} 
          desc="Bio-Matching Confidence"
          tone={result.faceMatchConfidence > 80 ? "ok" : "warn"}
        />
        <MetricBox 
          icon={<Activity className="w-4 h-4 text-orange-400" />} 
          label="Fraud Pattern" 
          value={`${result.fraudPatternRisk}%`} 
          desc="Synthesis Detection"
          tone={result.fraudPatternRisk < 15 ? "ok" : result.fraudPatternRisk < 40 ? "warn" : "danger"}
        />
        <MetricBox 
          icon={<Cpu className="w-4 h-4 text-purple-400" />} 
          label="Metadata Analysis" 
          value={result.extractedData.metadata.modified === "Yes" ? "FLAG" : "CLEAN"} 
          desc={result.extractedData.metadata.software}
          tone={result.extractedData.metadata.modified === "Yes" ? "danger" : "ok"}
        />
      </div>

      {/* Extracted Intelligence */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <Scan className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">OCR Extraction Intelligence</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <DataPoint label="Captured Name" value={result.extractedData.name} />
          <DataPoint label="Date of Birth" value={result.extractedData.dob} />
          <DataPoint label="Primary ID Number" value={result.extractedData.idNumber} />
          <DataPoint label="Document Class" value={result.docType} />
          <div className="md:col-span-2">
            <DataPoint label="Verified Address" value={result.extractedData.address} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ icon, label, value, desc, tone }) => {
  const toneClasses = {
    ok: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    warn: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    danger: "border-rose-500/20 bg-rose-500/5 text-rose-400",
  };

  return (
    <div className={`p-4 rounded-2xl border ${toneClasses[tone]} group hover:bg-slate-900/40 transition-all duration-500`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-xl bg-black/20 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-2xl font-black tracking-tight font-mono">{value}</div>
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-0.5">{label}</div>
        <div className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">{desc}</div>
      </div>
    </div>
  );
};

const DataPoint = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
    <span className="text-sm font-bold text-white tracking-wide">{value}</span>
  </div>
);
