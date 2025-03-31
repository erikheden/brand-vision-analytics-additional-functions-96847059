
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { createTrendChartOptions } from './charts/chartOptions/trendChartOptions';

interface InfluencesTrendChartProps {
  data: Record<string, InfluenceData[]>;
  selectedInfluences: string[];
  countries: string[];
}

const InfluencesTrendChart: React.FC<InfluencesTrendChartProps> = ({
  data,
  selectedInfluences,
  countries
}) => {
  // Display empty state if no countries or influences selected
  if (countries.length === 0 || selectedInfluences.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one country and one influence factor to display trend data.
        </div>
      </Card>
    );
  }

  // Create chart options using the utility function
  const options = createTrendChartOptions(data, selectedInfluences, countries);

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default InfluencesTrendChart;
