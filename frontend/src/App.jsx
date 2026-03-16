import React, { useState } from 'react';
import axios from 'axios';
import DocumentUpload from './components/DocumentUpload';
import LiveCamera from './components/LiveCamera';
import StatusDashboard from './components/StatusDashboard';
import { Loader2, ShieldCheck, User, AlertTriangle } from 'lucide-react';

function App() {
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [providedName, setProvidedName] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!idFile || !selfieFile || !providedName) {
      setError("Please complete all steps before verifying.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("id_card_image", idFile);
    formData.append("selfie_image", selfieFile);
    formData.append("provided_name", providedName);

    try {
      const response = await axios.post('http://localhost:8000/api/kyc/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to communicate with the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIdFile(null);
    setSelfieFile(null);
    setSelfiePreview(null);
    setProvidedName("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-primary-600 text-white p-2 rounded-lg shadow-sm w-10 h-10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Autonomous KYC</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Progress / Context Banner */}
          <div className="bg-slate-900 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Customer Verification</h2>
            <p className="text-slate-300">Complete the steps below to securely verify your identity.</p>
          </div>

          <div className="p-8">
            {!result ? (
              <div className="space-y-12">
                
                {/* Step 0: Basic Info */}
                <div className="w-full">
                   <h3 className="text-lg font-medium text-slate-800 mb-4">Step 0: Basic Information</h3>
                   <div className="space-y-3">
                     <label className="block text-sm font-medium text-slate-700">Legal Name</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          className="pl-10 w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                          placeholder="John Doe"
                          value={providedName}
                          onChange={(e) => setProvidedName(e.target.value)}
                        />
                     </div>
                   </div>
                </div>

                <div className="block h-px bg-slate-100" />

                {/* Step 1: Document Upload */}
                <DocumentUpload file={idFile} onFileSelect={setIdFile} />

                <div className="block h-px bg-slate-100" />

                {/* Step 2: Live Camera */}
                <LiveCamera 
                  capturedImage={selfiePreview} 
                  onCapture={(file, previewUrl) => {
                    setSelfieFile(file);
                    setSelfiePreview(previewUrl);
                  }} 
                />

                {/* Error Banner */}
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3">
                     <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                     <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !idFile || !selfieFile || !providedName}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Identity'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <StatusDashboard result={result} onReset={handleReset} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
