
import { processLineChartData } from './countryComparison/dataProcessing';
import { COUNTRY_COLORS, getBrandColor, BRAND_COLORS } from './countryComparison/chartColors';

// Re-export the utilities
export { processLineChartData, COUNTRY_COLORS, getBrandColor, BRAND_COLORS };

/**
 * Standardizes a score based on country average and standard deviation
 * @param score The raw score to standardize
 * @param countryAverage The average score for the country and year
 * @param countryStdDev The standard deviation for the country and year
 * @returns The standardized score (z-score)
 */
export const standardizeScore = (score: number, countryAverage: number, countryStdDev: number): number => {
  // If we have only one data point or zero variance, we can't standardize properly
  // In this case, return 0 (which represents exactly at the mean)
  if (countryStdDev === 0 || isNaN(countryStdDev)) {
    console.log(`Cannot standardize score ${score} with countryAverage=${countryAverage} and countryStdDev=${countryStdDev}. Returning 0.`);
    return 0;
  }
  
  // Calculate z-score: (value - mean) / standard deviation
  const zScore = (score - countryAverage) / countryStdDev;
  
  // Cap extreme values to stay within -3 to +3 standard deviations
  const cappedScore = Math.max(-3, Math.min(3, zScore));
  
  console.log(`Standardized score: ${score} → ${cappedScore.toFixed(2)} (avg=${countryAverage.toFixed(2)}, stdDev=${countryStdDev.toFixed(2)})`);
  
  return cappedScore;
};
