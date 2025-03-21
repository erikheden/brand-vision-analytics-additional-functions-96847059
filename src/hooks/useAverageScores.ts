
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
      console.log("No chart data or no country specified");
      return [];
    }
    
    // Get the averageScores property from chartData
    const averageScores = (chartData as any).averageScores as Map<string, Map<number, number>> | undefined;
    
    if (!averageScores) {
      console.log("No average scores property found in chart data");
      return [];
    }
    
    console.log("Average scores property found:", 
      Array.from(averageScores.entries()).map(([country, yearMap]) => 
        `${country}: ${Array.from(yearMap.entries()).length} years`
      )
    );
    
    // Try exact match first
    let countryAverages = averageScores.get(country);
    
    // If not found, try case-insensitive match
    if (!countryAverages) {
      for (const [key, value] of averageScores.entries()) {
        if (key.toLowerCase() === country.toLowerCase()) {
          countryAverages = value;
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
        year,
        average
      }))
      .sort((a, b) => a.year - b.year);
    
    console.log(`Found ${yearlyAverages.length} average scores for ${country}:`, yearlyAverages);
    return yearlyAverages;
  }, [chartData, country]);
};
