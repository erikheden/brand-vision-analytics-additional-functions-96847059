
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { calculateYearRange, processChartData, createChartConfig } from "@/utils/chartDataUtils";
import { Toggle } from "@/components/ui/toggle";
import { Check } from "lucide-react";
import BrandChart from "./BrandChart";
import BrandBarChart from "./BrandBarChart";
import EmptyChartState from "./EmptyChartState";

interface ChartSectionProps {
  selectedCountry: string;
  selectedBrands: string[];
}

const ChartSection = ({ selectedCountry, selectedBrands }: ChartSectionProps) => {
  const [standardized, setStandardized] = useState(false);
  const { data: scores = [] } = useChartData(selectedCountry, selectedBrands);
  
  if (scores.length === 0) {
    return (
      <Card className="p-6 bg-[#34502b] text-white rounded-xl shadow-lg">
        <EmptyChartState selectedCountry={selectedCountry} />
      </Card>
    );
  }

  const yearRange = calculateYearRange(scores);
  const chartData = processChartData(scores, standardized);
  const chartConfig = createChartConfig(selectedBrands);

  // Find the most recent year with data
  const mostRecentYear = yearRange.latest;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end space-x-2">
        <span className="text-sm text-white">Standardized Scores</span>
        <Toggle 
          pressed={standardized}
          onPressedChange={setStandardized}
          className="bg-white/20 data-[state=on]:bg-white/40 hover:bg-white/30 border border-white/30 relative"
          aria-label="Toggle standardized scores"
        >
          {standardized && (
            <Check className="h-4 w-4 text-white absolute" />
          )}
        </Toggle>
      </div>
      
      <Card className="p-6 bg-[#34502b] text-white rounded-xl shadow-lg">
        <BrandChart
          chartData={chartData}
          selectedBrands={selectedBrands}
          yearRange={yearRange}
          chartConfig={chartConfig}
          standardized={standardized}
        />
      </Card>
      
      <Card className="p-6 bg-[#34502b] text-white rounded-xl shadow-lg">
        <BrandBarChart
          chartData={chartData}
          selectedBrands={selectedBrands}
          chartConfig={chartConfig}
          standardized={standardized}
          latestYear={mostRecentYear}
        />
      </Card>
    </div>
  );
};

export default ChartSection;
