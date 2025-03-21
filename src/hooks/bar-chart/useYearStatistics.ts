
import { useMemo } from 'react';
import { BrandData } from "@/types/brand";

/**
 * Calculates statistical information for each country-year combination
 * @param allCountriesData Data grouped by country with brand scores
 * @returns A nested map of country -> year -> stats object with mean, stdDev, and count
 */
export const useYearStatistics = (allCountriesData: Record<string, BrandData[]>) => {
  return useMemo(() => {
    // For each country, calculate yearly statistics (mean, stdDev, count)
    const countryYearStats = new Map<string, Map<number, { mean: number; stdDev: number; count: number }>>();
    
    // Process data for each country
    Object.entries(allCountriesData).forEach(([country, countryData]) => {
      if (!countryData || countryData.length === 0) return;
      
      if (!countryYearStats.has(country)) {
        countryYearStats.set(country, new Map());
      }
      
      const yearStatsMap = countryYearStats.get(country)!;
      
      // Group all scores by year
      const scoresByYear = new Map<number, number[]>();
      
      // Add all valid scores to calculate proper country statistics
      if (Array.isArray(countryData)) {
        countryData.forEach(item => {
          if (item.Year === null || item.Score === null) return;
          
          const year = Number(item.Year);
          const score = Number(item.Score);
          
          if (isNaN(score)) return;
          
          if (!scoresByYear.has(year)) {
            scoresByYear.set(year, []);
          }
          
          scoresByYear.get(year)?.push(score);
        });
      }
      
      // Calculate mean and standard deviation for each year
      scoresByYear.forEach((scores, year) => {
        // Skip years with insufficient data points for standardization
        if (scores.length < 2) {
          console.warn(`Not enough data points for ${country}, Year ${year}: ${scores.length} brands`);
          return;
        }
        
        // Calculate mean (average)
        const sum = scores.reduce((total, score) => total + score, 0);
        const mean = sum / scores.length;
        
        // Calculate standard deviation
        const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
        const variance = squaredDiffs.reduce((total, diff) => total + diff, 0) / scores.length;
        const stdDev = Math.sqrt(variance);
        
        yearStatsMap.set(year, { mean, stdDev, count: scores.length });
        
        console.log(`Country ${country}, Year ${year}: mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)} (${scores.length} brands)`);
      });
    });
    
    return countryYearStats;
  }, [allCountriesData]);
};

export default useYearStatistics;
