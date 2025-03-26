
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

  // Log sorted areas to help with debugging
  console.log('ComparisonChartOptions - sortedAreas:', sortedAreas);

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
    yAxis: {
      // This is for the area names (categories)
      title: {
        text: 'Sustainability Areas',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      categories: sortedAreas,
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      // Ensure the category labels are visible
      reserveSpace: true,
      min: 0,
      max: sortedAreas.length - 1
    },
    tooltip: {
      formatter: function() {
        // For horizontal bar charts, the y property is the index of the category
        return `<b>${this.series.yAxis.categories[this.y]}</b><br/>${this.series.name}: ${this.x.toFixed(1)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{x:.1f}%',
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        groupPadding: 0.1
      },
      series: {
        // Ensure points are mapped to categories correctly
        pointPlacement: 'between'
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
