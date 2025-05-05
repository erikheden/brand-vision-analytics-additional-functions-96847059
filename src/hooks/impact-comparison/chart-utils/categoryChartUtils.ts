
import { createCommonChartOptions } from './chartConfigUtils';

/**
 * Creates chart options for category comparison view
 */
export const createCategoryChartOptions = (
  selectedYear: number | null,
  selectedImpactLevel: string,
  selectedCategories: string[],
  activeCountries: string[],
  series: any[]
) => {
  if (!selectedYear || !selectedImpactLevel || selectedCategories.length === 0) {
    return { series: [] };
  }
  
  const baseOptions = createCommonChartOptions(
    `${selectedImpactLevel} Impact Level Across Categories (${selectedYear})`,
    `Comparing ${activeCountries.length} countries`,
    activeCountries
  );
  
  return {
    ...baseOptions,
    xAxis: {
      categories: selectedCategories,
      title: { text: 'Categories' },
      labels: {
        rotation: -45,
        style: { fontSize: '11px', fontFamily: 'Inter, sans-serif' }
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Percentage (%)',
        style: { color: '#34502b', fontFamily: 'Inter, sans-serif' }
      },
      labels: { format: '{value}%' }
    },
    series
  };
};

/**
 * Extracts category values for a specific country, impact level, and year
 */
export const getCategoryValues = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  countrySpecificData: Record<string, any> | undefined,
  selectedCategories: string[],
  selectedYear: number | null,
  selectedImpactLevel: string,
  country: string
) => {
  return selectedCategories.map(category => {
    let value = 0;
    
    // Try to get value from country-specific data first
    if (countrySpecificData?.[category]?.[selectedYear]?.[selectedImpactLevel] !== undefined) {
      value = countrySpecificData[category][selectedYear][selectedImpactLevel];
    } 
    // Fall back to default processedData if specific data is not available
    else if (processedData[category]?.[selectedYear]?.[selectedImpactLevel] !== undefined) {
      value = processedData[category][selectedYear][selectedImpactLevel];
    }
    
    return value * 100; // Convert to percentage for display
  });
};

