
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { standardizeScore } from "@/utils/countryChartDataUtils";
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
  
  if (standardized && !hasAverageScores) {
    console.warn("Standardization requested but no average scores available - falling back to raw scores");
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
        
        // For standardized scores, use the average scores
        let finalScore: number | null = score;
        
        if (standardized && hasAverageScores) {
          const averageScore = getAverageScore(averageScores, country, year);
          
          if (averageScore !== null) {
            // Calculate standard deviation as a percentage of average (simplified approach)
            const estimatedStdDev = averageScore * 0.15; // 15% of average as stdDev estimate
            
            // Use the standardizeScore utility for consistent standardization
            const standardizedValue = standardizeScore(score, averageScore, estimatedStdDev);
            if (standardizedValue !== null) {
              finalScore = standardizedValue;
              console.log(`Line chart: Standardized score for ${brand}/${country}/${year}: ${standardizedValue.toFixed(2)} (raw=${score.toFixed(2)}, avg=${averageScore.toFixed(2)})`);
            }
          } else {
            console.warn(`No average score found for ${country}/${year}, using raw score`);
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
