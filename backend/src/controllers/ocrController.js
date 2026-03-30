import { runOCR } from '../services/ocrService.js';
import { detectVerses } from '../services/verseDetectionService.js';
import fs from 'fs';

const handleOCR = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Invalid or missing image file.' });
  }

  try {
    // Process image and extract clean text
    const extractedText = await runOCR(req.file.path);

    // Always delete the original uploaded image to prevent disk flooding
    fs.unlink(req.file.path, err => {
      if (err) console.error('Failed to delete uploaded raw file:', err);
    });

    // Tap into detection service to parse exact Bible versifications
    const { detectedReferences } = detectVerses(extractedText);

    // Respond with the specific JSON format expected by frontend ResultsPage
    res.status(200).json({ 
      success: true, 
      extractedText,
      detectedReferences 
    });
    console.log(extractedText, detectedReferences);  
  } catch (err) {
    // If OCR fails, make sure raw uploaded file is deleted
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err); // Hand off to express global error handler (sends 500)
  }
};

export { handleOCR };