
/**
 * Standard colors for consistent charting across the application
 */
export const CHART_COLORS = {
  // Primary palette (green shades)
  primary: [
    '#34502b',  // Dark green
    '#4d7342',  // Medium green
    '#668c5a',  // Light-medium green 
    '#7fa571',  // Light green
    '#98be89',  // Pale green
  ],
  // Secondary palette for multiple series when needed
  secondary: [
    '#257179',  // Teal
    '#328a94',  // Blue-green
    '#3fa3ae',  // Lighter blue-green
    '#4dbcc9',  // Light teal
    '#66c7d2',  // Pale teal
  ],
  // Neutral colors for backgrounds and borders
  neutral: {
    background: 'white',
    border: 'rgba(52, 80, 43, 0.2)',
    gridLines: 'rgba(52, 80, 43, 0.1)'
  }
};

/**
 * Helper function to get colors for a single series with multiple data points
 * @param count - Number of colors needed
 * @param colorStart - Starting index in the color array
 */
export function getGradientColors(count: number, colorStart: number = 0): string[] {
  if (count <= 5) {
    // Use primary palette directly for up to 5 items
    return CHART_COLORS.primary.slice(0, count);
  }
  
  // For more items, generate gradient colors
  return Array(count).fill(0).map((_, index) => {
    // Create a gradient from dark green to light green
    const shade = 80 - ((index * (60 / Math.max(count, 1))) + colorStart);
    return `rgba(52, 80, 43, ${shade / 100})`;
  });
}

/**
 * Gets colors for multiple series
 * @param seriesCount - Number of series
 */
export function getSeriesColors(seriesCount: number): string[] {
  // Combine primary and secondary palettes for more series
  const allColors = [...CHART_COLORS.primary, ...CHART_COLORS.secondary];
  
  if (seriesCount <= allColors.length) {
    return allColors.slice(0, seriesCount);
  }
  
  // For even more series, cycle through the colors
  return Array(seriesCount).fill(0).map((_, i) => allColors[i % allColors.length]);
}
