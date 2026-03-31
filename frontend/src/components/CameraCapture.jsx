import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onCapture, isProcessing }) => {
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(''); // 'scanning', 'found', ''
  const scanIntervalRef = useRef(null);

  const stopScanning = useCallback(() => {
    setIsAutoScanning(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }, []);

  const captureFrame = useCallback(async () => {
    if (!webcamRef.current || isProcessing) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Fast Path: Check TextDetector
    if ('TextDetector' in window) {
      try {
        const img = new Image();
        img.src = imageSrc;
        await new Promise(resolve => { img.onload = resolve; });
        
        const detector = new window.TextDetector();
        const detectedText = await detector.detect(img);
        
        if (detectedText.length > 0) {
          setScanStatus('found');
          stopScanning();
          fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => onCapture(blob, true));
          return;
        }
      } catch (err) {
        console.warn("TextDetector failed or not fully supported", err);
        // Continue to fallback
      }
    }

    // Slow Path Fallback: Send to backend every tick
    // Only send if we are actively scanning (not stopped)
    if (scanIntervalRef.current) {
       fetch(imageSrc)
         .then(res => res.blob())
         .then(blob => onCapture(blob, true));
    }
      
  }, [onCapture, isProcessing, stopScanning]);

  const startScanning = useCallback(() => {
    setIsAutoScanning(true);
    setScanStatus('scanning');
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    scanIntervalRef.current = setInterval(() => {
      captureFrame();
    }, 2500); // 2.5 seconds interval for fallback polling
  }, [captureFrame]);

  useEffect(() => {
    return () => stopScanning();
  }, [stopScanning]);

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    setScanStatus('');
    setTimeout(() => {
      startScanning();
    }, 1000); // Give camera 1 sec to warm up before scanning begins
  };

  const handleCloseCamera = () => {
    stopScanning();
    setIsCameraOpen(false);
    setScanStatus('');
  };

  const manualCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => onCapture(blob, false));
    }
    handleCloseCamera();
  }, [onCapture]);

  if (!isCameraOpen) {
    return (
      <button className="btn camera-btn" onClick={handleOpenCamera}>
        Open Auto-Scanner (Camera)
      </button>
    );
  }

  return (
    <div className="camera-container">
      <div className="webcam-wrapper">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam-view"
          videoConstraints={{ facingMode: "environment" }}
        />
        {isAutoScanning && scanStatus === 'scanning' && (
           <div className="scanning-overlay">
              <div className="scan-line"></div>
              <div className="scan-text">Scanning for verses...</div>
           </div>
        )}
        {scanStatus === 'found' && (
           <div className="scanning-overlay success">
              <div className="scan-text">Text Detected! Analyzing...</div>
           </div>
        )}
      </div>
      <div className="camera-controls">
        <button className="btn capture-btn" onClick={manualCapture}>Manual Capture</button>
        <button className="btn stop-btn" onClick={handleCloseCamera}>Cancel</button>
      </div>
    </div>
  );
};

export default CameraCapture;
