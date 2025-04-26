
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
  const { createCategoryChart: categoryChartOptions, createImpactLevelChart: impactLevelChartOptions } = useChartOptions(
    'byCategory',
    selectedYear,
    selectedCategory,
    selectedImpactLevel,
    selectedCategories,
    activeCountries
  );

  // Debug log for countryDataMap
  useMemo(() => {
    if (countryDataMap) {
      console.log("useComparisonChartData - Country Data Map keys:", Object.keys(countryDataMap));
      activeCountries.forEach(country => {
        if (countryDataMap[country]?.processedData) {
          const sampleCategory = selectedCategories[0];
          const sampleImpactLevel = selectedImpactLevel;
          if (sampleCategory && selectedYear && sampleImpactLevel) {
            console.log(`Sample data for ${country}, ${sampleCategory}, ${selectedYear}, ${sampleImpactLevel}:`, 
              countryDataMap[country]?.processedData[sampleCategory]?.[selectedYear]?.[sampleImpactLevel]);
          }
        } else {
          console.log(`No processed data for ${country}`);
        }
      });
    }
  }, [countryDataMap, activeCountries, selectedCategories, selectedYear, selectedImpactLevel]);

  const { seriesData, impactLevelData } = useProcessedChartData(
    processedData,
    selectedCategory,
    selectedImpactLevel,
    selectedYear,
    selectedCategories,
    impactLevels,
    activeCountries,
    countryDataMap  // Pass the country data map
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
