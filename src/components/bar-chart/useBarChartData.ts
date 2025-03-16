
import { useMemo } from "react";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { standardizeScore } from "@/utils/countryChartDataUtils";

export const useBarChartData = (
  allCountriesData: MultiCountryData,
  selectedBrands: string[],
  standardized: boolean
) => {
  // Process the data for 2025 (or latest year) comparison
  const processedData = useMemo(() => {
    const latestData: any[] = [];
    
    // For each country, calculate yearly averages first
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
          if (standardized && countryYearStats.has(country)) {
            const yearStats = countryYearStats.get(country)?.get(year);
            
            if (yearStats && yearStats.count >= 2 && yearStats.stdDev > 0) {
              // Standardize the score against country average
              score = standardizeScore(score, yearStats.mean, yearStats.stdDev);
              console.log(`Standardized bar score for ${brand} in ${country}, Year ${year}: ${score.toFixed(2)} (raw=${latest.Score}, mean=${yearStats.mean.toFixed(2)}, stdDev=${yearStats.stdDev.toFixed(2)})`);
            } else {
              // If we can't standardize (e.g., only one brand or zero variance), use 0 (at the mean)
              score = 0;
              console.warn(`Insufficient data for standardization in ${country}/${year}: ${yearStats ? yearStats.count : 0} brands, stdDev=${yearStats ? yearStats.stdDev.toFixed(4) : 'N/A'}`);
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
  }, [allCountriesData, selectedBrands, standardized]);
  
  // Organize data for the bar chart
  const chartData = useMemo(() => {
    // Group by country
    const countryGroups = new Map<string, any>();
    
    processedData.forEach(item => {
      if (!countryGroups.has(item.country)) {
        countryGroups.set(item.country, { country: item.country, countryCode: item.countryCode });
      }
      
      const countryGroup = countryGroups.get(item.country);
      countryGroup[item.brand] = item.score;
      
      // Add a flag for projected data
      if (item.projected) {
        countryGroup[`${item.brand}_projected`] = true;
      }
    });
    
    // Convert to array and sort by the first brand's score (high to low)
    // This ensures the chart bars are sorted from highest to lowest values
    const dataArray = Array.from(countryGroups.values());
    
    if (selectedBrands.length > 0 && dataArray.length > 0) {
      const primaryBrand = selectedBrands[0];
      
      dataArray.sort((a, b) => {
        const scoreA = a[primaryBrand] !== undefined ? a[primaryBrand] : -Infinity;
        const scoreB = b[primaryBrand] !== undefined ? b[primaryBrand] : -Infinity;
        return scoreB - scoreA; // Sort high to low
      });
      
      console.log("Sorted chart data:", dataArray.map(item => ({
        country: item.country, 
        score: item[primaryBrand]
      })));
    }
    
    return dataArray;
  }, [processedData, selectedBrands]);
  
  // Calculate the chart year
  const chartYear = useMemo(() => {
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
  }, [processedData]);
  
  return {
    chartData,
    chartYear,
    processedData
  };
};
