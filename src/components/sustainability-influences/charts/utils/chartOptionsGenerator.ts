
import { FONT_FAMILY } from '@/utils/constants';
import { SeriesOptionsType, Options } from 'highcharts';
import { createTooltipFormatter } from './chartUtils';

/**
 * Generate Highcharts options for the multi-country chart
 */
export function generateChartOptions(
  chartId: string, 
  influenceTypes: string[], 
  series: SeriesOptionsType[], 
  selectedYear: number
): Options {
  if (influenceTypes.length === 0) {
    return {
      chart: {
        type: 'column',
        height: 400,
      },
      title: {
        text: 'No data available'
      },
      series: []
    };
  }

  return {
    chart: {
      type: 'column',
      height: Math.max(400, 60 + 20 * influenceTypes.length),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY },
      // Add a unique render ID to help Highcharts know when to rerender
      renderTo: chartId
    },
    title: {
      text: `Sustainability Influences Comparison (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      categories: influenceTypes,
      title: {
        text: 'Influence Types',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY },
        rotation: -45,
        align: 'right'
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
      formatter: createTooltipFormatter()
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        pointPadding: 0.2,
        borderWidth: 0,
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
    series: series,
    credits: {
      enabled: false
    }
  };
}
