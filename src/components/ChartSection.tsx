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
  const { data: scores = [] } = useChartData(selectedCountry);
  
  if (!selectedCountry) {
    return (
      <Card className="p-6 bg-[#34502b] text-white rounded-xl shadow-lg">
        <EmptyChartState selectedCountry={selectedCountry} />
      </Card>
    );
  }

  const yearRange = {
    earliest: Math.min(...scores.map(s => s.year)),
    latest: Math.max(...scores.map(s => s.year))
  };

  const chartData = scores.map(score => ({
    year: score.year,
    [selectedCountry]: score.score
  }));

  const chartConfig = {
    [selectedCountry]: {
      label: selectedCountry,
      color: '#34502b'
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[#34502b] text-white rounded-xl shadow-lg">
        <BrandChart
          chartData={chartData}
          selectedBrands={[selectedCountry]}
          yearRange={yearRange}
          chartConfig={chartConfig}
        />
      </Card>
    </div>
  );
};

export default ChartSection;