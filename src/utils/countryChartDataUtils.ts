
import { processLineChartData } from './countryComparison/dataProcessing';
import { COUNTRY_COLORS, getBrandColor, BRAND_COLORS } from './countryComparison/chartColors';

// Re-export the utilities
export { processLineChartData, COUNTRY_COLORS, getBrandColor, BRAND_COLORS };

/**
 * Standardizes a score based on country average and standard deviation
 * @param score The raw score to standardize
 * @param countryAverage The average score for the country and year
 * @param countryStdDev The standard deviation for the country and year
 * @returns The standardized score (z-score) or a scaled difference if stdDev is zero
 */
export const standardizeScore = (score: number, countryAverage: number, countryStdDev: number): number | null => {
  // If we have zero variance, we can't standardize properly in the traditional way
  if (countryStdDev === 0 || isNaN(countryStdDev) || countryStdDev < 0.001) {
    console.log(`Cannot standardize score ${score} with countryAverage=${countryAverage} and countryStdDev=${countryStdDev} in the traditional way.`);
    
    // Instead of returning null, calculate the percent difference from the mean
    // This allows us to still see how the brand compares to the market average
    if (countryAverage > 0) {
      const percentDifference = (score - countryAverage) / countryAverage;
      // Scale the percent difference to make it similar to Z-score range (-3 to +3)
      const scaledDifference = Math.max(-3, Math.min(3, percentDifference * 3));
      console.log(`Using percent difference instead: ${score} → ${scaledDifference.toFixed(2)} (${(percentDifference * 100).toFixed(2)}% from avg=${countryAverage.toFixed(2)})`);
      return scaledDifference;
    }
    
    // If average is 0, just show positive values as slightly positive
    return score > 0 ? 1 : 0; 
  }
  
  // Calculate z-score: (value - mean) / standard deviation
  const zScore = (score - countryAverage) / countryStdDev;
  
  // Cap extreme values to stay within -3 to +3 standard deviations
  const cappedScore = Math.max(-3, Math.min(3, zScore));
  
  console.log(`Standardized score: ${score} → ${cappedScore.toFixed(2)} (avg=${countryAverage.toFixed(2)}, stdDev=${countryStdDev.toFixed(2)})`);
  
  return cappedScore;
};
