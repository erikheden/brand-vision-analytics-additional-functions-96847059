
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
// Remove standardizeScore import since we're removing standardization
// import { standardizeScore } from "@/utils/countryChartDataUtils"; 
import { BrandData } from "@/types/brand";
import { getAverageScore } from "@/utils/countryComparison/averageScoreUtils";

/**
 * Processes data for the country comparison line chart
 */
export const processLineChartData = (
  allCountriesData: MultiCountryData,
  selectedBrands: string[],
  standardized: boolean,
  marketData?: MultiCountryData
) => {
  // If there's no data, return empty array
  if (Object.keys(allCountriesData).length === 0) {
    return { chartData: [], years: [] };
  }
  
  console.log("Processing data for line chart with countries:", Object.keys(allCountriesData));
  
  // Get average scores if available
  const averageScores = (allCountriesData as any).averageScores;
  const hasAverageScores = averageScores && averageScores.size > 0;
  
  // Get country-year statistics if available
  const countryYearStats = (allCountriesData as any).countryYearStats;
  const hasCountryStats = countryYearStats && countryYearStats.size > 0;
  
  // Log standardization setting (though we're ignoring it)
  if (standardized) {
    console.log("Standardization parameter is true but we're ignoring it - using raw scores only");
  }
  
  // Collect all years from all countries
  const allYears = new Set<number>();
  
  // Prepare data structure for each brand and country
  const brandCountryData: Map<string, Map<string, Map<number, number | null>>> = new Map();
  
  // Process the data for the selected brands
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    console.log(`Processing data for ${country}: ${countryData.length} entries`);
    
    // Process data for each brand
    selectedBrands.forEach(brand => {
      // Filter data for this brand
      const brandData = countryData.filter(item => item.Brand === brand);
      
      console.log(`Brand ${brand} in ${country}: ${brandData.length} data points`);
      
      if (brandData.length === 0) return;
      
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
      brandData.forEach(dataPoint => {
        if (dataPoint.Year === null) return;
        
        // Only process points with actual scores
        const score = dataPoint.Score === null ? null : Number(dataPoint.Score);
        const year = Number(dataPoint.Year);
        
        // Skip zero or null scores - they will create gaps in the chart
        if (score === 0 || score === null) {
          console.log(`Skipping zero/null score for ${brand}/${country}/${year}`);
          return;
        }
        
        // Add year to all years set
        allYears.add(year);
        
        // Always use raw scores since we're removing standardization
        countryMap.set(year, score);
      });
    });
    
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
          console.log(`Added market average for ${country}/${year}: ${avgScore}`);
        }
      });
    }
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
  }).sort((a, b) => a.year - b.year);
  
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
