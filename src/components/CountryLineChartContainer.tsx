
import React from "react";
import { 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { FONT_FAMILY } from "@/utils/constants";
import CountryChartLines from "./CountryChartLines";
import CountryListDisplay from "./CountryListDisplay";
import { useCountryLineChart } from "@/hooks/useCountryLineChart";

interface CountryLineChartContainerProps {
  chartData: any[];
  selectedBrands: string[];
  allCountriesData: MultiCountryData;
  standardized: boolean;
}

const CountryLineChartContainer: React.FC<CountryLineChartContainerProps> = ({
  chartData,
  selectedBrands,
  allCountriesData,
  standardized
}) => {
  const {
    countries,
    yAxisDomain,
    lines,
    minYear,
    maxYear
  } = useCountryLineChart(chartData, selectedBrands, allCountriesData, standardized);
  
  console.log("Chart data in container:", chartData.length, "points");
  console.log("First data point:", chartData.length > 0 ? JSON.stringify(chartData[0]) : "No data");
  console.log("Chart lines in container:", JSON.stringify(lines, null, 2));
  
  if (lines.length === 0) {
    return <div className="text-center py-8">No valid data found to display chart lines.</div>;
  }
  
  return (
    <div className="w-full h-[500px] mb-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="year"
            type="number"
            domain={[minYear, maxYear]}
            allowDecimals={false}
            tickCount={10}
            ticks={Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)}
            label={{ value: '', position: 'insideBottom', offset: -5 }}
            style={{ 
              fontFamily: FONT_FAMILY,
              fontSize: '12px',
              color: '#34502b'
            }}
          />
          <YAxis 
            domain={yAxisDomain}
            tickFormatter={(value) => standardized ? `${value.toFixed(0)}σ` : value.toFixed(0)}
            style={{ 
              fontFamily: FONT_FAMILY,
              fontSize: '12px',
              color: '#34502b'
            }}
          />
          <Tooltip content={<ChartTooltip standardized={standardized} />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: 20,
              fontFamily: FONT_FAMILY 
            }}
          />
          {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
          <CountryChartLines lines={lines} />
        </LineChart>
      </ResponsiveContainer>
      
      <CountryListDisplay countries={countries} selectedBrands={selectedBrands} />
    </div>
  );
};

export default CountryLineChartContainer;
