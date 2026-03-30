/**
 * Verse Detection Service
 * Extracts Bible references from a given text string.
 */

// Helper: Normalizes common book abbreviation misreads
const normalizeBookNames = (text) => {
  const bookMap = {
    '\\b(?:Jn|Jno|Jhn)\\b': 'John',
    '\\b(?:Gen|Ge)\\b': 'Genesis',
    '\\b(?:Ex|Exo)\\b': 'Exodus',
    '\\b(?:Lev|Le)\\b': 'Leviticus',
    '\\b(?:Num|Nu)\\b': 'Numbers',
    '\\b(?:Deut|De)\\b': 'Deuteronomy',
    '\\b(?:Matt|Mt)\\b': 'Matthew',
    '\\b(?:Mk|Mr|Mrk)\\b': 'Mark',
    '\\b(?:Lk|Luk)\\b': 'Luke',
    '\\b(?:Rom|Ro)\\b': 'Romans',
    '\\b(?:Cor|Co)\\b': 'Corinthians',
    '\\b(?:Rev|Re)\\b': 'Revelation',
    '\\b(?:Ps|Psa|Psalms?)\\b': 'Psalms',
    '\\b(?:Prov?|Pr)\\b': 'Proverbs',
    '\\b(?:Isa|Is)\\b': 'Isaiah',
    '\\b(?:Jer|Je)\\b': 'Jeremiah',
    '\\b(?:Ezek|Eze)\\b': 'Ezekiel',
    '\\b(?:Dan|Da)\\b': 'Daniel',
    '\\b(?:Hos|Ho)\\b': 'Hosea',
    '\\b(?:Heb)\\b': 'Hebrews',
    '\\b(?:Eph)\\b': 'Ephesians',
    '\\b(?:Phil)\\b': 'Philippians',
    '\\b(?:Col)\\b': 'Colossians',
    '\\b(?:Thess)\\b': 'Thessalonians',
    '\\b(?:Tim)\\b': 'Timothy',
    '\\b(?:Tit)\\b': 'Titus',
    '\\b(?:Philem)\\b': 'Philemon',
    '\\b(?:Pet)\\b': 'Peter',
    '\\b(?:Sam)\\b': 'Samuel',
    '\\b(?:Kgs|Ki)\\b': 'Kings',
    '\\b(?:Chron|Chr)\\b': 'Chronicles',
  };

  let normalizedText = text;
  for (const [pattern, fullName] of Object.entries(bookMap)) {
    const regex = new RegExp(pattern, 'gi');
    normalizedText = normalizedText.replace(regex, fullName);
  }
  return normalizedText;
};

// Helper: Replaces spaces between chapter and verse with a colon (e.g. "John 3 16" -> "John 3:16")
const fixChapterVerseSpacing = (text) => {
  // Looks for word(s) followed by two digit blocks separated by a space
  return text.replace(/(?:[1-3]\s+)?[a-zA-Z]+\s+(\d+)\s+(\d+(?:-\d+)?)/gi, (match) => {
    // Replace the final space before the verse numbers with a colon
    return match.replace(/\s+(\d+(?:-\d+)?)$/, ':$1');
  });
};

// Helper: Top-level cleaner combining formatting actions
const cleanupText = (text) => {
  if (!text) return "";
  let cleaned = text.replace(/[\r\n\t]+/g, ' '); // remove newlines/tabs
  cleaned = normalizeBookNames(cleaned);
  cleaned = fixChapterVerseSpacing(cleaned);
  // remove any extra spacing leftover
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
  return cleaned;
};

export const detectVerses = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return { cleanedText: '', detectedReferences: [] };
  }

  // 1. Postprocess OCR text
  const cleanedText = cleanupText(rawText);

  // 2. Safely extract references using regex
  // Matches "John 3:16", "1 Corinthians 13:4-7", "Song of Solomon 2:1", etc.
  const regex = /((?:[1-3]\s+)?[A-Z][a-z]+\s+(?:of\s+[A-Z][a-z]+\s+)?\d+:\d+(?:-\d+)?)/gi;
  const matches = cleanedText.match(regex);
  
  // 3. Format and deduplicate matches
  const detectedReferences = matches ? [...new Set(matches)].map(ref => {
    // Title case formatting (e.g., "john 3:16" -> "John 3:16")
    return ref.split(' ').map(word => {
      if (word.match(/^\d+$/)) return word; // Skip standalone numbers (1, 2)
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }) : [];
  
  return { cleanedText, detectedReferences };
};
