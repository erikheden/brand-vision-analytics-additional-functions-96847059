import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { VHOData } from '@/hooks/useVHOData';

interface ChartData {
  name: string;
  value: number;
  category: string;
}

export const VHOAreaBarChart: React.FC<{ data: VHOData[] }> = ({ data }) => {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      name: item.vho_area,
      value: item.priority_percentage * 100,
      category: item.type_of_factor
    }));
  }, [data]);

  // Create the chart options without year information
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 600
    },
    title: {
      text: 'Impact Areas by Priority'
    },
    xAxis: {
      categories: Array.from(new Set(formattedData.map(item => item.name)))
    },
    yAxis: {
      title: {
        text: 'Priority Level (%)'
      }
    },
    series: [{
      name: 'Priority',
      data: formattedData.map(item => item.value)
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className="w-full h-[600px]">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default VHOAreaBarChart;
