
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";

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
  
  // Process data from each country
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    console.log(`Processing data for ${country}: ${countryData.length} entries`);
    
    // For standardization, we'll need market statistics per year
    const marketStatsByYear: Map<number, { mean: number; stdDev: number }> = new Map();
    
    if (standardized && Array.isArray((countryData as any).marketData)) {
      const marketData = (countryData as any).marketData;
      
      // Group market data by year
      const marketDataByYear = new Map<number, any[]>();
      marketData.forEach((item: any) => {
        if (item.Year === null || item.Score === null) return;
        
        const year = Number(item.Year);
        if (!marketDataByYear.has(year)) {
          marketDataByYear.set(year, []);
        }
        marketDataByYear.get(year)?.push(item);
      });
      
      calculateMarketStats(marketDataByYear, marketStatsByYear);
    }
    
    // Process data for each brand
    selectedBrands.forEach(brand => {
      // Filter data for this brand
      const brandData = countryData.filter(item => item.Brand === brand);
      
      console.log(`Brand ${brand} in ${country}: ${brandData.length} data points`);
      
      if (brandData.length === 0) return;
      
      // For each data point
      brandData.forEach(dataPoint => {
        if (dataPoint.Year === null) return;
        
        // Use 0 for null scores instead of skipping them
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
        
        // Calculate score (standardized or raw)
        let finalScore = score;
        
        if (standardized && marketStatsByYear.has(year)) {
          const stats = marketStatsByYear.get(year)!;
          if (stats.stdDev > 0) {
            finalScore = (score - stats.mean) / stats.stdDev;
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
        
        // Set undefined or null values to 0 or undefined based on context
        if (score !== undefined) {
          dataPoint[dataKey] = score;
        } else {
          // For years where we have no data, check if we need to connect the dots
          // by interpolating values or leaving them undefined
          const hasEarlierData = Array.from(countryMap.keys())
            .some(yr => yr < year);
          const hasLaterData = Array.from(countryMap.keys())
            .some(yr => yr > year);
            
          // If this year is between years with data, set to null to allow connection
          // This helps recharts connect lines across gaps
          if (hasEarlierData && hasLaterData) {
            dataPoint[dataKey] = null; // Let recharts handle the gap
          } else {
            dataPoint[dataKey] = 0; // Default to 0 for years outside the data range
          }
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
