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
      <div className="flex items-center justify-end space-x-2">
        <span className="text-sm text-[#34502b]">Standardized Scores</span>
        <Toggle pressed={standardized} onPressedChange={setStandardized} aria-label="Toggle standardized scores" className="border border-[#34502b]/30 relative bg-[#f0d2b0] font-semibold">
          {standardized && <Check className="h-4 w-4 text-[#34502b] absolute" />}
        </Toggle>
      </div>
      
      <Card className="p-6 bg-[#f5f5f5] shadow-lg my-0 px-[29px] mx-0 rounded-md py-[31px]">
        <BrandChart chartData={chartData} selectedBrands={selectedBrands} yearRange={yearRange} chartConfig={chartConfig} standardized={standardized} />
      </Card>
      
      <Card className="p-6 bg-[#f5f5f5] rounded-xl shadow-lg py-[30px]">
        <BrandBarChart chartData={chartData} selectedBrands={selectedBrands} chartConfig={chartConfig} standardized={standardized} latestYear={targetYear} />
      </Card>
    </div>;
};
export default ChartSection;