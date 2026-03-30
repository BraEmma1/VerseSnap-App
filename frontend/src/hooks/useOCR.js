import { useState } from 'react';
import api from '../services/api';

export const useOCR = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');

  const processImage = async (imageFileOrBlob) => {
    setLoading(true);
    setError(null);
    setText('');
    
    try {
      const formData = new FormData();
      formData.append('image', imageFileOrBlob);
      
      const response = await api.post('/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        const resultText = response.data.extractedText || response.data.text || '';
        setText(resultText);
        return resultText;
      } else {
        throw new Error(response.data.error || 'Failed to extract text');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error communicating with OCR service';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { processImage, loading, error, text };
};
