import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs';

/**
 * Clean up OCR text: remove random symbols, excessive spacing.
 */
const postProcessText = (text) => {
  // Collapse multiple spaces, tabs, and newlines into a single space
  let cleaned = text.replace(/[\r\n\t]+/g, ' ');
  // Remove non-alphanumeric noise, keeping colons, hyphens, etc for verse formatting
  cleaned = cleaned.replace(/[^a-zA-Z0-9\s:;,.-]/g, '');
  // Collapse redundant spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  return cleaned.trim();
};

export const runOCR = async (imagePath) => {
  const optimizedImagePath = `${imagePath}-optimized.png`;
  
  try {
    // 1. Preprocess the image using sharp for optimal OCR accuracy
    await sharp(imagePath)
      .resize({ width: 2000, withoutEnlargement: true }) // Scale down huge images to speed up OCR
      .grayscale() // Convert to grayscale to neutralize colored background noise
      .normalize() // Stretch contrast to make text pop
      .sharpen() // Sharpen character edges
      .threshold(128) // Binarize the image into pure black/white lines
      .toFile(optimizedImagePath);

    // 2. Run OCR on the pre-processed "optimized" image
    const { data: { text } } = await Tesseract.recognize(optimizedImagePath, 'eng', {
      logger: m => console.log(`[Tesseract] ${m.status} - ${(m.progress * 100).toFixed(0)}%`)
    });
    
    // 3. Clean up the extracted text of noise and bad spacing
    const cleanedText = postProcessText(text);
    
    // 4. Safely discard the optimized buffer image
    fs.unlink(optimizedImagePath, (err) => {
      if (err) console.error('Failed to delete optimized temp image:', err);
    });

    return cleanedText;
  } catch (err) {
    // Ensure we don't leave lingering optimized image files if it crashes midway
    if (fs.existsSync(optimizedImagePath)) {
      fs.unlinkSync(optimizedImagePath);
    }
    throw new Error('Robust OCR pipeline failed: ' + err.message);
  }
};
