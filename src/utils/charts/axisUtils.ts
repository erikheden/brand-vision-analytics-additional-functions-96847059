
/**
 * Calculates appropriate min and max values for a percentage axis.
 * 
 * @param values - Array of percentage values to calculate appropriate Y-axis scale
 * @returns Array containing [min, max] values for the axis
 */
export function getDynamicPercentageAxisDomain(values: number[]): [number, number] {
  if (!values || values.length === 0) {
    return [0, 100]; // Default range for empty data
  }
  
  // Find the minimum and maximum values
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Set yMin to be slightly lower than the minimum value (but not below 0)
  // Round down to nearest 10 for cleaner appearance
  const yMin = Math.max(0, Math.floor((minValue - 5) / 10) * 10);
  
  // Set yMax to be slightly higher than the maximum value
  // Round up to nearest 10 for cleaner appearance
  const yMax = Math.ceil((maxValue + 10) / 10) * 10;
  
  return [yMin, yMax];
}

/**
 * Determines appropriate tick interval based on axis range
 * 
 * @param maxValue - Maximum value of the axis
 * @returns Appropriate tick interval
 */
export function getDynamicTickInterval(maxValue: number): number {
  if (maxValue <= 20) return 5;
  if (maxValue <= 50) return 10;
  if (maxValue <= 100) return 20;
  if (maxValue <= 200) return 50;
  return Math.ceil(maxValue / 5 / 10) * 10; // Dynamic for larger ranges
}
