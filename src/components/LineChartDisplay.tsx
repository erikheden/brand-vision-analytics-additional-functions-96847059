
import React from "react";
import { Card } from "@/components/ui/card";
import BrandChart from "@/components/BrandChart";

interface LineChartDisplayProps {
  processedData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
  standardized: boolean;
}

const LineChartDisplay = ({
  processedData,
  selectedBrands,
  yearRange,
  chartConfig,
  standardized
}: LineChartDisplayProps) => {
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-[31px]">
      <BrandChart 
        chartData={processedData} 
        selectedBrands={selectedBrands} 
        yearRange={yearRange} 
        chartConfig={chartConfig} 
        standardized={standardized}
      />
    </Card>
  );
};

export default LineChartDisplay;
