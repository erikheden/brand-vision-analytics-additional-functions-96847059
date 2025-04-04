
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { useAverageScores } from '@/hooks/useAverageScores';
import { createBrandSeries, createAverageScoreSeries } from '@/utils/charts/createChartSeries';
import BrandChartContent from './brand-chart/BrandChartContent';

// Define an interface that extends Array to include the averageScores property
interface ChartDataWithAverages extends Array<any> {
  averageScores?: Map<string, Map<number, number>>;
  countryYearStats?: Map<string, Map<number, { mean: number; stdDev: number }>>;
}

interface BrandChartProps {
  chartData: ChartDataWithAverages;
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
  standardized: boolean; // Kept for API compatibility but will be ignored
}

const BrandChart = ({ 
  chartData, 
  selectedBrands, 
  yearRange, 
  chartConfig, 
  standardized  // Always treated as false
}: BrandChartProps) => {
  // Get country from the first data point (all points should have same country)
  const country = chartData.length > 0 && chartData[0].country 
    ? chartData[0].country 
    : '';
  
  console.log("BrandChart rendering with country:", country);
  console.log("ChartData length:", chartData.length);
  console.log("Average scores property exists:", !!(chartData.averageScores));
  
  // Log all properties on chartData to help debug
  const propertyNames = Object.getOwnPropertyNames(chartData);
  console.log("Properties on chartData:", propertyNames);
  
  // Log property descriptors to check if averageScores is non-enumerable
  console.log("Has own property 'averageScores':", chartData.hasOwnProperty('averageScores'));
  
  // Debug: Display a sample of the chart data for troubleshooting
  if (chartData.length > 0) {
    console.log("Sample chart data point:", chartData[0]);
  }
  
  // Use the hook to extract yearly averages
  const yearlyAverages = useAverageScores(chartData, country, false);
  console.log("Yearly averages for BrandChart:", yearlyAverages);
  
  // Create series for the brands
  const brandSeries = createBrandSeries(chartData, selectedBrands, chartConfig);
  
  // Create and add the average score series if available
  const series = [...brandSeries];
  
  // Only add market average if we have data
  if (yearlyAverages.length > 0) {
    console.log("Adding market average series to BrandChart");
    const averageSeries = createAverageScoreSeries(yearlyAverages);
    if (averageSeries) {
      series.push(averageSeries as Highcharts.SeriesOptionsType);
    }
  } else {
    console.log("No yearly averages available for market average line");
  }

  return (
    <ChartContainer config={chartConfig} className="h-[500px] w-full">
      <BrandChartContent
        yearRange={yearRange}
        series={series}
        standardized={false}
        yearlyAverages={yearlyAverages}
      />
    </ChartContainer>
  );
};

export default BrandChart;
