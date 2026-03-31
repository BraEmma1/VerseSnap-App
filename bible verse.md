You are a senior backend developer.

Task: Extend the existing Node.js + Express backend for the VerseSnap app.

Requirements:

1. **Verse Detection Service (`verseDetectionService.js`)**
   - Accepts a string of text (from OCR)
   - Detects Bible references in the text (e.g., "John 3:16", "1 Corinthians 13:4-7")
   - Returns an array of detected references in standardized format
   - Should handle multiple references in a single text
   - Must be modular and testable

2. **Bible API Service (`bibleApiService.js`)**
   - Accepts a verse reference string
   - Fetches the verse in multiple translations from a public Bible API
   - Returns structured JSON:
     ```json
     {
       "reference": "John 3:16",
       "translations": {
         "KJV": "text...",
         "NIV": "text...",
         "ESV": "text..."
       }
     }
     ```
   - Must be modular and easily extendable to add more translations
   - Handle API errors gracefully

3. **Verse Controller (`verseController.js`)**
   - Endpoint `POST /api/detect-verse`
     - Accepts OCR text
     - Returns detected verse references
   - Endpoint `POST /api/get-verses`
     - Accepts confirmed verse reference(s)
     - Returns JSON with translations from Bible API

4. **Verse Routes (`verseRoutes.js`)**
   - Must wire up the above endpoints
   - Use Express router

Constraints:

- Do NOT implement frontend logic
- Keep backend modular and testable
- Return proper HTTP status codes and JSON responses
- Use async/await for all async operations
- Do NOT overcomplicate the structure; follow the folder structure we already created
- Add inline comments explaining each function

Output:

- `verseDetectionService.js`
- `bibleApiService.js`
- `verseController.js`
- `verseRoutes.js`
- Show example response JSON for each endpoint
