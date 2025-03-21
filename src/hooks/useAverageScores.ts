
import { useMemo } from 'react';

export interface YearlyAverage {
  year: number;
  average: number;
}

/**
 * Extract yearly average scores from chart data
 */
export const useAverageScores = (
  chartData: any[],
  country: string,
  standardized: boolean // kept for API compatibility but ignored
): YearlyAverage[] => {
  return useMemo(() => {
    // Check if there's data and a country specified
    if (!chartData || chartData.length === 0 || !country) {
      console.log("No chart data or no country specified for averages");
      return [];
    }
    
    // Get the averageScores property from chartData
    const averageScores = (chartData as any).averageScores;
    
    if (!averageScores || typeof averageScores.get !== 'function') {
      console.log("No valid average scores property found in chart data");
      // Additional debug info
      console.log("Chart data type:", typeof chartData);
      console.log("Chart data properties:", Object.getOwnPropertyNames(chartData));
      console.log("Has averageScores:", Object.getOwnPropertyNames(chartData).includes('averageScores'));
      
      // Try to access potential non-enumerable property
      const descriptors = Object.getOwnPropertyDescriptors(chartData);
      console.log("Has non-enumerable averageScores:", 'averageScores' in descriptors);
      
      return [];
    }
    
    console.log("Available countries in average scores:", 
      Array.from(averageScores.keys()).join(', ')
    );
    
    // Try exact match first
    let countryAverages = averageScores.get(country);
    
    // If not found, try case-insensitive match
    if (!countryAverages) {
      const countryLower = country.toLowerCase();
      for (const [key, value] of averageScores.entries()) {
        if (key.toLowerCase() === countryLower) {
          countryAverages = value;
          console.log(`Found average scores for country '${key}' using case-insensitive match`);
          break;
        }
      }
    }
    
    if (!countryAverages || countryAverages.size === 0) {
      console.log(`No average scores found for country: ${country}`);
      return [];
    }
    
    // Convert to array format
    const yearlyAverages = Array.from(countryAverages.entries())
      .map(([year, average]) => ({
        year: Number(year),
        average: Number(average)
      }))
      .sort((a, b) => a.year - b.year);
    
    console.log(`Found ${yearlyAverages.length} average scores for ${country}:`, yearlyAverages);
    return yearlyAverages;
  }, [chartData, country]);
};
