
import { useMemo } from 'react';

interface ChartDataItem {
  name: string;
  value: number;
  category: string;
  country?: string;
}

interface ProcessedChartData {
  byLevel: ChartDataItem[];
  byCategory: ChartDataItem[];
}

export const useImpactChartData = (
  processedData: Record<string, Record<string, Record<string, number>>> | undefined,
  selectedYear: number | null,
  selectedCategories: string[],
  selectedLevels: string[],
  categories: string[],
  impactLevels: string[]
): ProcessedChartData => {
  return useMemo(() => {
    // Early return if data is missing
    if (!processedData || !selectedYear) {
      return { byLevel: [], byCategory: [] };
    }

    const byLevel: ChartDataItem[] = [];
    const byCategory: ChartDataItem[] = [];

    const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : categories;
    const levelsToUse = selectedLevels.length > 0 ? selectedLevels : impactLevels;

    // Avoid nested loops when possible to optimize performance
    for (const category of categoriesToUse) {
      if (!processedData[category] || !processedData[category][selectedYear]) {
        continue;
      }
      
      for (const level of levelsToUse) {
        if (processedData[category][selectedYear][level] !== undefined) {
          byLevel.push({
            name: level,
            value: processedData[category][selectedYear][level] * 100,
            category: category
          });

          byCategory.push({
            name: category,
            value: processedData[category][selectedYear][level] * 100,
            category: level
          });
        }
      }
    }

    return { byLevel, byCategory };
  }, [
    processedData, 
    selectedYear, 
    // Use JSON.stringify for array dependencies to prevent unnecessary recalculations
    // when the arrays have the same items but different references
    JSON.stringify(selectedCategories), 
    JSON.stringify(selectedLevels), 
    JSON.stringify(categories),
    JSON.stringify(impactLevels)
  ]);
};
