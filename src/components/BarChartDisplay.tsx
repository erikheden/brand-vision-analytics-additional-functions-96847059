
import React from "react";
import { Card } from "@/components/ui/card";
import BrandBarChart from "@/components/BrandBarChart";

interface BarChartDisplayProps {
  processedData: any[];
  selectedBrands: string[];
  chartConfig: any;
  standardized: boolean;
  hasAverageScores: boolean;
}

const BarChartDisplay = ({
  processedData,
  selectedBrands,
  chartConfig,
  standardized,
  hasAverageScores
}: BarChartDisplayProps) => {
  // Always use 2025 as the target year for comparison
  const targetYear = 2025;
  
  // Use a meaningful market data indicator based on the data source
  const marketDataIndicator = hasAverageScores ? "SBI Average" : 0;
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <BrandBarChart 
        chartData={processedData} 
        selectedBrands={selectedBrands} 
        chartConfig={chartConfig} 
        standardized={standardized} 
        latestYear={targetYear}
        marketDataCount={marketDataIndicator}
      />
    </Card>
  );
};

export default BarChartDisplay;
