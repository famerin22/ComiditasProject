export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '') // Also remove non-alphanumeric chars for stricter comparison
    .trim();
};

export const getSimilarity = (s1, s2) => {
  const n1 = normalizeText(s1);
  const n2 = normalizeText(s2);
  
  if (n1 === n2) return 1;
  if (n1.includes(n2) || n2.includes(n1)) return 0.9;

  // Levenshtein Distance
  const track = Array(n2.length + 1).fill(null).map(() =>
    Array(n1.length + 1).fill(null));
  for (let i = 0; i <= n1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= n2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= n2.length; j += 1) {
    for (let i = 1; i <= n1.length; i += 1) {
      const indicator = n1[i - 1] === n2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  const distance = track[n2.length][n1.length];
  const maxLength = Math.max(n1.length, n2.length);
  return (maxLength - distance) / maxLength;
};
