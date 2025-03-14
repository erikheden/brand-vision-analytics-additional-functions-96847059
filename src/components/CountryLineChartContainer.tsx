
import React from "react";
import { 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import CountryChartLines from "./CountryChartLines";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";

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
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="year"
            type="number"
            domain={['dataMin', 'dataMax']}
            allowDecimals={false}
          />
          <YAxis 
            domain={standardized ? [-3, 3] : ['auto', 'auto']}
            tickFormatter={(value) => standardized ? `${value.toFixed(1)}σ` : value.toFixed(1)}
          />
          <Tooltip content={<ChartTooltip standardized={standardized} />} />
          <Legend wrapperStyle={{ paddingTop: 20 }} />
          
          <CountryChartLines 
            chartData={chartData}
            selectedBrands={selectedBrands}
            allCountriesData={allCountriesData}
            standardized={standardized}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryLineChartContainer;
