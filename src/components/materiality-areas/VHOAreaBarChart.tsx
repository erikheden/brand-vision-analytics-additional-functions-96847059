
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
    
    // Log data to help debug
    console.log('Raw VHO data for chart:', sortedData);
    
    const result = sortedData.map(item => ({
      name: item.vho_area,
      value: Math.round(item.priority_percentage * 100), // Ensure we convert from decimal to percentage
      category: item.type_of_factor
    }));
    
    console.log('Formatted chart data:', result);
    return result;
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
      max: 100,
      min: 0 // Set minimum to ensure scale starts at 0
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
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y}%' // Add percentage sign to data labels
        }
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
