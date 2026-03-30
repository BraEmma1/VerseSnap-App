import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 data URI to a Blob so we can send as multipart/form-data
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => onCapture(blob));
    }
    setIsCameraOpen(false);
  }, [webcamRef, onCapture]);

  if (!isCameraOpen) {
    return (
      <button className="btn camera-btn" onClick={() => setIsCameraOpen(true)}>
        Open Camera
      </button>
    );
  }

  return (
    <div className="camera-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="webcam-view"
        videoConstraints={{ facingMode: "environment" }}
      />
      <div className="camera-controls">
        <button className="btn capture-btn" onClick={capture}>Take Photo</button>
        <button className="btn stop-btn" onClick={() => setIsCameraOpen(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default CameraCapture;
