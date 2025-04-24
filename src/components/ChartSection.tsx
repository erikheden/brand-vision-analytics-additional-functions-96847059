
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { calculateYearRange, createChartConfig } from "@/utils/chartDataUtils";
import { useProcessedChartData } from "@/hooks/useProcessedChartData";
import EmptyChartState from "./EmptyChartState";
import TrendComparisonContainer from "./TrendComparisonContainer";
import LineChartDisplay from "./LineChartDisplay";
import BarChartDisplay from "./BarChartDisplay";
import ChatInterface from './chat/ChatInterface';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  
  // Process chart data using the extracted hook
  const processedData = useProcessedChartData(scores, standardized);
  
  // Check if we have actual data after processing
  const hasAverageScores = processedData.averageScores && processedData.averageScores.size > 0;

  // Early return if no country is selected
  if (!selectedCountry) {
    return <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="text-center py-10">Select a country to view data</div>
    </Card>;
  }

  if (isLoading) {
    return <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="text-center py-10">Loading data...</div>
    </Card>;
  }

  if (scores.length === 0 || selectedBrands.length === 0) {
    return <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <EmptyChartState selectedCountry={selectedCountry} />
      </Card>;
  }

  const years = calculateYearRange(scores);
  // Create a yearRange object compatible with BrandChart's expected format
  const yearRange = {
    earliest: years[0],
    latest: years[years.length - 1]
  };
  
  const chartConfig = createChartConfig(selectedBrands);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="chat">Chat Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="chat">
          <ChatInterface 
            selectedCountry={selectedCountry} 
            selectedBrands={selectedBrands} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChartSection;
