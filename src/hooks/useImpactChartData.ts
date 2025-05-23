
import { useMemo } from 'react';

interface ChartDataItem {
  name: string;
  value: number;
  category: string;
  country?: string;
}

export const useImpactChartData = (
  processedData: Record<string, Record<string, Record<string, number>>> | undefined,
  selectedYear: number | null,
  selectedCategories: string[],
  selectedLevels: string[],
  categories: string[],
  impactLevels: string[]
) => {
  return useMemo(() => {
    // If no data or year, return empty object
    if (!processedData || !selectedYear) {
      return {};
    }
    
    // We're not doing any transformation here anymore
    // since we handle data transformation in the component
    return processedData;
  }, [
    processedData, 
    selectedYear, 
    JSON.stringify(selectedCategories), 
    JSON.stringify(selectedLevels), 
    JSON.stringify(categories),
    JSON.stringify(impactLevels)
  ]);
};
