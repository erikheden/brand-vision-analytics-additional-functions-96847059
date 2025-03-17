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
  
  // First calculate country averages by year - we need this for standardization
  const countryYearStats = new Map<string, Map<number, { mean: number; stdDev: number; count: number }>>();
  
  // Calculate stats for each country and year across ALL brands (not just selected ones)
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    // Initialize stats map for this country
    if (!countryYearStats.has(country)) {
      countryYearStats.set(country, new Map());
    }
    
    const yearMap = countryYearStats.get(country)!;
    
    // Group data by year
    const scoresByYear = new Map<number, number[]>();
    
    // Collect all scores for each year
    countryData.forEach(item => {
      if (item.Year === null || item.Score === null) return;
      
      const year = Number(item.Year);
      const score = Number(item.Score);
      
      if (isNaN(score)) return;
      
      // Add year to all years set
      allYears.add(year);
      
      // Add score to year group
      if (!scoresByYear.has(year)) {
        scoresByYear.set(year, []);
      }
      
      scoresByYear.get(year)!.push(score);
    });
    
    // Calculate statistics for each year
    scoresByYear.forEach((scores, year) => {
      if (scores.length === 0) return;
      
      // Calculate mean
      const sum = scores.reduce((total, score) => total + score, 0);
      const mean = sum / scores.length;
      
      // Calculate standard deviation
      const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
      const variance = squaredDiffs.reduce((total, diff) => total + diff, 0) / scores.length;
      const stdDev = Math.sqrt(variance);
      
      // Store statistics with count for reference
      yearMap.set(year, { mean, stdDev, count: scores.length });
      
      console.log(`Country ${country}, Year ${year} stats: mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)} (from ${scores.length} brands)`);
    });
  });
  
  // Prepare data structure for each brand and country
  const brandCountryData: Map<string, Map<string, Map<number, number | null>>> = new Map();
  
  // Now process the data for the selected brands using the country stats we calculated
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
        
        // Get the year's statistics for this country
        let finalScore: number | null = score;
        
        if (standardized && countryYearStats.has(country)) {
          const yearStats = countryYearStats.get(country)!.get(year);
          
          if (yearStats) {
            // Use the improved standardization function that handles edge cases
            const standardizedValue = standardizeScore(score, yearStats.mean, yearStats.stdDev);
            finalScore = standardizedValue; // This may be null if standardization failed
            if (standardizedValue !== null) {
              console.log(`Standardized score for ${brand}/${country}/${year}: ${standardizedValue.toFixed(2)} (raw=${score}, country avg=${yearStats.mean.toFixed(2)}, stdDev=${yearStats.stdDev.toFixed(2)})`);
            }
          } else {
            console.warn(`Missing year stats for ${country}/${year}`);
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
        
        if (score !== undefined) {
          dataPoint[dataKey] = score;
        } else {
          // For years where we have no data, set to null to allow line breaks
          dataPoint[dataKey] = null;
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
