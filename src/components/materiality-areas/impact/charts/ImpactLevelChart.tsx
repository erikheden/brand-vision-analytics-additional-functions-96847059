
import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useLevelChartOptions } from '../hooks/useLevelChartOptions';

interface ImpactLevelChartProps {
  data: Array<{ name: string; value: number; category: string }>;
  selectedYear: number | null;
}

const ImpactLevelChart: React.FC<ImpactLevelChartProps> = ({
  data,
  selectedYear
}) => {
  const chartOptions = useLevelChartOptions(data, selectedYear);
  
  // Add debug logging to track rendering
  useEffect(() => {
    console.log('Level Chart rendering with data:', data.length, 'items');
  }, [data.length]);

  return (
    <div className="h-[400px]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
        immutable={true} // This ensures that only changed options trigger re-renders
        constructorType={'chart'}
      />
    </div>
  );
};

export default React.memo(ImpactLevelChart);
