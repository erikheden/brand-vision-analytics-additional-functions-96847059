
import { useMemo } from "react";
import { BrandData } from "@/types/brand";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { useYearStatistics } from "@/hooks/bar-chart/useYearStatistics";
import { 
  processBarChartData, 
  organizeChartData, 
  calculateMostCommonYear,
  ProcessedBarDataPoint,
  ChartDataPoint
} from "@/utils/bar-chart/dataProcessing";

export interface BarChartData {
  chartData: ChartDataPoint[];
  chartYear: number;
  processedData: ProcessedBarDataPoint[];
}

export const useBarChartData = (
  allCountriesData: MultiCountryData,
  selectedBrands: string[],
  standardized: boolean
): BarChartData => {
  // Calculate country-year statistics for standardization
  const countryYearStats = useYearStatistics(allCountriesData);
  
  // Process the data for 2025 (or latest year) comparison
  const processedData = useMemo(() => {
    return processBarChartData(
      allCountriesData,
      selectedBrands,
      standardized,
      countryYearStats
    );
  }, [allCountriesData, selectedBrands, standardized, countryYearStats]);
  
  // Organize data for the bar chart
  const chartData = useMemo(() => {
    return organizeChartData(processedData, selectedBrands);
  }, [processedData, selectedBrands]);
  
  // Calculate the chart year (most common year in the data)
  const chartYear = useMemo(() => {
    return calculateMostCommonYear(processedData);
  }, [processedData]);
  
  return {
    chartData,
    chartYear,
    processedData
  };
};
