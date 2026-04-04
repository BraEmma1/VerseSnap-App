import { detectVerses } from './src/services/verseDetectionService.js';

const testCases = [
  "Here is some text including John 11 25.",
  "What about Jn 3:16?",
  "I read 1 Cor 13 4-7.",
  "No spaces at all: John11:25",
  "Lots   of    spaces   Song of Solomon  2  :   1 - 2.",
  "Just random words, no numbers here.",
  "Only numbers 12345 67890 no books."
];

testCases.forEach(text => {
  const result = detectVerses(text);
  console.log(`Input: "${text}"`);
  console.log(`Detected: ${JSON.stringify(result.detectedReferences)}`);
  console.log('---');
});
