
import { useMemo } from "react";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { getBrandColor } from "@/utils/countryComparison/chartColors";
import { getFullCountryName } from "@/components/CountrySelect";

export interface LineConfig {
  key: string;
  dataKey: string;
  name: string;
  color: string;
  opacity: number;
  strokeDasharray?: string;
}

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
        if (value !== undefined && value !== null && !isNaN(value)) {
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
    
    // Round to nice values (multiples of 10)
    const roundedMin = Math.floor(minY / 10) * 10;
    const roundedMax = Math.ceil(maxY / 10) * 10;
    
    return [roundedMin, roundedMax] as [number, number];
  }, [chartData, standardized]);
  
  // Generate lines for each brand-country combination with improved visibility
  const lines = useMemo(() => {
    if (!chartData || chartData.length === 0 || !countries.length) {
      console.log("No chart data or countries for line generation");
      return [];
    }
    
    const generatedLines: LineConfig[] = [];
    
    // Create a map to count how many countries each brand appears in
    const brandCountryCount = new Map<string, number>();
    
    // First pass - count countries per brand to optimize visibility
    selectedBrands.forEach(brand => {
      let countryCount = 0;
      countries.forEach(country => {
        const dataKey = `${brand}-${country}`;
        const hasData = chartData.some(point => {
          const value = point[dataKey];
          return value !== null && value !== undefined && !isNaN(value);
        });
        if (hasData) countryCount++;
      });
      brandCountryCount.set(brand, countryCount);
    });
    
    // Loop through brands and countries to create lines with improved visibility
    selectedBrands.forEach((brand) => {
      // Get a unique color for this brand
      const brandColor = getBrandColor(brand);
      
      // Get count of countries this brand appears in
      const countryCount = brandCountryCount.get(brand) || 0;
      
      // Generate different dash patterns based on country count
      // More countries = more variety in dash patterns
      const dashPatterns = countryCount > 3 ? [
        undefined, // Solid line for first country
        "5 5",     // Dashed for second
        "2 2",     // Dotted for third
        "10 5",    // Dash-dot for fourth
        "8 3 2 3", // Complex for fifth
        "15 10"    // Long dash for sixth
      ] : [
        undefined, // When fewer countries, use simpler patterns
        "5 5",
        "10 10"
      ];
      
      countries.forEach((country, countryIndex) => {
        // Generate a dataKey that matches our data structure
        const dataKey = `${brand}-${country}`;
        
        // Check if this data key exists in our chart data and has valid values
        const hasData = chartData.some(point => {
          const value = point[dataKey];
          return value !== null && value !== undefined && !isNaN(value);
        });
        
        if (hasData) {
          console.log(`Adding line for ${dataKey} - data exists`);
          
          // Apply different dash patterns based on country index
          // More variation when more countries are present
          const dashIndex = Math.min(countryIndex, dashPatterns.length - 1);
          const strokeDasharray = dashPatterns[dashIndex];
          
          // Calculate opacity - maintain higher contrast between lines
          // Higher base opacity (0.9) and less decrease per country
          const baseOpacity = 0.9;
          const opacityDecrement = countryCount > 3 ? 0.1 : 0.05;
          const opacity = Math.max(baseOpacity - (countryIndex * opacityDecrement), 0.6);
          
          generatedLines.push({
            key: dataKey,
            dataKey,
            name: `${brand} (${country})`,
            color: brandColor,
            opacity,
            strokeDasharray
          });
        } else {
          console.log(`No data for ${dataKey} - skipping line`);
        }
      });
    });
    
    console.log(`Generated ${generatedLines.length} lines for the chart`);
    return generatedLines;
  }, [chartData, countries, selectedBrands]);

  // Find min and max years for the x-axis
  const { minYear, maxYear } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { minYear: 2011, maxYear: 2025 };
    }
    
    const years = chartData
      .map(d => d.year)
      .filter(year => year !== undefined && year !== null);
      
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
