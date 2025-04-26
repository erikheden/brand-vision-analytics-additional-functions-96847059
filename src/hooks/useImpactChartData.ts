
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

    // Use provided categories/levels or fallback to full lists
    const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : categories;
    const levelsToUse = selectedLevels.length > 0 ? selectedLevels : impactLevels;

    // Process the data more efficiently with fewer nested loops
    categoriesToUse.forEach(category => {
      const categoryData = processedData[category];
      if (!categoryData || !categoryData[selectedYear]) return;
      
      const yearData = categoryData[selectedYear];
      
      levelsToUse.forEach(level => {
        const value = yearData[level];
        if (value !== undefined) {
          byLevel.push({
            name: level,
            value: value * 100,
            category
          });

          byCategory.push({
            name: category,
            value: value * 100,
            category: level
          });
        }
      });
    });

    return { byLevel, byCategory };
  }, [
    processedData, 
    selectedYear, 
    // Use stable dependencies by converting arrays to strings
    JSON.stringify(selectedCategories), 
    JSON.stringify(selectedLevels), 
    JSON.stringify(categories),
    JSON.stringify(impactLevels)
  ]);
};
