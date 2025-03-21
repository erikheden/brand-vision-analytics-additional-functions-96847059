
import { processLineChartData } from './countryComparison/dataProcessing';
import { COUNTRY_COLORS, getBrandColor, BRAND_COLORS } from './countryComparison/chartColors';

// Re-export the utilities
export { processLineChartData, COUNTRY_COLORS, getBrandColor, BRAND_COLORS };

/**
 * Standardizes a score based on country average and standard deviation
 * @param score The raw score to standardize
 * @param countryAverage The average score for the country and year
 * @param countryStdDev The standard deviation for the country and year
 * @returns The standardized score (z-score) or null if standardization isn't possible
 */
export const standardizeScore = (score: number, countryAverage: number, countryStdDev: number): number | null => {
  // Skip standardization if score is missing
  if (score === null || score === undefined || isNaN(score)) {
    return null;
  }
  
  // Skip standardization if average is missing
  if (countryAverage === null || countryAverage === undefined || isNaN(countryAverage)) {
    console.warn(`Cannot standardize score ${score}: missing country average`);
    return null;
  }
  
  // Skip standardization if there is insufficient variance
  // (prevents division by zero and meaningless standardization)
  if (countryStdDev === 0 || isNaN(countryStdDev) || countryStdDev < 0.001) {
    console.warn(`Cannot standardize score ${score.toFixed(2)} with countryAverage=${countryAverage.toFixed(2)} and countryStdDev=${countryStdDev}: insufficient variance`);
    return null;
  }
  
  // Calculate z-score: (value - mean) / standard deviation
  const zScore = (score - countryAverage) / countryStdDev;
  
  // Cap extreme values to stay within -3 to +3 standard deviations
  const cappedScore = Math.max(-3, Math.min(3, zScore));
  
  console.log(`Standardized score: ${score.toFixed(2)} → ${cappedScore.toFixed(2)} (avg=${countryAverage.toFixed(2)}, stdDev=${countryStdDev.toFixed(2)})`);
  
  return cappedScore;
};
