import { Card } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import { calculateYearRange, processChartData, createChartConfig } from "@/utils/chartDataUtils";
import BrandChart from "./BrandChart";
import EmptyChartState from "./EmptyChartState";

interface ChartSectionProps {
  selectedCountry: string;
  selectedBrands: string[];
}

const ChartSection = ({ selectedCountry, selectedBrands }: ChartSectionProps) => {
  const { data: scores = [] } = useChartData(selectedCountry, selectedBrands);
  
  if (scores.length === 0) {
    return (
      <Card className="p-6">
        <EmptyChartState selectedCountry={selectedCountry} />
      </Card>
    );
  }

  const yearRange = calculateYearRange(scores);
  const chartData = processChartData(scores);
  const chartConfig = createChartConfig(selectedBrands);

  return (
    <Card className="p-6">
      <BrandChart
        chartData={chartData}
        selectedBrands={selectedBrands}
        yearRange={yearRange}
        chartConfig={chartConfig}
      />
    </Card>
  );
};

export default ChartSection;