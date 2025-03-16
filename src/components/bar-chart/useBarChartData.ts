
import { useMemo } from "react";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";

export const useBarChartData = (
  allCountriesData: MultiCountryData,
  selectedBrands: string[],
  standardized: boolean
) => {
  // Process the data for 2025 (or latest year) comparison
  const processedData = useMemo(() => {
    const latestData: any[] = [];
    
    // For each country, get the 2025 (or latest) data for each brand
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
        
        if (latest && latest.Score !== null) {
          // Calculate standardized score if needed
          let score = latest.Score;
          
          if (standardized && Array.isArray((countryData as any).marketData)) {
            // Get market data for the same year
            const marketDataForYear = (countryData as any).marketData
              .filter((item: any) => item.Year === latest.Year);
            
            if (marketDataForYear.length > 0) {
              // Calculate mean and standard deviation
              const validScores = marketDataForYear
                .map((item: any) => item.Score)
                .filter((score: any) => score !== null && !isNaN(score));
              
              const mean = validScores.reduce((sum: number, val: number) => sum + val, 0) / validScores.length;
              const stdDev = Math.sqrt(
                validScores.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / validScores.length
              );
              
              // Standardize the score
              score = stdDev === 0 ? 0 : (latest.Score - mean) / stdDev;
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
