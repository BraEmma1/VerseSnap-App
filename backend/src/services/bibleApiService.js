/**
 * Bible API Service
 * Fetches multiple translations for a given verse reference.
 * We are using the free 'bible-api.com' API. It supports KJV, WEB, BBE, etc.
 * Note: Node 18+ has built-in fetch so no axios required for this simple module.
 */

export const fetchTranslations = async (reference) => {
  // Define the translations we want to fetch (removed duplicates)
  const translations = ['kjv', 'web', 'bbe', 'esv', 'niv', 'nlt', 'asv', 'amp', 'ampc', 'ceb', 'csb', 'drb', 'gnb', 'hcsb', 'jps', 'msg', 'nasb', 'nkjv', 'nrsv', 'nsv', 'erv'];
  const results = {};

  const fetchTranslation = async (t) => {
    try {
      // Fetch data for the specific translation
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=${t}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${t} translation`);
      }
      
      const data = await response.json();
      results[t.toUpperCase()] = data.text.trim();
    } catch (error) {
      console.error(`Error fetching ${t} for ${reference}:`, error.message);
      results[t.toUpperCase()] = 'Translation not available.';
    }
  };

  // Fetch all translations concurrently
  await Promise.all(translations.map(t => fetchTranslation(t)));

  return {
    reference,
    translations: results
  };
};


