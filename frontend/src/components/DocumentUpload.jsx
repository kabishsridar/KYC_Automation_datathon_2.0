import React, { useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

export default function DocumentUpload({ onFileSelect, file }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Step 1: Upload ID Document</h3>
      <p className="text-sm text-slate-600 mb-4">Please upload a clear image of your Passport, Aadhaar, PAN, or Driving License.</p>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 bg-white'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-primary-500' : 'text-slate-400'}`} />
          <p className="text-slate-700 font-medium mb-1">Click or drag file to this area to upload</p>
          <p className="text-slate-500 text-sm">Supports JPG, PNG up to 10MB</p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              <File className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
