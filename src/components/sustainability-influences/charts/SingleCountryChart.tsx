
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { createSingleCountryChartOptions } from './chartOptions/singleCountryOptions';

interface SingleCountryChartProps {
  data: InfluenceData[];
  selectedYear: number;
  country: string;
}

export interface ChartDataItem {
  name: string;
  percentage: number;
}

const SingleCountryChart: React.FC<SingleCountryChartProps> = ({
  data,
  selectedYear,
  country
}) => {
  // Filter data by selected year
  const yearData = data.filter(item => item.year === selectedYear);
  
  // Create data sorted by percentage in descending order
  const chartData = yearData
    .sort((a, b) => b.percentage - a.percentage)
    .map(item => ({
      name: item.english_label_short,
      percentage: item.percentage
    }));

  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available for {selectedYear}. Please select a different year.
        </div>
      </Card>
    );
  }

  // Generate chart options
  const options = createSingleCountryChartOptions(chartData, selectedYear, country);

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default SingleCountryChart;
