
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { InfluenceData } from '@/hooks/sustainability-influences';
import { useMultiCountryChartData } from './hooks/useMultiCountryChartData';

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
  // Use our custom hook to handle all the data processing and chart options
  const { chartId, options, influenceTypes, hasData } = useMultiCountryChartData(
    data, 
    selectedYear, 
    countries
  );
  
  if (!hasData) {
    return (
      <div className="text-center py-10 text-gray-500">
        No data available for {selectedYear}. Please select a different year.
      </div>
    );
  }
  
  // Use the stable chart ID for the key prop to help React's reconciliation
  return (
    <div>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} 
        key={chartId}
        immutable={true}
        containerProps={{ className: 'chart-container' }}
        updateArgs={[true, true, true]}
      />
    </div>
  );
};

export default React.memo(MultiCountryChart);
