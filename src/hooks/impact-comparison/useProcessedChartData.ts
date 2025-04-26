
import { useMemo } from 'react';
import { getFullCountryName } from '@/components/CountrySelect';

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
  // Create series data for category comparison chart
  const seriesData = useMemo(() => {
    if (!selectedYear || !selectedImpactLevel || selectedCategories.length === 0 || activeCountries.length === 0) {
      return [];
    }
    
    // Debug logging
    console.log('Creating series data with:', {
      activeCountries,
      selectedYear,
      selectedImpactLevel,
      selectedCategories: selectedCategories.length
    });
    
    if (countryDataMap) {
      console.log('Country data map available for:', Object.keys(countryDataMap));
    }
    
    return activeCountries.map(country => {
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData;
      
      // Map each selected category to its value for this country and impact level
      const data = selectedCategories.map(category => {
        let value = 0;
        
        // First try to get value from country-specific data
        if (countrySpecificData && 
            countrySpecificData[category] && 
            countrySpecificData[category][selectedYear] && 
            countrySpecificData[category][selectedYear][selectedImpactLevel] !== undefined) {
          
          value = countrySpecificData[category][selectedYear][selectedImpactLevel];
          // Debug log successful data retrieval
          console.log(`Found data for ${country}, ${category}, ${selectedYear}, ${selectedImpactLevel}: ${value}`);
        } 
        // Fall back to default processedData if specific data is not available
        else if (processedData[category]?.[selectedYear]?.[selectedImpactLevel] !== undefined) {
          value = processedData[category][selectedYear][selectedImpactLevel];
          console.log(`Using fallback data for ${country}, ${category}: ${value}`);
        } else {
          console.log(`No data found for ${country}, ${category}, ${selectedYear}, ${selectedImpactLevel}`);
        }
        
        return value * 100; // Convert to percentage for display
      });

      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
  }, [
    activeCountries, 
    selectedCategories, 
    processedData, 
    selectedYear, 
    selectedImpactLevel, 
    countryDataMap
  ]);

  // Create series data for impact level comparison chart
  const impactLevelData = useMemo(() => {
    if (!selectedYear || !selectedCategory || impactLevels.length === 0 || activeCountries.length === 0) {
      return [];
    }
    
    // Debug logging
    console.log('Creating impact level data with:', {
      activeCountries,
      selectedYear,
      selectedCategory,
      impactLevels: impactLevels.length
    });
    
    return activeCountries.map(country => {
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData;
      
      // Map each impact level to its value for this country and selected category
      const data = impactLevels.map(level => {
        let value = 0;
        
        // First try to get value from country-specific data
        if (countrySpecificData && 
            countrySpecificData[selectedCategory] && 
            countrySpecificData[selectedCategory][selectedYear] && 
            countrySpecificData[selectedCategory][selectedYear][level] !== undefined) {
          
          value = countrySpecificData[selectedCategory][selectedYear][level];
          console.log(`Found level data for ${country}, ${selectedCategory}, ${selectedYear}, ${level}: ${value}`);
        } 
        // Fall back to default processedData if specific data is not available
        else if (processedData[selectedCategory]?.[selectedYear]?.[level] !== undefined) {
          value = processedData[selectedCategory][selectedYear][level];
          console.log(`Using fallback level data for ${country}: ${value}`);
        } else {
          console.log(`No level data found for ${country}, ${selectedCategory}, ${selectedYear}, ${level}`);
        }
        
        return value * 100; // Convert to percentage for display
      });

      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
  }, [
    activeCountries, 
    impactLevels, 
    processedData, 
    selectedCategory, 
    selectedYear, 
    countryDataMap
  ]);

  return {
    seriesData,
    impactLevelData
  };
};
