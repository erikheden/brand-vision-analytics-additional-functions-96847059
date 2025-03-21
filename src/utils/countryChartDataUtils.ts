
import { processLineChartData } from './countryComparison/dataProcessing';
import { COUNTRY_COLORS, getBrandColor, BRAND_COLORS } from './countryComparison/chartColors';

// Since we're removing standardization, this function simply returns the raw score
export const standardizeScore = (
  score: number,
  mean: number,
  stdDev: number
): number | null => {
  return score; // Just return the raw score
};

// Re-export the utilities
export { processLineChartData, COUNTRY_COLORS, getBrandColor, BRAND_COLORS };
