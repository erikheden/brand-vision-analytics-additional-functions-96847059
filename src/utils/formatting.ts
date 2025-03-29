
/**
 * Rounds a percentage value to the nearest whole number
 * @param value The percentage value to round
 * @param asDecimal Whether the input is a decimal (0-1) or percentage (0-100)
 * @returns Rounded percentage as a whole number
 */
export const roundPercentage = (
  value: number | null | undefined, 
  asDecimal: boolean = false
): number | null => {
  if (value === null || value === undefined) return null;
  
  // Convert from decimal to percentage if needed
  const percentage = asDecimal ? value * 100 : value;
  
  // Round to nearest whole number
  return Math.round(percentage);
};

/**
 * Formats a percentage value for display, including the % symbol
 * @param value The percentage value to format
 * @param asDecimal Whether the input is a decimal (0-1) or percentage (0-100)
 * @param decimals Number of decimal places to show (default: 1)
 * @returns Formatted string with % symbol
 */
export const formatPercentage = (
  value: number | null | undefined, 
  asDecimal: boolean = false,
  decimals: number = 1
): string => {
  if (value === null || value === undefined) return 'N/A';
  
  // Convert from decimal to percentage if needed
  const percentage = asDecimal ? value * 100 : value;
  
  // Format with the specified number of decimal places
  return `${percentage.toFixed(decimals)}%`;
};
