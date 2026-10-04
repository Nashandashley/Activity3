export function analyzeContent(text, ignoreEmptyLines = true) {
  // Normalize line breaks (\r\n -> \n)
  const normalizedText = text.replace(/\r\n/g, '\n');

  let lines = normalizedText.split('\n');
  if (ignoreEmptyLines) {
    lines = lines.filter((line) => line.trim().length > 0);
  }

  // Count words matching sequence of non-whitespace characters
  const wordsMatches = normalizedText.match(/\b\w+['-]?\w*\b/g);
  const wordsCount = wordsMatches ? wordsMatches.length : 0;

  // Characters count (including whitespace)
  const charactersCount = normalizedText.length;

  return {
    linesCount: lines.length,
    wordsCount,
    charactersCount,
    wordsMatches: wordsMatches || []
  };
}

export function getTopWords(words, topN = 5) {
  const freqMap = {};
  for (const word of words) {
    const cleanWord = word.toLowerCase();
    freqMap[cleanWord] = (freqMap[cleanWord] || 0) + 1;
  }

  return Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}