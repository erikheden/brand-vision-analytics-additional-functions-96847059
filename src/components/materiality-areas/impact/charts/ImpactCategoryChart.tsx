
import React from 'react';
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

  return (
    <div className="h-[400px]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
        immutable={true}
      />
    </div>
  );
};

export default React.memo(ImpactCategoryChart);
