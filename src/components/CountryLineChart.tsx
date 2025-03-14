
import { useMemo } from "react";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { processLineChartData } from "@/utils/countryComparison/dataProcessing";
import CountryLineChartContainer from "./CountryLineChartContainer";

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
  // Process the data for the line chart
  const processedData = useMemo(() => {
    return processLineChartData(allCountriesData, selectedBrands, standardized);
  }, [allCountriesData, selectedBrands, standardized]);
  
  const { chartData, years } = processedData;
  
  console.log("Line chart data points:", chartData.length);
  console.log("Sample data point:", chartData.length > 0 ? chartData[0] : "No data");
  
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  return (
    <CountryLineChartContainer
      chartData={chartData}
      selectedBrands={selectedBrands}
      allCountriesData={allCountriesData}
      standardized={standardized}
    />
  );
};

export default CountryLineChart;
