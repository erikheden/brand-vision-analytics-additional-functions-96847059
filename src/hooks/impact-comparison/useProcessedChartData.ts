
import { useMemo } from 'react';
import { getFullCountryName } from '@/components/CountrySelect';
import { getCategoryValues } from './chart-utils/categoryChartUtils';
import { getImpactLevelValues } from './chart-utils/impactLevelChartUtils';
import { ProcessedChartData } from '@/types/impact';

export const useProcessedChartData = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategory: string,
  selectedImpactLevel: string,
  selectedYear: number | null,
  selectedCategories: string[],
  impactLevels: string[],
  activeCountries: string[],
  countryDataMap?: Record<string, any>
) => {
  // Process data for the category-based chart (showing different categories for a specific impact level)
  const seriesData = useMemo(() => {
    if (!selectedImpactLevel || activeCountries.length === 0 || selectedCategories.length === 0) {
      return [];
    }

    return activeCountries.map(country => {
      // Get country-specific data if available
      const countrySpecificData = countryDataMap?.[country]?.processedData;
      
      // Get values for each category
      const values = getCategoryValues(
        processedData,
        countrySpecificData,
        selectedCategories, 
        selectedYear, 
        selectedImpactLevel,
        country
      );
      
      return {
        name: getFullCountryName(country),
        data: values,
        type: 'column' as const
      };
    });
  }, [
    selectedImpactLevel, 
    // Using join to create stable string dependencies instead of array references
    activeCountries.join(','), 
    selectedCategories.join(','), 
    processedData, 
    countryDataMap, 
    selectedYear
  ]);
  
  // Process data for the impact level-based chart (showing different impact levels for a specific category)
  const impactLevelData = useMemo(() => {
    if (!selectedCategory || activeCountries.length === 0 || impactLevels.length === 0) {
      return [];
    }

    return activeCountries.map(country => {
      // Get country-specific data if available
      const countrySpecificData = countryDataMap?.[country]?.processedData;
      
      // Get values for each impact level
      const values = getImpactLevelValues(
        processedData,
        countrySpecificData,
        selectedCategory, 
        selectedYear, 
        impactLevels,
        country
      );
      
      return {
        name: getFullCountryName(country),
        data: values,
        type: 'column' as const
      };
    });
  }, [
    selectedCategory, 
    // Using join to create stable string dependencies instead of array references
    activeCountries.join(','), 
    impactLevels.join(','), 
    processedData, 
    countryDataMap, 
    selectedYear
  ]);
  
  return {
    seriesData,
    impactLevelData
  };
};

export default useProcessedChartData;
