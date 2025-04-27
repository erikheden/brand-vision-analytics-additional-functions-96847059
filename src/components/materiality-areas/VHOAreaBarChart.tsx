
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
    // Group data by VHO area and include both factor types
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.vho_area]) {
        acc[item.vho_area] = {};
      }
      acc[item.vho_area][item.type_of_factor] = Math.round(item.priority_percentage * 100);
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Convert to array and sort by the first selected factor type
    const firstFactorType = data[0]?.type_of_factor || 'hygiene_factor';
    return Object.entries(groupedData)
      .map(([area, values]) => ({
        area,
        ...values
      }))
      .sort((a, b) => (b[firstFactorType] || 0) - (a[firstFactorType] || 0));
  }, [data]);

  // Create series for each factor type
  const series = useMemo(() => {
    const factorTypes = [...new Set(data.map(item => item.type_of_factor))];
    return factorTypes.map(factor => ({
      name: factor === 'hygiene_factor' ? 'Hygiene Factors' : 'More of Factors',
      data: formattedData.map(item => item[factor] || 0),
      color: factor === 'hygiene_factor' ? '#34502b' : '#7c9457'
    }));
  }, [formattedData, data]);

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      height: 600
    },
    title: {
      text: 'Impact Areas by Priority'
    },
    xAxis: {
      categories: formattedData.map(item => item.area),
      title: {
        text: 'Impact Areas'
      },
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Priority Level (%)'
      },
      max: 100,
      min: 0
    },
    plotOptions: {
      column: {
        grouping: true,
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{y}%'
        }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>${this.series.name}: ${this.y.toFixed(1)}%`;
      }
    },
    credits: {
      enabled: false
    },
    series
  };

  console.log('Chart data:', formattedData);
  console.log('Chart series:', series);

  return (
    <div className="w-full h-[600px]">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default VHOAreaBarChart;
