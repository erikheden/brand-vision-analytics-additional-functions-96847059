
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { BrandData } from "@/types/brand";
import { getAverageScore } from "@/utils/countryComparison/averageScoreUtils";

/**
 * Processes data for the country comparison line chart
 * Optimized to reduce unnecessary calculations and object creations
 */
export const processLineChartData = (
  allCountriesData: MultiCountryData,
  selectedBrands: string[],
  standardized: boolean
) => {
  // Early return for empty data
  if (!allCountriesData || Object.keys(allCountriesData).length === 0) {
    return { chartData: [], years: [] };
  }
  
  console.log("Processing data for line chart with countries:", Object.keys(allCountriesData));
  
  // Get average scores if available
  const averageScores = (allCountriesData as any).averageScores as Map<string, Map<number, number>> | undefined;
  const hasAverageScores = averageScores && averageScores.size > 0;
  
  // Log standardization setting
  if (standardized) {
    console.log("Standardization parameter is true but we're ignoring it - using raw scores only");
  }
  
  // Collect all years from all countries - using Set for uniqueness
  const allYears = new Set<number>();
  
  // Prepare data structure for each brand and country
  const brandCountryData = new Map<string, Map<string, Map<number, number | null>>>();
  
  // Process the data for the selected brands - do this only once
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    // Process data for each brand
    for (const brand of selectedBrands) {
      // Filter data for this brand
      const brandData = countryData.filter(item => item.Brand === brand);
      
      if (brandData.length === 0) continue;
      
      // Initialize data structures if needed
      if (!brandCountryData.has(brand)) {
        brandCountryData.set(brand, new Map());
      }
      const brandMap = brandCountryData.get(brand)!;
      
      if (!brandMap.has(country)) {
        brandMap.set(country, new Map());
      }
      const countryMap = brandMap.get(country)!;
      
      // For each data point
      for (const dataPoint of brandData) {
        if (dataPoint.Year === null) continue;
        
        // Only process points with actual scores
        const score = dataPoint.Score === null ? null : Number(dataPoint.Score);
        const year = Number(dataPoint.Year);
        
        // Skip zero or null scores - they will create gaps in the chart
        if (score === 0 || score === null) {
          continue;
        }
        
        // Add year to all years set
        allYears.add(year);
        
        // Always use raw scores since we're removing standardization
        countryMap.set(year, score);
      }
    }
    
    // Add market average if available
    if (hasAverageScores) {
      // Special handling for market average
      const marketAverageBrand = "Market Average";
      
      if (!brandCountryData.has(marketAverageBrand)) {
        brandCountryData.set(marketAverageBrand, new Map());
      }
      const brandMap = brandCountryData.get(marketAverageBrand)!;
      
      if (!brandMap.has(country)) {
        brandMap.set(country, new Map());
      }
      const countryMap = brandMap.get(country)!;
      
      // For each year with data
      Array.from(allYears).forEach(year => {
        const avgScore = getAverageScore(averageScores, country, year);
        if (avgScore !== null) {
          countryMap.set(year, avgScore);
        }
      });
    }
  });
  
  // Convert all years to sorted array
  const years = Array.from(allYears).sort((a, b) => a - b);
  
  if (years.length === 0) {
    return { chartData: [], years: [] };
  }
  
  // Create data points for the chart - ensure every year is represented
  const chartData = years.map(year => {
    const dataPoint: Record<string, any> = { year };
    
    // Add data for each brand and country
    brandCountryData.forEach((brandMap, brand) => {
      brandMap.forEach((countryMap, country) => {
        const score = countryMap.get(year);
        const dataKey = `${brand}-${country}`;
        
        if (score !== undefined) {
          dataPoint[dataKey] = score;
        } else {
          // For years where we have no data, set to null to allow line breaks
          dataPoint[dataKey] = null;
        }
        
        // Store country information with each data point
        if (!dataPoint.country) {
          dataPoint.country = country;
        }
      });
    });
    
    return dataPoint;
  }).filter(point => {
    // Check if this point has any data beyond the year
    return Object.keys(point).length > 1;
  }).sort((a, b) => a.year - b.year);
  
  console.log("Generated chart data with points:", chartData.length);
  
  return { chartData, years };
};
