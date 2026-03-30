import { useState } from 'react';
import api from '../services/api';

export const useVerse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verses, setVerses] = useState([]);
  const [detectedReferences, setDetectedReferences] = useState([]);

  const analyzeText = async (text) => {
    setLoading(true);
    setError(null);
    setVerses([]);
    setDetectedReferences([]);
    
    try {
      // 1. Detect verses
      const detectResponse = await api.post('/verse/detect-verse', { text });
      
      if (!detectResponse.data.success) {
        throw new Error(detectResponse.data.error || 'Failed to detect verses');
      }
      
      const references = detectResponse.data.detectedReferences || [];
      setDetectedReferences(references);
      
      if (references.length === 0) {
        setLoading(false);
        return [];
      }
      
      // 2. Fetch translations for these references
      const getVersesResponse = await api.post('/verse/get-verses', { references });
      
      if (!getVersesResponse.data.success) {
        throw new Error(getVersesResponse.data.error || 'Failed to get verses');
      }
      
      const versesData = getVersesResponse.data.data;
      setVerses(versesData);
      
      return versesData;
    } catch (err) {
      console.error('Verse API Error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error processing verses';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeText, loading, error, verses, detectedReferences };
};
