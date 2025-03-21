
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
  standardized: boolean;
}

const BrandChart = ({ 
  chartData, 
  selectedBrands, 
  yearRange, 
  chartConfig, 
  standardized 
}: BrandChartProps) => {
  // Get country from the first data point (all points should have same country)
  const country = chartData.length > 0 && chartData[0].country 
    ? chartData[0].country 
    : '';
  
  // Use the hook to extract yearly averages
  const yearlyAverages = useAverageScores(chartData, country, standardized);
  
  // Create series for the brands
  const brandSeries = createBrandSeries(chartData, selectedBrands, chartConfig);
  
  // Create and add the average score series if available
  const series = [...brandSeries];
  
  if (!standardized && yearlyAverages.length > 0) {
    const averageSeries = createAverageScoreSeries(yearlyAverages);
    if (averageSeries) {
      // Push to series after type assertion
      (series as Highcharts.SeriesOptionsType[]).push(averageSeries);
    }
  }

  return (
    <ChartContainer config={chartConfig} className="h-[500px] w-full">
      <BrandChartContent
        yearRange={yearRange}
        series={series}
        standardized={standardized}
        yearlyAverages={yearlyAverages}
      />
    </ChartContainer>
  );
};

export default BrandChart;
