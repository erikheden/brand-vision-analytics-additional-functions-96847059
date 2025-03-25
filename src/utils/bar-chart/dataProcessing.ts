
// Import the utility for getting average scores
import { getAverageScore } from "@/utils/countryComparison/averageScoreUtils";
import { BrandData } from "@/types/brand";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";

export interface ProcessedBarDataPoint {
  brand: string;
  country: string;
  score: number;
  rawScore: number;
  year: number;
  projected: boolean;
}

export interface ChartDataPoint {
  name: string;
  country: string;
  [key: string]: number | string;
}

/**
 * Process data for bar chart
 */
export const processBarChartData = (
  allCountriesData: MultiCountryData,
  selectedBrands: string[],
  standardized: boolean, // Kept for API compatibility but ignored
  countryYearStats?: Map<string, Map<number, { mean: number; stdDev: number; count: number }>>,
  marketData?: MultiCountryData
): ProcessedBarDataPoint[] => {
  const processedData: ProcessedBarDataPoint[] = [];
  
  // Get average scores if available
  const averageScores = allCountriesData.averageScores as Map<string, Map<number, number>> | undefined;
  
  // Simplify common data determination
  const targetYear = 2025; // Using 2025 as the default target year
  
  // Process each country's data
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || !Array.isArray(countryData) || countryData.length === 0) return;
    
    // For each selected brand
    selectedBrands.forEach(brand => {
      // Find data for this brand in this country 
      const brandData = countryData
        .filter(item => item.Brand === brand)
        .sort((a, b) => (b.Year || 0) - (a.Year || 0)); // Sort by year, latest first
      
      if (brandData.length === 0) return;
      
      // Get the most recent data point (prioritize 2025 if available)
      const dataFor2025 = brandData.find(item => item.Year === targetYear);
      const latestData = dataFor2025 || brandData[0]; // Use 2025 or most recent
      
      // Skip if no valid score
      if (!latestData.Score) return;
      
      // Get raw score
      const rawScore = Number(latestData.Score);
      const score = rawScore; // Always use raw score (no standardization)
      const year = Number(latestData.Year);
      
      // Add to processed data
      processedData.push({
        brand,
        country,
        score,
        rawScore,
        year,
        projected: Boolean(latestData.Projected)
      });
    });
    
    // Add market average if available
    if (averageScores && averageScores.has(country)) {
      const countryAvgs = averageScores.get(country);
      if (countryAvgs) {
        // Find the latest year with average data
        const yearsWithAvg = Array.from(countryAvgs.keys()).sort((a, b) => b - a);
        
        if (yearsWithAvg.length > 0) {
          const latestYear = yearsWithAvg[0];
          const avgScore = countryAvgs.get(latestYear);
          
          if (avgScore !== undefined && typeof avgScore === 'number') {
            // Add market average as a special brand
            processedData.push({
              brand: "Market Average",
              country,
              score: avgScore,
              rawScore: avgScore,
              year: latestYear,
              projected: false
            });
            
            console.log(`Added market average for ${country}: ${avgScore} (year: ${latestYear})`);
          }
        }
      }
    }
  });
  
  return processedData;
};

/**
 * Organizes processed data into a format suitable for the bar chart.
 */
export const organizeChartData = (
  processedData: ProcessedBarDataPoint[],
  selectedBrands: string[]
): ChartDataPoint[] => {
  // Group data by country
  const groupedData: { [country: string]: ChartDataPoint } = {};
  
  processedData.forEach(item => {
    if (!groupedData[item.country]) {
      groupedData[item.country] = { name: item.country, country: item.country };
    }
    
    groupedData[item.country][item.brand] = item.score;
  });
  
  // Convert grouped data into an array
  return Object.values(groupedData);
};

/**
 * Calculates the most common year in the processed data.
 */
export const calculateMostCommonYear = (
  processedData: ProcessedBarDataPoint[]
): number => {
  const yearCounts: { [year: number]: number } = {};
  
  processedData.forEach(item => {
    const year = item.year;
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  
  let mostCommonYear = 0;
  let maxCount = 0;
  
  for (const year in yearCounts) {
    if (yearCounts.hasOwnProperty(year)) {
      const count = yearCounts[year];
      if (count > maxCount) {
        maxCount = count;
        mostCommonYear = parseInt(year);
      }
    }
  }
  
  return mostCommonYear || new Date().getFullYear();
};
