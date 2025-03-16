
import { BrandData } from "@/types/brand";

/**
 * Calculate year-country statistics for standardization
 * Returns a nested map of country -> year -> stats
 */
export const useYearStatistics = (allCountriesData: Record<string, BrandData[]>) => {
  // For each country, calculate yearly averages
  const countryYearStats = new Map<string, Map<number, { mean: number; stdDev: number; count: number }>>();
  
  // Calculate country averages for each year
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    if (!countryYearStats.has(country)) {
      countryYearStats.set(country, new Map());
    }
    
    const yearStatsMap = countryYearStats.get(country)!;
    
    // Group all scores by year
    const scoresByYear = new Map<number, number[]>();
    
    // Add all scores (not just selected brands) to calculate proper country average
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
      if (scores.length === 0) return;
      
      const sum = scores.reduce((total, score) => total + score, 0);
      const mean = sum / scores.length;
      
      const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
      const variance = squaredDiffs.reduce((total, diff) => total + diff, 0) / scores.length;
      const stdDev = Math.sqrt(variance);
      
      yearStatsMap.set(year, { mean, stdDev, count: scores.length });
      
      console.log(`Country ${country}, Year ${year}: mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)} (${scores.length} brands)`);
    });
  });
  
  return countryYearStats;
};
