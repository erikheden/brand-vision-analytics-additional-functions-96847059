
import React from "react";
import { Line } from "recharts";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { getBrandColor } from "@/utils/countryChartDataUtils";

interface CountryChartLinesProps {
  chartData: any[];
  selectedBrands: string[];
  allCountriesData: MultiCountryData;
  standardized: boolean;
}

// This component is now deprecated as the line generation functionality
// has been moved directly into CountryLineChartContainer for better performance
// and easier debugging
const CountryChartLines: React.FC<CountryChartLinesProps> = ({
  chartData,
  selectedBrands,
  allCountriesData
}) => {
  console.warn("CountryChartLines is deprecated - using inline line generation in CountryLineChartContainer");
  return null;
};

export default CountryChartLines;
