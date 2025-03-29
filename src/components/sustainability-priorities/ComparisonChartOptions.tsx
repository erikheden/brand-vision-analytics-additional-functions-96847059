
import React from 'react';
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';

interface ComparisonChartOptionsProps {
  sortedAreas: string[];
  series: Highcharts.SeriesOptionsType[];
  selectedYear: number;
}

const ComparisonChartOptions = ({ 
  sortedAreas, 
  series, 
  selectedYear 
}: ComparisonChartOptionsProps): Highcharts.Options => {
  // Generate a color array
  const colors = ['#34502b', '#5c8f4a', '#84c066', '#aad68b', '#d1ebc1'];

  // Log sorted areas to help with debugging
  console.log('ComparisonChartOptions - sortedAreas:', sortedAreas);
  console.log('ComparisonChartOptions - series data:', series);

  // Return the options object directly, not wrapped in a React fragment
  return {
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
      // This is for the area names (categories)
      categories: sortedAreas,
      title: {
        text: 'Sustainability Areas',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    yAxis: {
      // This should be for the percentage values
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
        const roundedValue = roundPercentage(this.y);
        return `<b>${this.series.name}</b><br/>${this.x}: ${roundedValue}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y}%',
          formatter: function() {
            return roundPercentage(this.y) + '%';
          },
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        groupPadding: 0.1,
        pointPadding: 0.1,
        borderWidth: 0
      },
      series: {
        // Remove the invalid pointPadding and borderWidth properties
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
};

export default ComparisonChartOptions;
