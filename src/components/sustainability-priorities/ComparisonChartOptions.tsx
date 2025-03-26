
import React from 'react';
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';

interface ComparisonChartOptionsProps {
  sortedAreas: string[];
  series: Highcharts.SeriesOptionsType[];
  selectedYear: number;
}

const ComparisonChartOptions: React.FC<ComparisonChartOptionsProps> = ({ 
  sortedAreas, 
  series, 
  selectedYear 
}) => {
  // Generate a color array
  const colors = ['#34502b', '#5c8f4a', '#84c066', '#aad68b', '#d1ebc1'];

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: Math.max(300, 50 * sortedAreas.length),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Sustainability Priorities Comparison (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      categories: sortedAreas,
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        format: '{value}%',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>${this.series.name}: ${this.y.toFixed(1)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        groupPadding: 0.1
      }
    },
    legend: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      },
      maxHeight: 80
    },
    colors: colors,
    series: series,
    credits: {
      enabled: false
    }
  };

  // Return the options object as React element
  return <>{options}</>;
};

export default ComparisonChartOptions;
