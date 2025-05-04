
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { 
  createBarChartOptions,
  ChartDataItem 
} from './chart-utils/chartConfigGenerators';

interface ImpactBarChartProps {
  data: ChartDataItem[];
  title: string;
  categories: string[];
}

const ImpactBarChart: React.FC<ImpactBarChartProps> = ({ 
  data, 
  title, 
  categories
}) => {
  // Create chart options
  const chartOptions = useMemo(() => {
    return createBarChartOptions(data, title, categories);
  }, [data, title, categories]);

  return (
    <div className="w-full h-full">
      <div className="h-[600px]">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
        />
      </div>
    </div>
  );
};

export default ImpactBarChart;
