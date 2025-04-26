
import { useMemo } from 'react';
import { getFullCountryName } from '@/components/CountrySelect';
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
  const seriesData = useMemo(() => {
    if (!selectedYear || !selectedImpactLevel || selectedCategories.length === 0 || activeCountries.length === 0) {
      return [];
    }

    console.log('Creating series data for countries:', activeCountries);
    
    return activeCountries.map(country => {
      // Use country-specific data if available, otherwise fall back to processedData
      const countryData = countryDataMap?.[country]?.processedData || processedData;
      console.log(`Using data for ${country}:`, countryData ? 'Country-specific data' : 'Fallback data');
      
      // Map each selected category to its value for this country and impact level
      const data = selectedCategories.map(category => {
        const value = countryData[category]?.[selectedYear]?.[selectedImpactLevel] || 0;
        return value * 100; // Convert to percentage for display
      });

      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
  }, [activeCountries, selectedCategories, processedData, selectedYear, selectedImpactLevel, countryDataMap]);

  const impactLevelData = useMemo(() => {
    if (!selectedYear || !selectedCategory || impactLevels.length === 0 || activeCountries.length === 0) {
      return [];
    }
    
    return activeCountries.map(country => {
      // Use country-specific data if available, otherwise fall back to processedData
      const countryData = countryDataMap?.[country]?.processedData || processedData;
      
      // Map each impact level to its value for this country and selected category
      const data = impactLevels.map(level => {
        const value = countryData[selectedCategory]?.[selectedYear]?.[level] || 0;
        return value * 100; // Convert to percentage for display
      });

      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
  }, [activeCountries, impactLevels, processedData, selectedCategory, selectedYear, countryDataMap]);

  return {
    seriesData,
    impactLevelData
  };
};
