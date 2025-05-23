
import React from 'react';
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from '@/utils/charts/axisUtils';

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

  // Find max value across all series data for dynamic axis scaling
  const allValues: number[] = [];
  series.forEach(s => {
    // Check if it's a column/bar series with a data array
    if ((s.type === 'column' || s.type === 'bar') && Array.isArray(s.data)) {
      s.data.forEach(point => {
        if (typeof point === 'number' && !isNaN(point)) {
          allValues.push(point);
        } else if (typeof point === 'object' && point !== null && 'y' in point) {
          const value = point.y as number;
          if (!isNaN(value)) {
            allValues.push(value);
          }
        }
      });
    }
  });
  
  // Calculate dynamic y-axis domain with max cap at 100%
  const [yMin, yMax] = getDynamicPercentageAxisDomain(allValues);
  const tickInterval = getDynamicTickInterval(yMax);

  // Log sorted areas to help with debugging
  console.log('ComparisonChartOptions - sortedAreas:', sortedAreas);
  console.log('ComparisonChartOptions - series data:', series);
  console.log('ComparisonChartOptions - y-axis range:', [yMin, yMax]);

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
      // Dynamic axis configuration
      min: yMin,
      max: yMax,
      tickInterval: tickInterval,
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
        return `<b>${this.series.name}</b><br/>${this.x}: ${Math.round(this.y)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y:.0f}%', // Ensure whole numbers with no decimals
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        groupPadding: 0.1,
        pointPadding: 0.1,
        borderWidth: 0
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
