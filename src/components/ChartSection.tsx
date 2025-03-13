
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { calculateYearRange, processChartData, createChartConfig } from "@/utils/chartDataUtils";
import { Toggle } from "@/components/ui/toggle";
import { Check, Info } from "lucide-react";
import BrandChart from "./BrandChart";
import BrandBarChart from "./BrandBarChart";
import EmptyChartState from "./EmptyChartState";
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
    data: scores = []
  } = useChartData(selectedCountry, selectedBrands);

  if (scores.length === 0) {
    return <Card className="p-6 bg-[#f5f5f5] rounded-xl shadow-lg">
        <EmptyChartState selectedCountry={selectedCountry} />
      </Card>;
  }

  const yearRange = calculateYearRange(scores);
  const chartData = processChartData(scores, standardized);
  const chartConfig = createChartConfig(selectedBrands);

  // Always use 2025 as the target year for comparison
  const targetYear = 2025;
  console.log("Chart data years available:", chartData.map(d => d.year));
  console.log("Year range:", yearRange);

  return <div className="space-y-6">
      <div className="flex items-center justify-end space-x-4 mb-4 py-2">
        <span className="text-sm text-white font-medium">Standardized Scores</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-white transition-transform hover:scale-110" />
            </TooltipTrigger>
            <TooltipContent className="bg-white p-3 max-w-xs">
              <p>Standardized scores normalize the data across different brands, making comparisons more meaningful by adjusting for variations in scale.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Toggle 
          pressed={standardized} 
          onPressedChange={setStandardized} 
          aria-label="Toggle standardized scores" 
          className="border border-[#34502b]/30 relative bg-[#f0d2b0] font-semibold transition-all duration-300 hover:bg-[#e5c7a5]"
        >
          {standardized && <Check className="h-4 w-4 text-[#34502b] absolute animate-scale-in" />}
        </Toggle>
      </div>
      
      {/* Bar Chart (now first) */}
      <Card className="p-6 bg-[#f5f5f5] rounded-xl shadow-lg py-[30px] transition-all duration-300 hover:shadow-xl">
        <BrandBarChart chartData={chartData} selectedBrands={selectedBrands} chartConfig={chartConfig} standardized={standardized} latestYear={targetYear} />
      </Card>
      
      {/* Line Chart (now second) */}
      <Card className="p-6 bg-[#f5f5f5] shadow-lg my-0 px-[29px] mx-0 rounded-md py-[31px] transition-all duration-300 hover:shadow-xl">
        <BrandChart chartData={chartData} selectedBrands={selectedBrands} yearRange={yearRange} chartConfig={chartConfig} standardized={standardized} />
      </Card>
    </div>;
};

export default ChartSection;
