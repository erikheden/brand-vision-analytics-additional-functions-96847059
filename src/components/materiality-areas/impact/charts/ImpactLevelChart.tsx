
import React from 'react';
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

export default React.memo(ImpactLevelChart);
