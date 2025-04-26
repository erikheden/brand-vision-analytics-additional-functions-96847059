
import { useMemo } from 'react';
import { useChartOptions } from './useChartOptions';
import { useProcessedChartData } from './useProcessedChartData';

export const useComparisonChartData = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategory: string,
  selectedImpactLevel: string,
  selectedYear: number | null,
  selectedCategories: string[],
  impactLevels: string[],
  activeCountries: string[]
) => {
  const { createCategoryChart: categoryChartOptions, createImpactLevelChart: impactLevelChartOptions } = useChartOptions(
    'byCategory',
    selectedYear,
    selectedCategory,
    selectedImpactLevel,
    selectedCategories,
    activeCountries
  );

  const { seriesData, impactLevelData } = useProcessedChartData(
    processedData,
    selectedCategory,
    selectedImpactLevel,
    selectedYear,
    selectedCategories,
    impactLevels,
    activeCountries
  );

  const createCategoryChart = useMemo(() => {
    if (!categoryChartOptions) return { chart: { type: 'bar' }, series: [] };
    return {
      ...categoryChartOptions,
      series: seriesData
    };
  }, [categoryChartOptions, seriesData]);

  const createImpactLevelChart = useMemo(() => {
    if (!impactLevelChartOptions) return { chart: { type: 'bar' }, series: [] };
    return {
      ...impactLevelChartOptions,
      series: impactLevelData
    };
  }, [impactLevelChartOptions, impactLevelData]);

  return {
    createCategoryChart,
    createImpactLevelChart
  };
};
