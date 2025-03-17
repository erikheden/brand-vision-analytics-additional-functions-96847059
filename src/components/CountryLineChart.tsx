
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from "recharts";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { processLineChartData } from "@/utils/countryChartDataUtils";
import { getFullCountryName } from "@/components/CountrySelect";
import { useMarketData } from "@/hooks/useMarketData";
import { getBrandColor } from "@/utils/countryChartDataUtils";

interface CountryLineChartProps {
  allCountriesData: MultiCountryData;
  selectedBrands: string[];
  standardized: boolean;
}

const CountryLineChart = ({ 
  allCountriesData, 
  selectedBrands,
  standardized
}: CountryLineChartProps) => {
  // Get market data for better standardization
  const { marketData } = useMarketData(Object.keys(allCountriesData));
  
  // Process data for chart
  const { chartData, years } = processLineChartData(
    allCountriesData, 
    selectedBrands, 
    standardized,
    marketData
  );
  
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  // Generate all possible brand-country combinations for the legend
  const brandCountryCombinations: { brand: string; country: string; key: string }[] = [];
  
  selectedBrands.forEach(brand => {
    Object.keys(allCountriesData).forEach(country => {
      const hasData = chartData.some(point => point[`${brand}-${country}`] !== undefined);
      if (hasData) {
        brandCountryCombinations.push({
          brand,
          country,
          key: `${brand}-${country}`
        });
      }
    });
  });
  
  // Calculate Y-axis domain
  const allValues: number[] = [];
  chartData.forEach(point => {
    Object.keys(point).forEach(key => {
      if (key !== 'year' && point[key] !== null && typeof point[key] === 'number') {
        allValues.push(point[key] as number);
      }
    });
  });
  
  // Determine min and max values for the domain
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  
  // Set domain with 10% padding
  let yDomain: [number, number];
  
  if (standardized) {
    // For standardized scores, use fixed domain around zero
    yDomain = [-3, 3];
  } else {
    // For raw scores, calculate from data
    const range = maxValue - minValue;
    const padding = range * 0.1;
    yDomain = [Math.max(0, minValue - padding), maxValue + padding];
  }
  
  return (
    <div className="w-full h-[500px]">
      <h3 className="text-center text-lg font-medium text-[#34502b] mb-2">
        Brand Performance Trends Across Countries
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="year" 
            label={{ 
              value: 'Year', 
              position: 'insideBottomRight', 
              offset: -15 
            }}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            domain={yDomain}
            label={{ 
              value: standardized ? 'Standardized Score' : 'Score', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              const [brand, country] = name.split("-");
              return [
                `${value.toFixed(2)}${standardized ? ' std' : ''}`, 
                `${brand} (${getFullCountryName(country)})`
              ];
            }}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Legend 
            formatter={(value: string) => {
              const [brand, country] = value.split("-");
              return `${brand} (${getFullCountryName(country)})`;
            }}
            wrapperStyle={{ paddingTop: 10 }}
          />
          
          {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
          
          {brandCountryCombinations.map(({ brand, country, key }, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stroke={getBrandColor(brand, index)}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryLineChart;
