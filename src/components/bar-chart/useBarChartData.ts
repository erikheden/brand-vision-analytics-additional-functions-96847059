
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
import { useMarketData } from "@/hooks/useMarketData";

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
  // Get full market data for better standardization
  const { marketData, isLoading: isLoadingMarketData } = useMarketData(Object.keys(allCountriesData));
  
  // Calculate country-year statistics for standardization based on full market data
  const countryYearStats = useYearStatistics(marketData || allCountriesData);
  
  // Process the data for 2025 (or latest year) comparison
  const processedData = useMemo(() => {
    return processBarChartData(
      allCountriesData,
      selectedBrands,
      standardized,
      countryYearStats,
      marketData
    );
  }, [allCountriesData, selectedBrands, standardized, countryYearStats, marketData]);
  
  // Organize data for the bar chart
  const chartData = useMemo(() => {
    const organized = organizeChartData(processedData, selectedBrands);
    
    // Copy average scores to chartData for access in child components
    const averageScores = (allCountriesData as any).averageScores;
    if (averageScores) {
      Object.defineProperty(organized, 'averageScores', {
        value: averageScores,
        enumerable: false
      });
    }
    
    return organized;
  }, [processedData, selectedBrands, allCountriesData]);
  
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
