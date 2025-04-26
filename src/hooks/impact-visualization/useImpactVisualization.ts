
import { useMemo } from 'react';
import { useImpactChartData } from '@/hooks/useImpactChartData';

export const useImpactVisualization = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategories: string[],
  selectedYear: number | null,
  selectedLevels: string[]
) => {
  // Get chart data using the optimized hook
  const { byLevel, byCategory } = useImpactChartData(
    processedData,
    selectedYear,
    selectedCategories,
    selectedLevels,
    selectedCategories, // Using selectedCategories as categories to reduce props
    selectedLevels     // Using selectedLevels as impactLevels to reduce props
  );

  // Calculate hasData efficiently with proper dependency tracking
  const hasData = useMemo(() => 
    byLevel.length > 0 && byCategory.length > 0, 
    [byLevel, byCategory] // Track the actual arrays, not just their length
  );

  return {
    byLevel,
    byCategory,
    hasData
  };
};
