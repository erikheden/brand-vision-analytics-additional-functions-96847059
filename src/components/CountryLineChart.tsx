
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
import { processLineChartData } from "@/utils/countryComparison/dataProcessing";
import { getFullCountryName } from "@/components/CountrySelect";
import { useMarketData } from "@/hooks/useMarketData";
import { getBrandColor } from "@/utils/countryComparison/chartColors";

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
  
  // Separate regular brands from "Market Average"
  const regularBrands: { brand: string; country: string; key: string }[] = [];
  const marketAverages: { brand: string; country: string; key: string }[] = [];
  
  // Process all data keys to identify brands and market averages
  chartData.forEach(point => {
    Object.keys(point).forEach(key => {
      if (key !== 'year' && key !== 'country' && point[key] !== undefined) {
        const [brand, country] = key.split('-');
        
        const combinationExists = brandCountryCombinations.some(
          combo => combo.key === key
        );
        
        if (!combinationExists) {
          const newCombo = { brand, country, key };
          brandCountryCombinations.push(newCombo);
          
          if (brand === "Market Average") {
            marketAverages.push(newCombo);
          } else {
            regularBrands.push(newCombo);
          }
        }
      }
    });
  });
  
  console.log("Regular brands:", regularBrands);
  console.log("Market averages:", marketAverages);
  
  // Calculate Y-axis domain
  const allValues: number[] = [];
  chartData.forEach(point => {
    Object.keys(point).forEach(key => {
      if (key !== 'year' && key !== 'country' && point[key] !== null && typeof point[key] === 'number') {
        allValues.push(point[key] as number);
      }
    });
  });
  
  // Determine domain for y-axis
  let yDomain: [number, number];
  
  if (standardized) {
    // For standardized scores, use fixed domain of [-3, 3] standard deviations
    yDomain = [-3, 3];
  } else {
    // For raw scores, calculate from data with padding
    if (allValues.length === 0) {
      yDomain = [0, 100]; // Default range if no values
    } else {
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const range = maxValue - minValue;
      const padding = range * 0.1;
      yDomain = [Math.max(0, minValue - padding), maxValue + padding];
    }
  }
  
  return (
    <div className="w-full h-[500px]">
      <h3 className="text-center text-lg font-medium text-[#34502b] mb-2">
        {standardized ? "Standardized Brand Performance Across Countries" : "Brand Performance Trends Across Countries"}
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
              value: standardized ? 'Standardized Score (σ)' : 'Score', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
            tickFormatter={(value) => standardized ? `${value}σ` : value}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              const [brand, country] = name.split("-");
              return [
                `${value.toFixed(2)}${standardized ? 'σ' : ''}`, 
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
          
          {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" label={{
            value: 'Market Average',
            position: 'right',
            style: { fill: '#666', textAnchor: 'start' }
          }} />}
          
          {/* Render regular brand lines */}
          {regularBrands.map(({ brand, country, key }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stroke={getBrandColor(brand)}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 4 }}
            />
          ))}
          
          {/* Render market average lines with different style */}
          {marketAverages.map(({ country, key }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stroke="#34502b"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              connectNulls={false}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryLineChart;
