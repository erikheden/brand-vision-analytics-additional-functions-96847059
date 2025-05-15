
import { FONT_FAMILY } from "@/utils/constants";
import Highcharts from "highcharts";
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from "./axisUtils";

/**
 * Standard colors for consistent charting across the application
 */
export const CHART_COLORS = {
  // Primary palette (green shades)
  primary: [
    '#34502b',  // Dark green
    '#4d7342',  // Medium green
    '#668c5a',  // Light-medium green 
    '#7fa571',  // Light green
    '#98be89',  // Pale green
  ],
  // Secondary palette for multiple series when needed
  secondary: [
    '#257179',  // Teal
    '#328a94',  // Blue-green
    '#3fa3ae',  // Lighter blue-green
    '#4dbcc9',  // Light teal
    '#66c7d2',  // Pale teal
  ],
  // Neutral colors for backgrounds and borders
  neutral: {
    background: 'white',
    border: 'rgba(52, 80, 43, 0.2)',
    gridLines: 'rgba(52, 80, 43, 0.1)'
  }
};

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

/**
 * Creates standard percentage chart options with proper Y-axis formatting
 * @param title - The chart title
 * @param subtitle - Optional subtitle for the chart
 * @param horizontal - Whether to use horizontal bars (true) or vertical columns (false)
 * @param values - Array of percentage values to calculate appropriate Y-axis scale
 */
export function createPercentageChartOptions(
  title: string,
  subtitle: string | undefined,
  horizontal: boolean,
  values: number[]
): Highcharts.Options {
  // Get standard options first
  const options = createStandardChartOptions(title, subtitle, horizontal);
  
  // Calculate dynamic y-axis domain
  const [yMin, yMax] = getDynamicPercentageAxisDomain(values);
  const tickInterval = getDynamicTickInterval(yMax);
  
  // Set percentage-specific options
  const percentAxis: Highcharts.YAxisOptions = {
    ...options.yAxis as Highcharts.YAxisOptions,
    min: yMin,
    max: yMax,
    tickInterval: tickInterval,
    title: {
      ...(options.yAxis as Highcharts.YAxisOptions).title,
      text: 'Percentage'
    },
    labels: {
      ...(options.yAxis as Highcharts.YAxisOptions).labels,
      format: '{value}%'
    }
  };
  
  // Set the appropriate axis based on chart orientation
  if (horizontal) {
    options.xAxis = horizontal ? {
      ...options.xAxis,
      opposite: false,
      min: yMin,
      max: yMax,
      tickInterval: tickInterval,
      labels: {
        ...(options.xAxis as Highcharts.XAxisOptions).labels,
        format: '{value}%'
      }
    } : options.xAxis;
    
    options.yAxis = horizontal ? {
      ...options.yAxis,
      type: 'category',
    } : percentAxis;
  } else {
    options.yAxis = percentAxis;
  }
  
  // Enable data labels by default for percentage charts
  if (horizontal) {
    if (!options.plotOptions) options.plotOptions = {};
    if (!options.plotOptions.bar) options.plotOptions.bar = {};
    
    options.plotOptions.bar = {
      ...options.plotOptions.bar,
      dataLabels: {
        enabled: true,
        format: '{y}%',
        style: {
          fontWeight: 'normal',
          color: '#34502b',
          fontFamily: FONT_FAMILY,
          textOutline: 'none'
        }
      }
    };
  } else {
    if (!options.plotOptions) options.plotOptions = {};
    if (!options.plotOptions.column) options.plotOptions.column = {};
    
    options.plotOptions.column = {
      ...options.plotOptions.column,
      dataLabels: {
        enabled: true,
        format: '{y}%',
        style: {
          fontWeight: 'normal',
          color: '#34502b',
          fontFamily: FONT_FAMILY,
          textOutline: 'none'
        }
      }
    };
  }
  
  // Update tooltip to show percentages
  options.tooltip = {
    ...options.tooltip,
    formatter: function() {
      // Safely handle the case when points might be undefined
      if (!this.points) {
        return `<b>${this.x}</b><br><span style="color:${this.color}">●</span> ${this.series.name}: ${Math.round(this.y as number)}%`;
      }
      
      return `<b>${this.x}</b><br>` + 
        this.points.map(point => 
          `<span style="color:${point.color}">●</span> ${point.series.name}: ${Math.round(point.y as number)}%`
        ).join('<br>');
    }
  };
  
  return options;
}

/**
 * Gets chart height based on number of categories and chart type
 * @param itemCount - Number of categories to display
 * @param horizontal - Whether the chart is horizontal (bar) or vertical (column)
 * @param minHeight - Minimum chart height in pixels
 */
export function getChartHeight(
  itemCount: number, 
  horizontal: boolean = false,
  minHeight: number = 300
): number {
  if (horizontal) {
    // For horizontal charts, height scales with number of categories
    return Math.max(minHeight, 60 + (itemCount * 40));
  } else {
    // For vertical charts, base height plus small increase per item
    return Math.max(minHeight, 300 + (itemCount * 10));
  }
}

/**
 * Helper function to get colors for a single series with multiple data points
 * @param count - Number of colors needed
 * @param colorStart - Starting index in the color array
 */
export function getGradientColors(count: number, colorStart: number = 0): string[] {
  if (count <= 5) {
    // Use primary palette directly for up to 5 items
    return CHART_COLORS.primary.slice(0, count);
  }
  
  // For more items, generate gradient colors
  return Array(count).fill(0).map((_, index) => {
    // Create a gradient from dark green to light green
    const shade = 80 - ((index * (60 / Math.max(count, 1))) + colorStart);
    return `rgba(52, 80, 43, ${shade / 100})`;
  });
}

/**
 * Gets colors for multiple series
 * @param seriesCount - Number of series
 */
export function getSeriesColors(seriesCount: number): string[] {
  // Combine primary and secondary palettes for more series
  const allColors = [...CHART_COLORS.primary, ...CHART_COLORS.secondary];
  
  if (seriesCount <= allColors.length) {
    return allColors.slice(0, seriesCount);
  }
  
  // For even more series, cycle through the colors
  return Array(seriesCount).fill(0).map((_, i) => allColors[i % allColors.length]);
}
