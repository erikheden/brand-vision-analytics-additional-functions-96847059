
/**
 * Utility to get average scores from the map structure
 */
export const getAverageScore = (
  averageScores: Map<string, Map<number, number>>,
  country: string,
  year: number
): number | null => {
  if (!averageScores || !averageScores.has(country)) {
    return null;
  }
  
  const countryAverages = averageScores.get(country);
  if (!countryAverages || !countryAverages.has(year)) {
    // Try to find the closest year
    const availableYears = Array.from(countryAverages?.keys() || []).sort();
    if (availableYears.length === 0) return null;
    
    // Find the closest year
    const closestYear = availableYears.reduce((prev, curr) => 
      Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
    );
    
    return countryAverages?.get(closestYear) || null;
  }
  
  return countryAverages.get(year) || null;
};
