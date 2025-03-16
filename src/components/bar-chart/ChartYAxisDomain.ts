
import { useMemo } from "react";

export const useChartYAxisDomain = (
  chartData: any[],
  selectedBrands: string[],
  standardized: boolean
) => {
  // Calculate the y-axis domain similar to dashboard implementation
  return useMemo(() => {
    if (standardized) {
      return [-3, 3] as [number, number]; // Fixed domain for standardized scores
    }
    
    // Find max value across all brands and countries
    let maxValue = 0;
    
    chartData.forEach(dataPoint => {
      selectedBrands.forEach(brand => {
        const value = dataPoint[brand];
        if (value !== undefined && value !== null && !isNaN(value)) {
          maxValue = Math.max(maxValue, value);
        }
      });
    });
    
    // Add some padding (like in the image) and round up to nearest multiple of 25
    const paddedMax = Math.ceil((maxValue * 1.1) / 25) * 25;
    
    // Always start from 0 for bar charts (as seen in the reference image)
    return [0, paddedMax] as [number, number];
  }, [chartData, selectedBrands, standardized]);
};
