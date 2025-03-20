
import React from "react";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import CountryHighchartsContainer from "./CountryHighchartsContainer";
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
  
  if (!chartData || chartData.length === 0) {
    return <div className="text-center py-8">No chart data available.</div>;
  }
  
  if (!lines || lines.length === 0) {
    return <div className="text-center py-8">No valid data found to display chart lines.</div>;
  }

  return (
    <div className="w-full h-[500px] mb-10">
      <div className="h-[90%]">
        <CountryHighchartsContainer 
          chartData={chartData}
          lines={lines}
          yAxisDomain={yAxisDomain}
          minYear={minYear}
          maxYear={maxYear}
          standardized={standardized}
        />
      </div>
      
      <CountryListDisplay countries={countries} selectedBrands={selectedBrands} />
    </div>
  );
};

export default CountryLineChartContainer;
