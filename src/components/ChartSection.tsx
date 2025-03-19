
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { calculateYearRange, processChartData, createChartConfig } from "@/utils/chartDataUtils";
import { Toggle } from "@/components/ui/toggle";
import { Check, Info, Sparkles } from "lucide-react";
import BrandChart from "./BrandChart";
import BrandBarChart from "./BrandBarChart";
import EmptyChartState from "./EmptyChartState";
import TrendComparisonContainer from "./TrendComparisonContainer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const years = calculateYearRange(scores);
  // Create a yearRange object compatible with BrandChart's expected format
  const yearRange = {
    earliest: years[0],
    latest: years[years.length - 1]
  };
  
  const chartData = processChartData(scores, standardized);
  
  // Copy average scores to chartData for access in child components
  if (hasAverageScores) {
    Object.defineProperty(chartData, 'averageScores', {
      value: averageScores,
      enumerable: false
    });
  }
  
  const chartConfig = createChartConfig(selectedBrands);

  // Always use 2025 as the target year for comparison
  const targetYear = 2025;

  return <div className="space-y-6">
      {/* Industry Comparison Widgets - Now first */}
      <TrendComparisonContainer 
        scores={scores} 
        selectedBrands={selectedBrands} 
        comparisonYear={targetYear} 
      />
      
      {/* Standardized toggle - Cleaner design */}
      <div className="flex items-center justify-end space-x-4 mb-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#34502b] font-medium">Standardized Scores</span>
          <div className="relative flex items-center">
            <Toggle 
              pressed={standardized} 
              onPressedChange={setStandardized} 
              aria-label="Toggle standardized scores" 
              className="border border-[#34502b]/30 relative bg-[#f0d2b0] font-semibold transition-all duration-300 hover:bg-[#e5c7a5]"
            >
              {standardized && <Check className="h-4 w-4 text-[#34502b] absolute animate-scale-in" />}
            </Toggle>
            <span className="ml-2">
              <Sparkles className="h-4 w-4 text-[#34502b] opacity-70 animate-pulse" />
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#34502b] transition-transform hover:scale-110" />
              </TooltipTrigger>
              <TooltipContent className="bg-white p-3 max-w-xs shadow-lg">
                <p>Standardized scores normalize the data against the <strong>official market average</strong> in each country, showing how many standard deviations each brand is above or below the market average score.</p>
                <p className="text-xs mt-1 text-[#34502b]/70">Data source: SBI Average Scores table</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Bar Chart */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <BrandBarChart 
          chartData={chartData} 
          selectedBrands={selectedBrands} 
          chartConfig={chartConfig} 
          standardized={standardized} 
          latestYear={targetYear}
          marketDataCount={hasAverageScores ? "SBI Average" : 0}
        />
      </Card>
      
      {/* Line Chart */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-[31px]">
        <BrandChart 
          chartData={chartData} 
          selectedBrands={selectedBrands} 
          yearRange={yearRange} 
          chartConfig={chartConfig} 
          standardized={standardized}
        />
      </Card>
    </div>;
};

export default ChartSection;
