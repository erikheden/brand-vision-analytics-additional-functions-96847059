
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { calculateYearRange, createChartConfig } from "@/utils/chartDataUtils";
import { useProcessedChartData } from "@/hooks/useProcessedChartData";
import StandardizedToggle from "./StandardizedToggle";
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
  const [standardized, setStandardized] = useState(false);
  
  const {
    data: scores = [],
    isLoading
  } = useChartData(selectedCountry, selectedBrands);
  
  // Process chart data using the extracted hook
  const processedData = useProcessedChartData(scores, standardized);

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

  // Check if average scores data is available for better standardization
  const averageScores = (scores as any).averageScores;
  const hasAverageScores = averageScores && averageScores.size > 0;
  
  if (standardized && !hasAverageScores) {
    console.warn("Standardized view requested but no average scores available");
  }

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
      
      {/* Standardized toggle */}
      <StandardizedToggle 
        standardized={standardized} 
        onToggle={setStandardized} 
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
