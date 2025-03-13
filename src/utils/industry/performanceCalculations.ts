
/**
 * Calculates the performance delta between a brand and its industry average
 * Positive values mean the brand is outperforming its industry
 */
export const calculatePerformanceDelta = (
  brandScore: number | undefined,
  industryAverage: number | undefined
): number | null => {
  if (brandScore === undefined || industryAverage === undefined) {
    return null;
  }
  return brandScore - industryAverage;
};

/**
 * Returns a percentage difference between a brand's score and its industry average
 * Positive values mean the brand is outperforming its industry
 */
export const calculatePerformancePercentage = (
  brandScore: number | undefined,
  industryAverage: number | undefined
): number | null => {
  if (brandScore === undefined || industryAverage === undefined || industryAverage === 0) {
    return null;
  }
  return ((brandScore - industryAverage) / industryAverage) * 100;
};
