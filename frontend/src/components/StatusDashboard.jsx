import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Shield, User, Calendar, FileText } from 'lucide-react';

export default function StatusDashboard({ result, onReset }) {
  if (!result) return null;

  const { risk_score, decision, extracted_data, face_match, liveness_status, message } = result;
  
  // Choose color theme based on risk score
  let theme = 'bg-green-50 text-green-700 border-green-200';
  let Icon = CheckCircle2;
  
  if (risk_score > 30) {
    theme = 'bg-yellow-50 text-yellow-700 border-yellow-200';
    Icon = AlertTriangle;
  }
  if (risk_score > 70) {
    theme = 'bg-red-50 text-red-700 border-red-200';
    Icon = XCircle;
  }

  return (
    <div className="w-full space-y-6">
      <div className={`p-6 rounded-2xl border ${theme} flex flex-col items-center justify-center text-center`}>
        <Icon className="w-16 h-16 mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">{decision}</h2>
        <p className="opacity-80 font-medium">Risk Score: {risk_score} / 100</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-500" />
          Verification Details
        </h3>
        
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <DetailCard icon={<User />} label="Extracted Name" value={extracted_data?.name || "Not found"} />
          <DetailCard icon={<Calendar />} label="Date of Birth" value={extracted_data?.dob || "Not found"} />
          <DetailCard icon={<FileText />} label="ID Number" value={extracted_data?.id_number || "Not found"} />
          
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
             <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Face Match</span>
             <span className={`font-semibold ${face_match ? 'text-green-600' : 'text-red-500'}`}>
               {face_match ? 'Successful' : 'Failed'}
             </span>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
             <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Liveness Check</span>
             <span className={`font-semibold ${liveness_status ? 'text-green-600' : 'text-red-500'}`}>
               {liveness_status ? 'Passed' : 'Failed'}
             </span>
          </div>
        </div>
        
        {message && (
          <div className="mt-4 p-4 bg-slate-100 rounded-xl border border-slate-200 text-sm text-slate-700">
            <strong>System Messages:</strong> {message}
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
      >
        Start New Verification
      </button>
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
      <div className="text-slate-400">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-0.5">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
    </div>
  );
}
