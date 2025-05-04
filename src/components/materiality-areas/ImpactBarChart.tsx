
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { 
  createBarChartOptions, 
  createStackedChartOptions, 
  ChartDataItem 
} from './chart-utils/chartConfigGenerators';

interface ImpactBarChartProps {
  data: ChartDataItem[];
  title: string;
  categories: string[];
  chartType?: 'bar' | 'stacked';
}

const ImpactBarChart: React.FC<ImpactBarChartProps> = ({ 
  data, 
  title, 
  categories,
  chartType = 'bar'
}) => {
  // Create chart options based on type
  const chartOptions = useMemo(() => {
    if (chartType === 'stacked') {
      return createStackedChartOptions(data, title, categories);
    } else {
      return createBarChartOptions(data, title, categories);
    }
  }, [data, title, categories, chartType]);

  return (
    <div className="w-full h-full">
      <div className="h-[500px]">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
        />
      </div>
      
      {chartType === 'stacked' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Stacked view shows the distribution of factor types across sustainability areas
        </div>
      )}
    </div>
  );
};

export default ImpactBarChart;
