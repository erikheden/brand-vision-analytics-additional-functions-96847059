
/**
 * Rounds a percentage value to the nearest whole number
 * @param value The decimal or percentage value to round
 * @param asDecimal Whether the input is a decimal (0-1) or percentage (0-100)
 * @returns Rounded percentage as a whole number
 */
export const roundPercentage = (
  value: number | null | undefined, 
  asDecimal: boolean = false
): number | null => {
  if (value === null || value === undefined) return null;
  
  // If the value is a decimal (0-1), convert to percentage first
  const percentage = asDecimal ? value * 100 : value;
  
  // Round to nearest whole number
  return Math.round(percentage);
};

/**
 * Formats a percentage value for display, including the % symbol
 * @param value The decimal or percentage value to format
 * @param asDecimal Whether the input is a decimal (0-1) or percentage (0-100)
 * @returns Formatted string with % symbol
 */
export const formatPercentage = (
  value: number | null | undefined, 
  asDecimal: boolean = false
): string => {
  const rounded = roundPercentage(value, asDecimal);
  return rounded !== null ? `${rounded}%` : 'N/A';
};
