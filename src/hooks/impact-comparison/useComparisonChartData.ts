
import { useMemo } from 'react';
import { getFullCountryName } from '@/components/CountrySelect';
import { createCategoryChartOptions, getCategoryValues } from './chart-utils/categoryChartUtils';
import { createImpactLevelChartOptions, getImpactLevelValues } from './chart-utils/impactLevelChartUtils';
import { ProcessedChartData } from '@/types/impact';

export const useComparisonChartData = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategory: string,
  selectedImpactLevel: string,
  selectedYear: number | null,
  selectedCategories: string[],
  impactLevels: string[],
  activeCountries: string[],
  countryDataMap?: Record<string, any>
) => {
  // Create category comparison chart options
  const createCategoryChart = useMemo(() => {
    if (!selectedYear || !selectedImpactLevel || selectedCategories.length === 0 || activeCountries.length < 2) {
      return { series: [] };
    }
    
    // Create series for each country
    const series = activeCountries.map(country => {
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData || {};
      
      // Get values for this country across all selected categories
      const data = getCategoryValues(
        processedData,
        countrySpecificData,
        selectedCategories,
        selectedYear,
        selectedImpactLevel,
        country
      );
      
      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
    
    return createCategoryChartOptions(
      selectedYear,
      selectedImpactLevel,
      selectedCategories,
      activeCountries,
      series
    );
  }, [
    selectedYear, 
    selectedImpactLevel,
    // Use stable string representation of arrays instead of the arrays themselves
    selectedCategories.join(','), 
    activeCountries.join(','),
    processedData, 
    countryDataMap
  ]);
  
  // Create impact level comparison chart options
  const createImpactLevelChart = useMemo(() => {
    if (!selectedYear || !selectedCategory || impactLevels.length === 0 || activeCountries.length < 2) {
      return { series: [] };
    }
    
    // Create series for each country
    const series = activeCountries.map(country => {
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData || {};
      
      // Get values for this country across all impact levels
      const data = getImpactLevelValues(
        processedData,
        countrySpecificData,
        selectedCategory,
        selectedYear,
        impactLevels,
        country
      );
      
      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
    
    return createImpactLevelChartOptions(
      selectedYear,
      selectedCategory,
      impactLevels,
      activeCountries,
      series
    );
  }, [
    selectedYear, 
    selectedCategory,
    // Use stable string representation of arrays
    impactLevels.join(','),
    activeCountries.join(','),
    processedData, 
    countryDataMap
  ]);
  
  return {
    createCategoryChart,
    createImpactLevelChart
  };
};
