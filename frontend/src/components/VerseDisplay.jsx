import React, { useState } from 'react';

const VerseCard = ({ item }) => {
  // 1. Filter available translations
  const availableTranslations = Object.entries(item.translations || {})
    .filter(([version, text]) => {
      const trimmedText = text?.trim();
      return trimmedText && trimmedText !== 'Translation not available.';
    })
    .map(([version, text]) => ({ version, text }));

  // 2. Default selection logic (KJV or first available)
  const defaultSelection = availableTranslations.find(t => t.version === 'KJV') || availableTranslations[0];

  // 3. Keep track of which translation is actively selected for THIS verse
  const [selectedVersion, setSelectedVersion] = useState(defaultSelection?.version || '');

  // 4. Edge case: if literally nothing fetched properly
  if (availableTranslations.length === 0) {
    return (
      <div className="verse-card centered-layout">
        <h3 className="verse-reference">{item.reference}</h3>
        <p className="no-translations">No translations available</p>
      </div>
    );
  }

  // Get the active text to display
  const selectedText = availableTranslations.find(t => t.version === selectedVersion)?.text;

  return (
    <div className="verse-card centered-layout">
      <h3 className="verse-reference">{item.reference}</h3>
      
      {/* Translation Tabs Selector */}
      <div className="translation-tabs">
        {availableTranslations.map(({ version }) => (
          <button
            key={version}
            className={`tab-btn ${version === selectedVersion ? 'active' : ''}`}
            onClick={() => setSelectedVersion(version)}
          >
            {version}
          </button>
        ))}
      </div>

      {/* Instant Dynamic Verse Text */}
      <div className="translation-content">
        <p className="verse-text">{selectedText}</p>
      </div>
    </div>
  );
};

const VerseDisplay = ({ verses }) => {
  if (!verses || verses.length === 0) {
    return null;
  }

  return (
    <div className="verse-display-container">
      <h2 className="section-title text-center">Detected Verses</h2>
      
      <div className="verses-list">
        {verses.map((item, index) => (
          <VerseCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default VerseDisplay;
