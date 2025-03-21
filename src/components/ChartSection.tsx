
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { calculateYearRange, createChartConfig } from "@/utils/chartDataUtils";
import { useProcessedChartData } from "@/hooks/useProcessedChartData";
import EmptyChartState from "./EmptyChartState";
import TrendComparisonContainer from "./TrendComparisonContainer";
import LineChartDisplay from "./LineChartDisplay";
import BarChartDisplay from "./BarChartDisplay";

interface ChartSectionProps {
  selectedCountry: string;
  selectedBrands: string[];
}

const ChartSection = ({
  selectedCountry,
  selectedBrands
}: ChartSectionProps) => {
  // Always set standardized to false since we're removing that functionality
  const standardized = false;
  
  const {
    data: scores = [],
    isLoading
  } = useChartData(selectedCountry, selectedBrands);
  
  // Debug: Log the scores data and properties to check if averageScores exists
  console.log("Scores data received:", scores.length > 0 ? "Yes" : "No");
  console.log("Scores has averageScores property:", !!(scores as any).averageScores);
  
  // Process chart data using the extracted hook
  const processedData = useProcessedChartData(scores, standardized);
  
  // Debug: Check processed data too
  console.log("Processed data has averageScores:", !!(processedData as any).averageScores);

  if (isLoading) {
    return <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="text-center py-10">Loading data...</div>
    </Card>;
  }

  if (scores.length === 0) {
    return <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <EmptyChartState selectedCountry={selectedCountry} />
      </Card>;
  }

  // Check if average scores data is available for averages line
  const averageScores = (scores as any).averageScores;
  const hasAverageScores = averageScores && averageScores.size > 0;
  console.log("Has average scores in ChartSection:", hasAverageScores);

  const years = calculateYearRange(scores);
  // Create a yearRange object compatible with BrandChart's expected format
  const yearRange = {
    earliest: years[0],
    latest: years[years.length - 1]
  };
  
  const chartConfig = createChartConfig(selectedBrands);

  return <div className="space-y-6">
      {/* Industry Comparison Widgets */}
      <TrendComparisonContainer 
        scores={scores} 
        selectedBrands={selectedBrands} 
        comparisonYear={2025} 
      />
      
      {/* Bar Chart */}
      <BarChartDisplay 
        processedData={processedData}
        selectedBrands={selectedBrands}
        chartConfig={chartConfig}
        standardized={standardized}
        hasAverageScores={hasAverageScores}
      />
      
      {/* Line Chart */}
      <LineChartDisplay 
        processedData={processedData}
        selectedBrands={selectedBrands}
        yearRange={yearRange}
        chartConfig={chartConfig}
        standardized={standardized}
      />
    </div>;
};

export default ChartSection;
