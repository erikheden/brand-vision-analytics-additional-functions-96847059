
import { useMemo } from "react";
import { getDynamicPercentageAxisDomain } from "@/utils/charts/axisUtils";

export const useChartYAxisDomain = (
  chartData: any[],
  selectedBrands: string[],
  standardized: boolean
) => {
  // Calculate the y-axis domain 
  return useMemo(() => {
    if (standardized) {
      return [-3, 3] as [number, number]; // Fixed domain for standardized scores
    }
    
    // Find all values across all brands and countries
    const allValues: number[] = [];
    
    chartData.forEach(dataPoint => {
      selectedBrands.forEach(brand => {
        const value = dataPoint[brand];
        if (value !== undefined && value !== null && !isNaN(value)) {
          allValues.push(value);
        }
      });
    });
    
    // Use the utility function for consistent axis domains across the application
    return getDynamicPercentageAxisDomain(allValues);
  }, [chartData, selectedBrands, standardized]);
};
