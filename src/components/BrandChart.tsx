
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { useAverageScores } from '@/hooks/useAverageScores';
import { createBrandSeries, createAverageScoreSeries } from '@/utils/charts/createChartSeries';
import BrandChartContent from './brand-chart/BrandChartContent';

interface BrandChartProps {
  chartData: any[];
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
