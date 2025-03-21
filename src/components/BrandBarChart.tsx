
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { useBrandBarChartData } from '@/hooks/useBrandBarChartData';
import BrandBarChartContent from './brand-bar-chart/BrandBarChartContent';

interface BrandBarChartProps {
  chartData: any[];
  selectedBrands: string[];
  chartConfig: any;
  standardized: boolean; // Kept for API compatibility but always treated as false
  latestYear?: number;
  marketDataCount?: string | number;
}

const BrandBarChart = ({ 
  chartData, 
  selectedBrands, 
  chartConfig, 
  standardized, // Always treated as false
  latestYear = 2025,
  marketDataCount = 0
}: BrandBarChartProps) => {
  // Use our custom hook to handle data processing and state
  const {
    dataToUse,
    displayYear,
    isProjected,
    country,
    averageScore
  } = useBrandBarChartData({
    chartData,
    latestYear,
    standardized: false // Always pass false here
  });

  // Log the use of market average
  if (averageScore !== null) {
    console.log(`Using market average for ${country} in ${displayYear}: ${averageScore}`);
  }

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BrandBarChartContent
        chartData={dataToUse.length > 0 ? dataToUse : chartData}
        selectedBrands={selectedBrands}
        chartConfig={chartConfig}
        standardized={false}
        displayYear={displayYear}
        averageScore={averageScore}
        marketDataCount={marketDataCount}
      />
    </ChartContainer>
  );
};

export default BrandBarChart;
