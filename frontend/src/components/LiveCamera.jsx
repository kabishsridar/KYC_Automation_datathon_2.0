import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw } from 'lucide-react';

export default function LiveCamera({ onCapture, capturedImage }) {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Convert base64 to file
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        onCapture(file, imageSrc);
      });
  }, [webcamRef, onCapture]);

  const retake = () => {
    onCapture(null, null);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Step 2: Live Verification Face</h3>
      <p className="text-sm text-slate-600 mb-4">Please look directly at the camera and ensure your face is well-lit.</p>
      
      <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center shadow-inner">
        {!capturedImage ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              videoConstraints={{
                facingMode: "user"
              }}
              className="w-full h-full object-cover"
            />
            <button
              onClick={capture}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 rounded-full px-6 py-3 font-semibold shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>
          </>
        ) : (
          <>
            <img src={capturedImage} alt="Captured selfie" className="w-full h-full object-cover" />
            <button
              onClick={retake}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-slate-900 rounded-full px-6 py-3 font-semibold shadow-lg hover:bg-white transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retake Photo
            </button>
          </>
        )}
      </div>
    </div>
  );
}
