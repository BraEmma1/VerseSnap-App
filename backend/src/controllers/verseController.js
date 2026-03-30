import { detectVerses } from '../services/verseDetectionService.js';
import { fetchTranslations } from '../services/bibleApiService.js';

/**
 * Endpoint to detect verses from OCR text
 * POST /api/verse/detect-verse
 */
const detectVerseController = (req, res, next) => {
  try {
    const { text } = req.body;
    
    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid text is required in the body' });
    }

    // Pass the text to our detection service
    const { cleanedText, detectedReferences } = detectVerses(text);
    
    // Return structured JSON
    res.status(200).json({
      success: true,
      cleanedText,
      detectedReferences
    });
  } catch (err) {
    next(err); // Pass error to global errorHandler
  }
};

/**
 * Endpoint to fetch Bible translations for multiple confirmed verses
 * POST /api/verse/get-verses
 */
const getVersesController = async (req, res, next) => {
  try {
    const { references } = req.body;

    // Validate input
    if (!references || !Array.isArray(references) || references.length === 0) {
      return res.status(400).json({ success: false, error: 'An array of verse references is required' });
    }

    // Await all external API fetches in parallel for performance
    const versePromises = references.map(reference => fetchTranslations(reference));
    const versesData = await Promise.all(versePromises);

    // Return structured JSON
    res.status(200).json({
      success: true,
      data: versesData
    });
  } catch (err) {
    next(err); // Pass error to global errorHandler
  }
};

export {
  detectVerseController,
  getVersesController
};
