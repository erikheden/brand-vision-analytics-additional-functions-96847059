
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
  if (countryStdDev === 0) return 0; // Avoid division by zero
  return (score - countryAverage) / countryStdDev;
};
