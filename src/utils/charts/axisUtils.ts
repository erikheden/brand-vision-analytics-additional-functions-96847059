/**
 * Calculates appropriate min and max values for percentage Y-axis
 * to ensure proper display of data with some padding
 * @param values Array of percentage values
 * @returns Tuple of [min, max] for the axis
 */
export function getDynamicPercentageAxisDomain(values: number[]): [number, number] {
  if (!values || values.length === 0) {
    return [0, 100]; // Default range for percentages
  }

  // For percentage data, if all values are under 50%, cap at 60%
  // Otherwise, round to nearest 10% above max value
  const maxValue = Math.max(...values.filter(v => !isNaN(v)));
  
  // Always start at 0 for bar charts
  const minValue = 0;
  
  let maxYAxis;
  
  if (maxValue <= 50) {
    maxYAxis = Math.min(100, Math.max(60, Math.ceil(maxValue / 10) * 10 + 10));
  } else {
    maxYAxis = Math.min(100, Math.ceil(maxValue / 10) * 10 + 10);
  }

  return [minValue, maxYAxis];
}

/**
 * Gets appropriate tick interval based on axis range
 * @param maxValue Maximum value on the axis
 * @returns Appropriate tick interval for nice-looking axis
 */
export function getDynamicTickInterval(maxValue: number): number {
  if (maxValue <= 20) return 5;
  if (maxValue <= 50) return 10;
  if (maxValue <= 100) return 20;
  return Math.ceil(maxValue / 5 / 10) * 10; // Round to nice intervals
}

/**
 * Creates a nicely scaled axis for non-percentage values
 * @param values Array of numeric values
 * @returns Tuple of [min, max] for the axis
 */
export function getDynamicValueAxisDomain(values: number[]): [number, number] {
  if (!values || values.length === 0) {
    return [0, 100]; // Default range
  }

  const minValue = Math.min(...values.filter(v => !isNaN(v)));
  const maxValue = Math.max(...values.filter(v => !isNaN(v)));
  
  // Start at 0 or slightly below min value if negative
  const axisMin = minValue < 0 ? Math.floor(minValue / 10) * 10 : 0;
  
  // Round max to nice interval above max value
  const axisMax = Math.ceil(maxValue / 10) * 10 + 10;

  return [axisMin, axisMax];
}
