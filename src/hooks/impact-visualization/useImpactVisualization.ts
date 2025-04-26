
import { useMemo } from 'react';
import { useImpactChartData } from '@/hooks/useImpactChartData';

export const useImpactVisualization = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategories: string[],
  selectedYear: number | null,
  selectedLevels: string[]
) => {
  const { byLevel, byCategory } = useImpactChartData(
    processedData,
    selectedYear,
    selectedCategories,
    selectedLevels,
    selectedCategories,
    selectedLevels
  );

  const hasData = useMemo(() => 
    byLevel.length > 0 && byCategory.length > 0, 
    [byLevel.length, byCategory.length]
  );

  return {
    byLevel,
    byCategory,
    hasData
  };
};
