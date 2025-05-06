
import React, { useMemo } from "react";
import { useProcessedChartData } from "@/hooks/useProcessedChartData";
import CountryLineChartContainer from "./CountryLineChartContainer";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { processLineChartData } from "@/utils/countryComparison/dataProcessing";

interface CountryLineChartProps {
  allCountriesData: MultiCountryData;
  selectedBrands: string[];
  standardized: boolean;
}

const CountryLineChart: React.FC<CountryLineChartProps> = ({
  allCountriesData,
  selectedBrands,
  standardized
}) => {
  // Process line chart data with memoization
  const { chartData, years } = useMemo(() => {
    return processLineChartData(allCountriesData, selectedBrands, standardized);
  }, [allCountriesData, selectedBrands, standardized]);

  // Generate a stable component key
  const componentKey = useMemo(() => {
    const countryKey = Object.keys(allCountriesData).sort().join('-');
    const brandKey = selectedBrands.sort().join('-');
    return `line-chart-${countryKey}-${brandKey}-${standardized ? 'std' : 'raw'}`;
  }, [allCountriesData, selectedBrands, standardized]);

  // Show empty state for no data
  if (chartData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-[#34502b]/70">No time series data available for the selected brands and countries.</p>
        <p className="text-sm text-[#34502b]/50 mt-2">Try selecting different brands or countries.</p>
      </div>
    );
  }

  return (
    <CountryLineChartContainer 
      chartData={chartData} 
      selectedBrands={selectedBrands} 
      allCountriesData={allCountriesData} 
      standardized={standardized}
      key={componentKey}
    />
  );
};

export default React.memo(CountryLineChart);
