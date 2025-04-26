
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
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData;
      
      if (!countrySpecificData) {
        console.warn(`No specific data found for country ${country}, falling back to default data`);
      }
      
      // Map each selected category to its value for this country and impact level
      const data = selectedCategories.map(category => {
        // First try to get value from country-specific data
        if (countrySpecificData && 
            countrySpecificData[category] && 
            countrySpecificData[category][selectedYear] && 
            countrySpecificData[category][selectedYear][selectedImpactLevel] !== undefined) {
          
          const value = countrySpecificData[category][selectedYear][selectedImpactLevel];
          console.log(`Using country-specific data for ${country}, category ${category}: ${value}`);
          return value * 100; // Convert to percentage for display
        } 
        
        // Fall back to default processedData if specific data is not available
        const value = processedData[category]?.[selectedYear]?.[selectedImpactLevel] || 0;
        console.log(`Using fallback data for ${country}, category ${category}: ${value}`);
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
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData;
      
      if (!countrySpecificData) {
        console.warn(`No specific data found for country ${country} for impact levels, falling back to default data`);
      }
      
      // Map each impact level to its value for this country and selected category
      const data = impactLevels.map(level => {
        // First try to get value from country-specific data
        if (countrySpecificData && 
            countrySpecificData[selectedCategory] && 
            countrySpecificData[selectedCategory][selectedYear] && 
            countrySpecificData[selectedCategory][selectedYear][level] !== undefined) {
          
          const value = countrySpecificData[selectedCategory][selectedYear][level];
          console.log(`Using country-specific data for ${country}, impact level ${level}: ${value}`);
          return value * 100; // Convert to percentage for display
        } 
        
        // Fall back to default processedData if specific data is not available
        const value = processedData[selectedCategory]?.[selectedYear]?.[level] || 0;
        console.log(`Using fallback data for ${country}, impact level ${level}: ${value}`);
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
