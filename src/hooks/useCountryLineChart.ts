import { useMemo } from "react";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { getBrandColor } from "@/utils/countryComparison/chartColors";
import { LineConfig } from "@/components/CountryChartLines";

export const useCountryLineChart = (
  chartData: any[],
  selectedBrands: string[],
  allCountriesData: MultiCountryData,
  standardized: boolean
) => {
  // Get all countries
  const countries = Object.keys(allCountriesData);
  
  // Calculate the domain for the y-axis
  const yAxisDomain = useMemo(() => {
    if (standardized) {
      return [-3, 3] as [number, number]; // Fixed domain for standardized scores
    }
    
    // Find min and max values across all data points
    let minValue = Infinity;
    let maxValue = -Infinity;
    
    chartData.forEach(dataPoint => {
      // Check all keys in the data point that might be brand-country combinations
      Object.keys(dataPoint).forEach(key => {
        // Skip year and non-data keys
        if (key === 'year' || typeof dataPoint[key] !== 'number') return;
        
        const value = dataPoint[key];
        if (value !== undefined && value !== null) {
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        }
      });
    });
    
    if (minValue === Infinity) minValue = 0;
    if (maxValue === -Infinity) maxValue = 100;
    
    // Calculate padding (10% of the range)
    const range = maxValue - minValue;
    const padding = range * 0.1;
    
    // Set minimum to 0 if it's close to 0
    const minY = minValue > 0 && minValue < 10 ? 0 : Math.max(0, minValue - padding);
    
    // Add padding to the top
    const maxY = maxValue + padding;
    
    // Round to nice values
    const roundedMin = Math.floor(minY / 10) * 10;
    const roundedMax = Math.ceil(maxY / 10) * 10;
    
    return [roundedMin, roundedMax] as [number, number];
  }, [chartData, standardized]);
  
  // Generate lines for each brand-country combination
  const lines = useMemo(() => {
    if (chartData.length === 0 || countries.length === 0) {
      return [];
    }
    
    const generatedLines: LineConfig[] = [];
    
    // Loop through brands and countries to create lines
    selectedBrands.forEach((brand) => {
      // Get a unique color for this brand
      const brandColor = getBrandColor(brand);
      
      countries.forEach((country, countryIndex) => {
        // Generate a dataKey that matches our data structure
        const dataKey = `${brand}-${country}`;
        
        // Check if this data key exists in our chart data and has valid values
        const hasData = chartData.some(point => {
          return dataKey in point && point[dataKey] !== null && point[dataKey] !== undefined;
        });
        
        if (hasData) {
          console.log(`Adding line for ${dataKey} - data exists`);
          
          // Apply a slightly different dash array based on country index for differentiation
          // while keeping the same brand color
          const strokeDasharray = countryIndex === 0 ? "0" : 
                                  countryIndex === 1 ? "5 5" : 
                                  countryIndex === 2 ? "10 10" : 
                                  "15 10 5 10";
          
          // Adjust opacity based on country index for differentiation
          const opacity = 1 - (countryIndex * 0.15);
          const finalOpacity = Math.max(opacity, 0.5); // Ensure minimum opacity of 0.5
          
          generatedLines.push({
            key: dataKey,
            dataKey,
            name: `${brand} (${country})`,
            color: brandColor,
            opacity: finalOpacity,
            dashArray: countryIndex > 0 ? strokeDasharray : undefined
          });
        } else {
          console.log(`No data for ${dataKey}`);
        }
      });
    });
    
    console.log(`Generated ${generatedLines.length} lines for the chart`);
    return generatedLines;
  }, [chartData, countries, selectedBrands]);

  // Find min and max years for the x-axis
  const { minYear, maxYear } = useMemo(() => {
    if (chartData.length === 0) {
      return { minYear: 2011, maxYear: 2025 };
    }
    
    const years = chartData.map(d => d.year).filter(Boolean);
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years)
    };
  }, [chartData]);

  return {
    countries,
    yAxisDomain,
    lines,
    minYear,
    maxYear
  };
};
