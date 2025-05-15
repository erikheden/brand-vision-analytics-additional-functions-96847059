
/**
 * Creates a tooltip formatter function for percentage charts
 */
export function createPercentageTooltipFormatter() {
  return function(): string {
    // Use type casting to handle both single point and multiple points
    const tooltipContext = this as any;
    
    if (tooltipContext.points) { // Shared tooltip (multiple points)
      return `<b>${tooltipContext.x}</b><br>` + 
        tooltipContext.points.map((point: any) => 
          `<span style="color:${point.color}">●</span> ${point.series.name}: ${Math.round(point.y)}%`
        ).join('<br>');
    } else if (tooltipContext.point) { // Single point tooltip
      const point = tooltipContext.point;
      const series = tooltipContext.series;
      
      return `<b>${point.name || tooltipContext.x}</b><br><span style="color:${point.color || series.color}">●</span> ${series.name}: ${Math.round(point.y)}%`;
    }
    
    // Fallback for any other case
    return `${tooltipContext.x}: ${tooltipContext.y}%`;
  };
}
