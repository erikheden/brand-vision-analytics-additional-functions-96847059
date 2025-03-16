
import { useBarChartData } from "./bar-chart/useBarChartData";
import { useChartYAxisDomain } from "./bar-chart/ChartYAxisDomain";
import { BarChartContent } from "./bar-chart/BarChartContent";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";

interface CountryBarChartProps {
  allCountriesData: MultiCountryData;
  selectedBrands: string[];
  standardized: boolean;
}

const CountryBarChart = ({
  allCountriesData,
  selectedBrands,
  standardized
}: CountryBarChartProps) => {
  // Use the custom hooks to process data
  const { chartData, chartYear } = useBarChartData(
    allCountriesData,
    selectedBrands,
    standardized
  );
  
  // Calculate the y-axis domain
  const yAxisDomain = useChartYAxisDomain(chartData, selectedBrands, standardized);
  
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  return (
    <div className="w-full h-[500px]">
      {/* Chart title similar to the reference image */}
      <h3 className="text-center text-lg font-medium text-[#34502b] mb-2">
        {chartYear} Brand Scores Comparison
      </h3>
      
      <BarChartContent 
        chartData={chartData}
        yAxisDomain={yAxisDomain}
        selectedBrands={selectedBrands}
        standardized={standardized}
      />
    </div>
  );
};

export default CountryBarChart;
