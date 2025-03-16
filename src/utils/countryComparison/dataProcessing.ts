
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { standardizeScore } from "@/utils/countryChartDataUtils";

/**
 * Processes data for the country comparison line chart
 */
export const processLineChartData = (
  allCountriesData: MultiCountryData,
  selectedBrands: string[],
  standardized: boolean
) => {
  // If there's no data, return empty array
  if (Object.keys(allCountriesData).length === 0) {
    return { chartData: [], years: [] };
  }
  
  console.log("Processing data for line chart with countries:", Object.keys(allCountriesData));
  
  // Collect all years from all countries
  const allYears = new Set<number>();
  
  // Prepare data structure for each brand and country
  const brandCountryData: Map<string, Map<string, Map<number, number>>> = new Map();
  
  // First calculate country averages by year
  const countryYearAverages: Map<string, Map<number, { sum: number; count: number; mean: number; squaredDiffs: number[]; stdDev: number }>> = new Map();
  
  // Process data from each country to calculate averages first
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    console.log(`Pre-processing country averages for ${country}: ${countryData.length} entries`);
    
    if (!countryYearAverages.has(country)) {
      countryYearAverages.set(country, new Map());
    }
    
    const yearAveragesMap = countryYearAverages.get(country)!;
    
    // First pass: calculate means for each year
    countryData.forEach(item => {
      if (item.Year === null || item.Score === null) return;
      
      const year = Number(item.Year);
      const score = Number(item.Score);
      
      if (isNaN(score)) return;
      
      if (!yearAveragesMap.has(year)) {
        yearAveragesMap.set(year, { sum: 0, count: 0, mean: 0, squaredDiffs: [], stdDev: 0 });
      }
      
      const stats = yearAveragesMap.get(year)!;
      stats.sum += score;
      stats.count++;
    });
    
    // Calculate means
    yearAveragesMap.forEach((stats, year) => {
      if (stats.count > 0) {
        stats.mean = stats.sum / stats.count;
      }
    });
    
    // Second pass: calculate squared differences for std dev
    countryData.forEach(item => {
      if (item.Year === null || item.Score === null) return;
      
      const year = Number(item.Year);
      const score = Number(item.Score);
      
      if (isNaN(score)) return;
      
      if (yearAveragesMap.has(year)) {
        const stats = yearAveragesMap.get(year)!;
        const diff = score - stats.mean;
        stats.squaredDiffs.push(diff * diff);
      }
    });
    
    // Calculate standard deviations
    yearAveragesMap.forEach(stats => {
      if (stats.squaredDiffs.length > 0) {
        const avgSquaredDiff = stats.squaredDiffs.reduce((sum, val) => sum + val, 0) / stats.squaredDiffs.length;
        stats.stdDev = Math.sqrt(avgSquaredDiff);
      }
    });
    
    console.log(`Calculated yearly averages for ${country}:`, 
      Array.from(yearAveragesMap.entries()).map(([year, stats]) => 
        `${year}: mean=${stats.mean.toFixed(2)}, stdDev=${stats.stdDev.toFixed(2)} (${stats.count} brands)`
      )
    );
  });
  
  // Now process the actual data for the selected brands
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    console.log(`Processing data for ${country}: ${countryData.length} entries`);
    
    // Process data for each brand
    selectedBrands.forEach(brand => {
      // Filter data for this brand
      const brandData = countryData.filter(item => item.Brand === brand);
      
      console.log(`Brand ${brand} in ${country}: ${brandData.length} data points`);
      
      if (brandData.length === 0) return;
      
      // For each data point
      brandData.forEach(dataPoint => {
        if (dataPoint.Year === null) return;
        
        // Only process points with actual scores
        const score = dataPoint.Score === null ? 0 : Number(dataPoint.Score);
        const year = Number(dataPoint.Year);
        
        console.log(`Data point for ${brand}/${country}/${year}: ${score}`);
        
        // Add to the set of all years
        allYears.add(year);
        
        // Initialize data structures if needed
        if (!brandCountryData.has(brand)) {
          brandCountryData.set(brand, new Map());
        }
        const brandMap = brandCountryData.get(brand)!;
        
        if (!brandMap.has(country)) {
          brandMap.set(country, new Map());
        }
        const countryMap = brandMap.get(country)!;
        
        // Get the year's statistics for this country
        let finalScore = score;
        
        if (standardized && countryYearAverages.has(country)) {
          const yearStats = countryYearAverages.get(country)!.get(year);
          
          if (yearStats && yearStats.stdDev > 0) {
            finalScore = standardizeScore(score, yearStats.mean, yearStats.stdDev);
            console.log(`Standardized score for ${brand}/${country}/${year}: ${finalScore.toFixed(2)} (raw=${score}, country avg=${yearStats.mean.toFixed(2)}, stdDev=${yearStats.stdDev.toFixed(2)})`);
          } else {
            console.warn(`Missing or invalid year stats for ${country}/${year}`);
          }
        }
        
        countryMap.set(year, finalScore);
      });
    });
  });
  
  // Convert all years to sorted array
  const years = Array.from(allYears).sort((a, b) => a - b);
  
  console.log("Years in the data:", years);
  console.log("Brand-country combinations:", 
    Array.from(brandCountryData.entries()).map(([brand, countryMap]) => ({
      brand,
      countries: Array.from(countryMap.keys())
    }))
  );
  
  // Create data points for the chart - ensure every year is represented
  const chartData = years.map(year => {
    const dataPoint: any = { year };
    
    // Add data for each brand and country
    brandCountryData.forEach((brandMap, brand) => {
      brandMap.forEach((countryMap, country) => {
        const score = countryMap.get(year);
        const dataKey = `${brand}-${country}`;
        
        // Set undefined or null values to null to allow for connectNulls to work
        if (score !== undefined) {
          dataPoint[dataKey] = score;
        } else {
          // For years where we have no data, set to null to allow line connection
          dataPoint[dataKey] = null;
        }
      });
    });
    
    return dataPoint;
  });
  
  // Filter out years with no meaningful data
  const filteredChartData = chartData.filter(point => {
    // Check if this point has any data beyond the year
    return Object.keys(point).length > 1;
  });
  
  console.log("Generated chart data with points:", filteredChartData.length);
  if (filteredChartData.length > 0) {
    console.log("First data point:", JSON.stringify(filteredChartData[0]));
    console.log("Last data point:", JSON.stringify(filteredChartData[filteredChartData.length - 1]));
  }
  
  return { chartData: filteredChartData, years };
};

/**
 * Calculates market statistics (mean and standard deviation) for each year
 */
function calculateMarketStats(
  marketDataByYear: Map<number, any[]>,
  marketStatsByYear: Map<number, { mean: number; stdDev: number }>
) {
  // Calculate statistics for each year
  marketDataByYear.forEach((yearData, year) => {
    const validScores = yearData
      .map(item => Number(item.Score))
      .filter(score => !isNaN(score) && score !== null);
    
    if (validScores.length > 0) {
      const mean = validScores.reduce((sum, val) => sum + val, 0) / validScores.length;
      const variance = validScores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validScores.length;
      const stdDev = Math.sqrt(variance);
      
      marketStatsByYear.set(year, { mean, stdDev });
    }
  });
}
