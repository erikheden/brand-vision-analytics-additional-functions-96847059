
/**
 * Gets chart height based on number of categories and chart type
 * @param itemCount - Number of categories to display
 * @param horizontal - Whether the chart is horizontal (bar) or vertical (column)
 * @param minHeight - Minimum chart height in pixels
 */
export function getChartHeight(
  itemCount: number, 
  horizontal: boolean = false,
  minHeight: number = 300
): number {
  if (horizontal) {
    // For horizontal charts, height scales with number of categories
    return Math.max(minHeight, 60 + (itemCount * 40));
  } else {
    // For vertical charts, base height plus small increase per item
    return Math.max(minHeight, 300 + (itemCount * 10));
  }
}
