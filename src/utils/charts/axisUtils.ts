
/**
 * Utility functions for dynamic chart axis configuration
 */

/**
 * Calculates a dynamic y-axis domain for percentage-based charts
 * @param data Array of data points or max percentage value
 * @param maxPercentage Optional maximum percentage to cap the axis (defaults to 100)
 * @returns [min, max] tuple for the axis domain
 */
export const getDynamicPercentageAxisDomain = (
  data: number[] | number,
  maxPercentage: number = 100
): [number, number] => {
  // If data is a single number, use it directly
  const maxValue = Array.isArray(data) 
    ? Math.max(...data.filter(val => !isNaN(val) && val !== null))
    : typeof data === 'number' ? data : 0;
    
  // Add 10% padding to the max value for better visualization
  let paddedMax = maxValue * 1.1;
  
  // Cap at maxPercentage (default 100) for percentage-based charts
  paddedMax = Math.min(paddedMax, maxPercentage);
  
  // Ensure minimum value is at least slightly above zero for better visualization
  // Round up to nearest 5 or 10 depending on scale
  if (paddedMax <= 10) {
    paddedMax = Math.ceil(paddedMax / 2) * 2; // Round to nearest 2
  } else if (paddedMax <= 50) {
    paddedMax = Math.ceil(paddedMax / 5) * 5; // Round to nearest 5
  } else {
    paddedMax = Math.ceil(paddedMax / 10) * 10; // Round to nearest 10
  }
  
  // Ensure we have a valid maximum (at least 10)
  paddedMax = Math.max(paddedMax, 10);
  
  return [0, paddedMax];
};

/**
 * Calculate dynamic tick intervals based on the max value
 * @param maxValue The maximum value in the data
 * @returns Appropriate tick interval
 */
export const getDynamicTickInterval = (maxValue: number): number => {
  if (maxValue <= 10) return 2;
  if (maxValue <= 20) return 5;
  if (maxValue <= 50) return 10;
  if (maxValue <= 100) return 20;
  return Math.ceil(maxValue / 5);
};

/**
 * Configure yAxis options with dynamic domain based on data
 * @param data Data used to calculate axis domain
 * @param isPercentage Whether the data represents percentages
 * @returns Highcharts yAxis configuration object
 */
export const getDynamicYAxisConfig = (
  data: number[] | number,
  isPercentage: boolean = true
) => {
  const [min, max] = getDynamicPercentageAxisDomain(data, isPercentage ? 100 : undefined);
  const tickInterval = getDynamicTickInterval(max);
  
  return {
    min,
    max,
    tickInterval,
    labels: {
      format: isPercentage ? '{value}%' : '{value}'
    }
  };
};
