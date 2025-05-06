
import { createCommonChartOptions } from './chartConfigUtils';

/**
 * Creates chart options for impact level comparison view
 */
export const createImpactLevelChartOptions = (
  selectedYear: number | null,
  selectedCategory: string,
  impactLevels: string[],
  activeCountries: string[],
  series: any[]
) => {
  if (!selectedYear || !selectedCategory || impactLevels.length === 0) {
    return { series: [] };
  }
  
  const baseOptions = createCommonChartOptions(
    `${selectedCategory} - Impact Levels Comparison (${selectedYear})`,
    `Comparing ${activeCountries.length} countries`,
    activeCountries
  );
  
  return {
    ...baseOptions,
    xAxis: {
      categories: impactLevels,
      title: { text: 'Impact Levels' }
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
 * Extracts impact level values for a specific country, category, and year
 */
export const getImpactLevelValues = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  countrySpecificData: Record<string, any> | undefined,
  selectedCategory: string,
  selectedYear: number | null,
  impactLevels: string[],
  country: string
) => {
  return impactLevels.map(level => {
    let value = 0;
    
    // Try to get value from country-specific data first
    if (countrySpecificData?.[selectedCategory]?.[selectedYear]?.[level] !== undefined) {
      value = countrySpecificData[selectedCategory][selectedYear][level];
    }
    // Fall back to default processedData if specific data is not available
    else if (processedData[selectedCategory]?.[selectedYear]?.[level] !== undefined) {
      value = processedData[selectedCategory][selectedYear][level];
    }
    
    return value * 100; // Convert to percentage for display
  });
};
