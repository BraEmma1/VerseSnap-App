import React, { useState } from 'react';
import CameraCapture from '../components/CameraCapture';
import ImageUpload from '../components/ImageUpload';
import VerseDisplay from '../components/VerseDisplay';
import { useOCR } from '../hooks/useOCR';
import { useVerse } from '../hooks/useVerse';
import '../App.css'; // Importing global CSS

const ResultsPage = () => {
  const { processImage, loading: ocrLoading, error: ocrError, text } = useOCR();
  const { analyzeText, loading: verseLoading, error: verseError, verses, detectedReferences } = useVerse();
  const [isSilentScan, setIsSilentScan] = useState(false);

  const handleImageInput = async (blob, isAutoScan = false) => {
    setIsSilentScan(isAutoScan);
    // 1. Process Image via OCR
    const extractedText = await processImage(blob);
    
    // 2. If text was extracted, send to Verse Service
    if (extractedText) {
      await analyzeText(extractedText);
    }
  };

  const isLoading = ocrLoading || verseLoading;
  const isError = ocrError || verseError;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>VerseSnap</h1>
        <p>Capture an image to detect Bible verses.</p>
      </header>

      <main className="main-content">
        <div className="capture-section">
          <CameraCapture onCapture={handleImageInput} isProcessing={isLoading} />
          <div className="divider">OR</div>
          <ImageUpload onUpload={handleImageInput} />
        </div>

        {isLoading && !isSilentScan && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{ocrLoading ? 'Extracting text from image...' : 'Finding Bible verses...'}</p>
          </div>
        )}

        {isError && (!isSilentScan || verseError) && (
          <div className="error-state">
            <p>{ocrError || verseError}</p>
          </div>
        )}

        {text && !isLoading && !isSilentScan && (
          <div className="ocr-result-section">
            <h3 className="section-title">Extracted Text:</h3>
            <p className="extracted-text">{text}</p>
          </div>
        )}

        {!isLoading && !isError && detectedReferences.length > 0 && verses.length === 0 && (
          <div className="no-verses-state">
            <p>References found: {detectedReferences.join(', ')}</p>
            <p>Fetching translations failed or returned no results.</p>
          </div>
        )}

        {!isLoading && !isError && verses && verses.length > 0 && (
          <VerseDisplay verses={verses} />
        )}
      </main>
    </div>
  );
};

export default ResultsPage;
