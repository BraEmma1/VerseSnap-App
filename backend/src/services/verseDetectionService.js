/**
 * Verse Detection Service
 * Extracts Bible references from a given text string.
 * Optimized for speed and flexibility with dirty OCR text.
 */

// Dictionary mapping flexible representations and common OCR typos to standard book names.
const bookMap = {
  // New Testament
  'matt': 'Matthew', 'mat': 'Matthew', 'mt': 'Matthew', 'matthew': 'Matthew',
  'mark': 'Mark', 'mrk': 'Mark', 'mk': 'Mark', 'mr': 'Mark',
  'luke': 'Luke', 'luk': 'Luke', 'lk': 'Luke',
  'john': 'John', 'jhn': 'John', 'jn': 'John', 'jno': 'John',
  'acts': 'Acts', 'act': 'Acts',
  'romans': 'Romans', 'rom': 'Romans', 'ro': 'Romans',
  '1 corinthians': '1 Corinthians', '1 cor': '1 Corinthians', '1 co': '1 Corinthians', '1cor': '1 Corinthians', '1co': '1 Corinthians',
  '2 corinthians': '2 Corinthians', '2 cor': '2 Corinthians', '2 co': '2 Corinthians', '2cor': '2 Corinthians', '2co': '2 Corinthians',
  'galatians': 'Galatians', 'gal': 'Galatians', 'ga': 'Galatians',
  'ephesians': 'Ephesians', 'eph': 'Ephesians',
  'philippians': 'Philippians', 'phil': 'Philippians', 'php': 'Philippians',
  'colossians': 'Colossians', 'col': 'Colossians',
  '1 thessalonians': '1 Thessalonians', '1 thess': '1 Thessalonians', '1 th': '1 Thessalonians', '1thess': '1 Thessalonians', '1th': '1 Thessalonians',
  '2 thessalonians': '2 Thessalonians', '2 thess': '2 Thessalonians', '2 th': '2 Thessalonians', '2thess': '2 Thessalonians', '2th': '2 Thessalonians',
  '1 timothy': '1 Timothy', '1 tim': '1 Timothy', '1 ti': '1 Timothy', '1tim': '1 Timothy', '1ti': '1 Timothy',
  '2 timothy': '2 Timothy', '2 tim': '2 Timothy', '2 ti': '2 Timothy', '2tim': '2 Timothy', '2ti': '2 Timothy',
  'titus': 'Titus', 'tit': 'Titus', 'ti': 'Titus',
  'philemon': 'Philemon', 'philem': 'Philemon', 'phm': 'Philemon',
  'hebrews': 'Hebrews', 'heb': 'Hebrews',
  'james': 'James', 'jas': 'James', 'jm': 'James',
  '1 peter': '1 Peter', '1 pet': '1 Peter', '1 pe': '1 Peter', '1pet': '1 Peter', '1pe': '1 Peter',
  '2 peter': '2 Peter', '2 pet': '2 Peter', '2 pe': '2 Peter', '2pet': '2 Peter', '2pe': '2 Peter',
  '1 john': '1 John', '1 jhn': '1 John', '1 jn': '1 John', '1jn': '1 John', '1john': '1 John',
  '2 john': '2 John', '2 jhn': '2 John', '2 jn': '2 John', '2jn': '2 John', '2john': '2 John',
  '3 john': '3 John', '3 jhn': '3 John', '3 jn': '3 John', '3jn': '3 John', '3john': '3 John',
  'jude': 'Jude', 'jud': 'Jude',
  'revelation': 'Revelation', 'rev': 'Revelation', 're': 'Revelation',

  // Old Testament (Most common)
  'genesis': 'Genesis', 'gen': 'Genesis', 'ge': 'Genesis',
  'exodus': 'Exodus', 'exo': 'Exodus', 'ex': 'Exodus',
  'leviticus': 'Leviticus', 'lev': 'Leviticus', 'le': 'Leviticus',
  'numbers': 'Numbers', 'num': 'Numbers', 'nu': 'Numbers',
  'deuteronomy': 'Deuteronomy', 'deut': 'Deuteronomy', 'de': 'Deuteronomy',
  'joshua': 'Joshua', 'josh': 'Joshua', 'jos': 'Joshua',
  'judges': 'Judges', 'judg': 'Judges', 'jdg': 'Judges',
  'ruth': 'Ruth', 'ru': 'Ruth',
  '1 samuel': '1 Samuel', '1 sam': '1 Samuel', '1 sa': '1 Samuel', '1sam': '1 Samuel', '1sa': '1 Samuel',
  '2 samuel': '2 Samuel', '2 sam': '2 Samuel', '2 sa': '2 Samuel', '2sam': '2 Samuel', '2sa': '2 Samuel',
  '1 kings': '1 Kings', '1 kgs': '1 Kings', '1 ki': '1 Kings', '1kings': '1 Kings', '1kgs': '1 Kings', '1ki': '1 Kings',
  '2 kings': '2 Kings', '2 kgs': '2 Kings', '2 ki': '2 Kings', '2kings': '2 Kings', '2kgs': '2 Kings', '2ki': '2 Kings',
  '1 chronicles': '1 Chronicles', '1 chron': '1 Chronicles', '1 chr': '1 Chronicles', '1chronicles': '1 Chronicles', '1chron': '1 Chronicles', '1chr': '1 Chronicles',
  '2 chronicles': '2 Chronicles', '2 chron': '2 Chronicles', '2 chr': '2 Chronicles', '2chronicles': '2 Chronicles', '2chron': '2 Chronicles', '2chr': '2 Chronicles',
  'ezra': 'Ezra', 'ezr': 'Ezra',
  'nehemiah': 'Nehemiah', 'neh': 'Nehemiah',
  'esther': 'Esther', 'esth': 'Esther', 'est': 'Esther',
  'job': 'Job', 'jb': 'Job',
  'psalms': 'Psalms', 'psalm': 'Psalms', 'psa': 'Psalms', 'ps': 'Psalms',
  'proverbs': 'Proverbs', 'prov': 'Proverbs', 'pro': 'Proverbs', 'pr': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes', 'eccles': 'Ecclesiastes', 'ecc': 'Ecclesiastes', 'ec': 'Ecclesiastes',
  'song of solomon': 'Song of Solomon', 'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'song of songs': 'Song of Solomon',
  'isaiah': 'Isaiah', 'isa': 'Isaiah', 'is': 'Isaiah',
  'jeremiah': 'Jeremiah', 'jer': 'Jeremiah', 'je': 'Jeremiah',
  'lamentations': 'Lamentations', 'lam': 'Lamentations', 'la': 'Lamentations',
  'ezekiel': 'Ezekiel', 'ezek': 'Ezekiel', 'eze': 'Ezekiel',
  'daniel': 'Daniel', 'dan': 'Daniel', 'da': 'Daniel',
  'hosea': 'Hosea', 'hos': 'Hosea', 'ho': 'Hosea',
  'joel': 'Joel', 'jl': 'Joel',
  'amos': 'Amos', 'am': 'Amos',
  'obadiah': 'Obadiah', 'obad': 'Obadiah', 'ob': 'Obadiah',
  'jonah': 'Jonah', 'jon': 'Jonah',
  'micah': 'Micah', 'mic': 'Micah',
  'nahum': 'Nahum', 'nah': 'Nahum', 'na': 'Nahum',
  'habakkuk': 'Habakkuk', 'hab': 'Habakkuk',
  'zephaniah': 'Zephaniah', 'zeph': 'Zephaniah', 'zep': 'Zephaniah',
  'haggai': 'Haggai', 'hag': 'Haggai',
  'zechariah': 'Zechariah', 'zech': 'Zechariah', 'zec': 'Zechariah',
  'malachi': 'Malachi', 'mal': 'Malachi'
};

// Sort keys by length descending so longer book names/abbreviations match first in regex
const buildMasterRegex = () => {
  const dictionaryKeys = Object.keys(bookMap).sort((a, b) => b.length - a.length);
  // Escapes for regex (specifically spaces because some keys have them)
  const escapedKeys = dictionaryKeys.map(k => k.replace(/\s+/g, '\\s*')); 
  
  const bookGroup = `(${escapedKeys.join('|')})`;
  
  // Explanation of the expression:
  // 1: \b       -> word boundary
  // 2: bookGroup-> Matches any recognized book (e.g., "1 Cor", "John", "Jn")
  // 3: \.?      -> Optional period (e.g. "Jn.")
  // 4: \s*      -> Optional space(s) between book and chapter
  // 5: (\d+)    -> Chapter number
  // 6: [\s:-]+  -> Separator between chapter and verse (space, colon, or dashes)
  // 7: (\d+(?:\s*-\s*\d+)?) -> Verse number(s) (e.g., "3", "3-5", "3 - 5")
  return new RegExp(`\\b${bookGroup}\\.?\\s*(\\d+)[\\s:-]+(\\d+(?:\\s*-\\s*\\d+)?)\\b`, 'gi');
};

const verseRegex = buildMasterRegex();

/**
 * Normalizes matched references to a pristine format: "StandardBook Chapter:Verse(s)"
 */
const formatReference = (bookMatch, chapter, verseMatch) => {
  // Clean up book match (e.g. "1  cor" -> "1 cor")
  const cleanedBookKey = bookMatch.toLowerCase().replace(/\s+/g, ' ');
  // Look up in dictionary, default to Title Case if not found
  const standardBook = bookMap[cleanedBookKey] || cleanedBookKey.replace(/\b\w/g, c => c.toUpperCase());
  
  // Clean up verse ranges (e.g., "11 - 12" -> "11-12")
  const standardVerse = verseMatch.replace(/\s+/g, '');
  
  return `${standardBook} ${chapter}:${standardVerse}`;
};

export const detectVerses = (rawText) => {
  // 1. Fast Pre-Check: Do we see any digits? If not, exit immediately.
  if (!rawText || typeof rawText !== 'string' || !/\d/.test(rawText)) {
    return { cleanedText: rawText || '', detectedReferences: [] };
  }

  // 2. Aggressive Normalization
  // Strip messy OCR characters like | \ { } etc while keeping alphanumerics and standard punctuation
  // We keep letters, numbers, spaces, periods, colons, and hyphens.
  let cleanedText = rawText.replace(/[\r\n\t]+/g, ' ').replace(/[^\w\s.:-]/g, '');
  // Collapse excessive spaces
  cleanedText = cleanedText.replace(/\s{2,}/g, ' ').trim();

  // 3. Fast Pattern Matching via Dictionary RegExp
  const detectedReferences = [];
  let match;
  
  // Reset regex index before looping
  verseRegex.lastIndex = 0;
  
  while ((match = verseRegex.exec(cleanedText)) !== null) {
    // match[0] = full matched string (e.g., "Jn. 11 25")
    // match[1] = book (e.g., "Jn")
    // match[2] = chapter (e.g., "11")
    // match[3] = verse(s) (e.g., "25" or "25-26")
    const formattedRef = formatReference(match[1], match[2], match[3]);
    if (!detectedReferences.includes(formattedRef)) {
      detectedReferences.push(formattedRef);
    }
  }

  return { cleanedText, detectedReferences };
};
