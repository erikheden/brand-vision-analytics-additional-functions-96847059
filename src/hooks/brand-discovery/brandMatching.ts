
/**
 * Find brand names that are close matches (similar but not identical)
 */
export function findCloseMatches(set1: Set<string>, set2: Set<string>): string[] {
  // Convert sets to arrays for easier comparison
  const array1 = Array.from(set1);
  const array2 = Array.from(set2);
  
  // Find names that are close matches but not exact
  return array1.filter(name1 => 
    array2.some(name2 => 
      name1.includes(name2) || name2.includes(name1) ||
      levenshteinDistance(name1, name2) <= 2 // Names with small edit distances
    )
  );
}

/**
 * Calculate Levenshtein distance between strings to find near matches
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
