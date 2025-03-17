
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { standardizeScore } from "@/utils/countryChartDataUtils";

// Type for the processed data points in the bar chart
export interface ProcessedBarDataPoint {
  country: string;
  brand: string;
  countryCode: string;
  score: number;
  year: number;
  projected: boolean;
}

// Type for the final chart data point structure
export interface ChartDataPoint {
  country: string;
  countryCode: string;
  [brandName: string]: string | number | boolean | undefined;
}

/**
 * Processes the raw country data into a format suitable for bar charts
 */
export const processBarChartData = (
  allCountriesData: Record<string, BrandData[]>,
  selectedBrands: string[],
  standardized: boolean,
  yearStats: Map<string, Map<number, { mean: number; stdDev: number; count: number }>>
): ProcessedBarDataPoint[] => {
  const latestData: ProcessedBarDataPoint[] = [];
  
  // Now process the data for selected brands
  Object.entries(allCountriesData).forEach(([country, countryData]) => {
    if (!countryData || countryData.length === 0) return;
    
    // Group by brand
    const brandGroups = new Map<string, BrandData[]>();
    countryData.forEach(item => {
      if (!item.Brand) return;
      if (!brandGroups.has(item.Brand)) {
        brandGroups.set(item.Brand, []);
      }
      brandGroups.get(item.Brand)?.push(item);
    });
    
    // For each brand, get the latest (2025 if available) data
    selectedBrands.forEach(brand => {
      const brandData = brandGroups.get(brand);
      if (!brandData || brandData.length === 0) return;
      
      // Sort by year to find the latest data
      brandData.sort((a, b) => (b.Year || 0) - (a.Year || 0));
      
      // Get 2025 data or latest data if 2025 is not available
      const latest = brandData.find(item => item.Year === 2025) || brandData[0];
      
      if (latest && latest.Score !== null && latest.Year !== null) {
        // Get raw score
        let score = latest.Score;
        const year = latest.Year;
        
        // Get statistics for this country and year
        if (standardized && yearStats.has(country)) {
          const yearStatsForCountry = yearStats.get(country);
          if (yearStatsForCountry) {
            const stats = yearStatsForCountry.get(year);
            
            if (stats) {
              // Use our improved standardization function that handles edge cases
              const standardizedScore = standardizeScore(score, stats.mean, stats.stdDev);
              if (standardizedScore !== null) {
                score = standardizedScore;
                console.log(`Standardized bar score for ${brand} in ${country}, Year ${year}: ${score.toFixed(2)} (raw=${latest.Score}, mean=${stats.mean.toFixed(2)}, stdDev=${stats.stdDev.toFixed(2)})`);
              } else {
                // This shouldn't happen now with our improved function
                console.warn(`Failed to standardize score for ${brand} in ${country}, Year ${year}`);
              }
            }
          }
        }
        
        // Add to the dataset with country as the x-axis category
        latestData.push({
          country: getFullCountryName(country),
          brand: brand,
          countryCode: country,
          score: score,
          year: latest.Year,
          projected: latest.Projected || false
        });
      }
    });
  });
  
  return latestData;
};

/**
 * Organizes data for the bar chart by grouping and sorting
 */
export const organizeChartData = (
  processedData: ProcessedBarDataPoint[],
  selectedBrands: string[]
): ChartDataPoint[] => {
  // Group by country
  const countryGroups = new Map<string, ChartDataPoint>();
  
  processedData.forEach(item => {
    if (!countryGroups.has(item.country)) {
      countryGroups.set(item.country, { 
        country: item.country, 
        countryCode: item.countryCode 
      });
    }
    
    const countryGroup = countryGroups.get(item.country)!;
    countryGroup[item.brand] = item.score;
    
    // Add a flag for projected data
    if (item.projected) {
      countryGroup[`${item.brand}_projected`] = true;
    }
  });
  
  // Convert to array for chart rendering
  const dataArray = Array.from(countryGroups.values());
  
  // Sort countries by total brand score across all selected brands
  if (selectedBrands.length > 0 && dataArray.length > 0) {
    dataArray.sort((a, b) => {
      // Calculate total score for country a
      const totalScoreA = selectedBrands.reduce((sum, brand) => {
        return sum + (typeof a[brand] === 'number' ? a[brand] as number : 0);
      }, 0);
      
      // Calculate total score for country b
      const totalScoreB = selectedBrands.reduce((sum, brand) => {
        return sum + (typeof b[brand] === 'number' ? b[brand] as number : 0);
      }, 0);
      
      // Sort high to low by total score
      return totalScoreB - totalScoreA;
    });
    
    console.log("Sorted chart data by total brand scores:", dataArray.map(item => ({
      country: item.country, 
      totalScore: selectedBrands.reduce((sum, brand) => sum + (typeof item[brand] === 'number' ? item[brand] as number : 0), 0)
    })));
  }
  
  return dataArray;
};

/**
 * Calculates the most common year in the chart data
 */
export const calculateMostCommonYear = (processedData: ProcessedBarDataPoint[]): number => {
  if (processedData.length === 0) return 2025; // Default
  
  // Find the most common year in the data
  const yearCounts: Record<number, number> = {};
  processedData.forEach(item => {
    if (item.year) {
      yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
    }
  });
  
  // Find the year with the most data points
  let mostCommonYear = 2025;
  let highestCount = 0;
  
  Object.entries(yearCounts).forEach(([year, count]) => {
    if (count > highestCount) {
      highestCount = count;
      mostCommonYear = parseInt(year);
    }
  });
  
  return mostCommonYear;
};
