
import { useMemo } from 'react';

interface ChartDataItem {
  name: string;
  value: number;
  category: string;
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
    if (!processedData || !selectedYear) {
      return { byLevel: [], byCategory: [] };
    }

    const byLevel: ChartDataItem[] = [];
    const byCategory: ChartDataItem[] = [];

    const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : categories;
    const levelsToUse = selectedLevels.length > 0 ? selectedLevels : impactLevels;

    categoriesToUse.forEach(category => {
      if (processedData[category] && processedData[category][selectedYear]) {
        levelsToUse.forEach(level => {
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
        });
      }
    });

    return { byLevel, byCategory };
  }, [processedData, selectedYear, selectedCategories, selectedLevels, categories, impactLevels]);
};
