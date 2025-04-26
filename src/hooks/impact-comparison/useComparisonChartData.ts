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
  activeCountries: string[],
  countryDataMap?: Record<string, any>  // Add country data map parameter
) => {
  // Only create chart options when all dependencies are available
  const { createCategoryChart: categoryChartOptions, createImpactLevelChart: impactLevelChartOptions } = useChartOptions(
    'byCategory',
    selectedYear,
    selectedCategory,
    selectedImpactLevel,
    selectedCategories,
    activeCountries
  );

  // Debug log for countryDataMap - keeping limited to avoid excessive logging
  useMemo(() => {
    if (countryDataMap && Object.keys(countryDataMap).length > 0 && selectedYear) {
      console.log("useComparisonChartData - Country Data Map keys:", Object.keys(countryDataMap));
      // Only log sample data for the first country and category to reduce console spam
      const sampleCountry = activeCountries[0];
      const sampleCategory = selectedCategories[0];
      
      if (sampleCountry && sampleCategory && countryDataMap[sampleCountry]?.processedData) {
        console.log(`Sample data for ${sampleCountry}, ${sampleCategory}, ${selectedYear}, ${selectedImpactLevel}:`, 
          countryDataMap[sampleCountry]?.processedData[sampleCategory]?.[selectedYear]?.[selectedImpactLevel]);
      }
    }
  }, [countryDataMap, selectedYear, selectedCategories[0], activeCountries[0], selectedImpactLevel]);

  // Get processed series data for charts
  const { seriesData, impactLevelData } = useProcessedChartData(
    processedData,
    selectedCategory,
    selectedImpactLevel,
    selectedYear,
    selectedCategories,
    impactLevels,
    activeCountries,
    countryDataMap
  );

  // Memoize the final chart options with series data
  const createCategoryChart = useMemo(() => {
    if (!categoryChartOptions || !seriesData.length) return { chart: { type: 'bar' }, series: [] };
    return {
      ...categoryChartOptions,
      series: seriesData
    };
  }, [categoryChartOptions, seriesData]);

  const createImpactLevelChart = useMemo(() => {
    if (!impactLevelChartOptions || !impactLevelData.length) return { chart: { type: 'bar' }, series: [] };
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
