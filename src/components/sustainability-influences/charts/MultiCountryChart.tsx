
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { createMultiCountryChartOptions } from './chartOptions/multiCountryOptions';

interface MultiCountryChartProps {
  data: Record<string, InfluenceData[]>;
  selectedYear: number;
  countries: string[];
}

const MultiCountryChart: React.FC<MultiCountryChartProps> = ({
  data,
  selectedYear,
  countries
}) => {
  // Get all unique influence types across all countries
  const allInfluenceTypes = new Set<string>();
  
  Object.entries(data).forEach(([_, countryData]) => {
    const yearData = countryData.filter(item => item.year === selectedYear);
    yearData.forEach(item => {
      allInfluenceTypes.add(item.english_label_short);
    });
  });
  
  // Convert to array and sort
  const influenceTypes = Array.from(allInfluenceTypes).sort();

  if (influenceTypes.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available for {selectedYear}. Please select a different year.
        </div>
      </Card>
    );
  }

  // Generate chart options
  const options = createMultiCountryChartOptions(influenceTypes, data, selectedYear, countries);

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default MultiCountryChart;
