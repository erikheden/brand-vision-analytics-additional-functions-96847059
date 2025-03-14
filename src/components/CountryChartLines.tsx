
import React from "react";
import { Line, ReferenceLine } from "recharts";
import { getFullCountryName } from "@/components/CountrySelect";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { COUNTRY_COLORS } from "@/utils/countryChartDataUtils";

interface CountryChartLinesProps {
  chartData: any[];
  selectedBrands: string[];
  allCountriesData: MultiCountryData;
  standardized: boolean;
}

const CountryChartLines: React.FC<CountryChartLinesProps> = ({
  chartData,
  selectedBrands,
  allCountriesData,
  standardized
}) => {
  // Create lines for each brand-country combination
  const lines: React.ReactNode[] = [];
  let lineIndex = 0;
  
  selectedBrands.forEach(brand => {
    Object.keys(allCountriesData).forEach(country => {
      // Check if we have any data for this brand-country combination
      const hasData = chartData.some(dataPoint => 
        dataPoint[`${brand}-${country}`] !== undefined
      );
      
      if (hasData) {
        const color = COUNTRY_COLORS[lineIndex % COUNTRY_COLORS.length];
        lineIndex++;
        
        lines.push(
          <Line
            key={`${brand}-${country}`}
            type="monotone"
            dataKey={`${brand}-${country}`}
            name={`${brand} (${getFullCountryName(country)})`}
            stroke={color}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        );
      }
    });
  });

  return (
    <>
      {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
      {lines}
    </>
  );
};

export default CountryChartLines;
