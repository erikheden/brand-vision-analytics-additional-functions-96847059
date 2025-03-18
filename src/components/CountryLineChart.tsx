
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
import { useCountryLineChart } from "@/hooks/useCountryLineChart";

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

  // Use our new hook to generate optimized chart configuration
  const { lines, yAxisDomain } = useCountryLineChart(
    chartData,
    selectedBrands,
    allCountriesData,
    standardized
  );
  
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
            domain={yAxisDomain}
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
          
          {/* Render lines using the generated configuration */}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeOpacity={line.opacity}
              strokeDasharray={line.strokeDasharray}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              connectNulls={true}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryLineChart;
