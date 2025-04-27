
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
    // Sort data by priority_percentage in descending order
    const sortedData = [...data].sort((a, b) => b.priority_percentage - a.priority_percentage);
    
    return sortedData.map(item => ({
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
      categories: formattedData.map(item => item.name),
      title: {
        text: 'Impact Areas'
      }
    },
    yAxis: {
      title: {
        text: 'Priority Level (%)'
      },
      max: 100
    },
    series: [{
      name: 'Priority',
      data: formattedData.map(item => item.value)
    }],
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>${this.y.toFixed(1)}%`;
      }
    }
  };

  return (
    <div className="w-full h-[600px]">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default VHOAreaBarChart;
