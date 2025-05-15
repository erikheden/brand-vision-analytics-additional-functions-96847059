
import { FONT_FAMILY } from "@/utils/constants";
import Highcharts from "highcharts";
import { CHART_COLORS } from "./chartColors";

/**
 * Creates standard chart options that can be extended by specific chart implementations
 * @param title - The chart title
 * @param subtitle - Optional subtitle for the chart
 * @param horizontal - Whether to use horizontal bars (true) or vertical columns (false)
 */
export function createStandardChartOptions(
  title: string,
  subtitle?: string,
  horizontal: boolean = false
): Highcharts.Options {
  return {
    chart: {
      type: horizontal ? 'bar' : 'column',
      backgroundColor: CHART_COLORS.neutral.background,
      style: {
        fontFamily: FONT_FAMILY
      },
      spacing: [30, 20, 30, 20], // [top, right, bottom, left]
      className: 'standard-chart'
    },
    title: {
      text: title,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    subtitle: subtitle ? {
      text: subtitle,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY,
        fontSize: '13px'
      }
    } : undefined,
    credits: {
      enabled: false
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY,
        fontWeight: 'normal'
      },
      itemHoverStyle: {
        color: '#4a7a3d'
      }
    },
    tooltip: {
      backgroundColor: 'white',
      borderColor: CHART_COLORS.neutral.border,
      borderRadius: 8,
      borderWidth: 1,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      },
      shared: true
    },
    xAxis: {
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        },
        // Auto-rotate labels if horizontal chart to prevent overlap
        rotation: horizontal ? 0 : -45,
        align: horizontal ? 'left' : 'right'
      },
      lineColor: CHART_COLORS.neutral.gridLines,
      gridLineColor: CHART_COLORS.neutral.gridLines
    },
    yAxis: {
      title: {
        text: 'Value',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineColor: CHART_COLORS.neutral.gridLines
    },
    plotOptions: {
      series: {
        animation: {
          duration: 800
        },
        states: {
          hover: {
            brightness: 0.1
          }
        }
      },
      column: {
        borderRadius: 3,
        borderWidth: 0,
        pointPadding: 0.2,
        groupPadding: 0.1
      },
      bar: {
        borderRadius: 3,
        borderWidth: 0,
        pointPadding: 0.2,
        groupPadding: 0.1
      }
    }
  };
}
