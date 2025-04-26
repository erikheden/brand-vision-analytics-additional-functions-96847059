
import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useCategoryChartOptions } from '../hooks/useCategoryChartOptions';

interface ImpactCategoryChartProps {
  data: Array<{ name: string; value: number; category: string }>;
  selectedYear: number | null;
  selectedLevels: string[];
}

const ImpactCategoryChart: React.FC<ImpactCategoryChartProps> = ({
  data,
  selectedYear,
  selectedLevels
}) => {
  const chartOptions = useCategoryChartOptions(data, selectedYear, selectedLevels);
  
  // Add debug logging to track rendering
  useEffect(() => {
    console.log('Category Chart rendering with data:', data.length, 'items');
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

export default React.memo(ImpactCategoryChart);
