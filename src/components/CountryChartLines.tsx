
import React from "react";
import { Line } from "recharts";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { getBrandColor } from "@/utils/countryComparison/chartColors";

interface CountryChartLinesProps {
  chartData: any[];
  selectedBrands: string[];
  allCountriesData: MultiCountryData;
  standardized: boolean;
}

const CountryChartLines: React.FC<CountryChartLinesProps> = ({
  chartData,
  selectedBrands,
  allCountriesData
}) => {
  // Get all countries
  const countries = Object.keys(allCountriesData);
  
  // If there's no data, return null
  if (chartData.length === 0 || countries.length === 0) {
    return null;
  }
  
  // Generate lines for each brand-country combination
  const lines: JSX.Element[] = [];
  
  // Loop through brands and countries to create lines
  selectedBrands.forEach((brand) => {
    countries.forEach((country, countryIndex) => {
      // Generate a dataKey that matches our data structure
      const dataKey = `${brand}-${country}`;
      
      // Check if this data key exists in our chart data
      const hasData = chartData.some(point => dataKey in point && point[dataKey] !== null && point[dataKey] !== undefined);
      
      if (hasData) {
        // Use consistent brand color across countries
        const brandColor = getBrandColor(brand);
        
        // Adjust opacity based on country index for differentiation
        const opacity = 1 - (countryIndex * 0.2);
        
        lines.push(
          <Line
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            name={`${brand} (${country})`}
            stroke={brandColor}
            strokeWidth={2}
            strokeOpacity={opacity > 0.4 ? opacity : 0.4}
            dot={{ r: 4, fill: brandColor }}
            activeDot={{ r: 6 }}
            connectNulls={true}
          />
        );
      }
    });
  });
  
  return <>{lines}</>;
};

export default CountryChartLines;
