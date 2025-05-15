
import { FONT_FAMILY } from "@/utils/constants";
import Highcharts from "highcharts";
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from "../axisUtils";
import { createStandardChartOptions } from "./standardChartOptions";
import { createPercentageTooltipFormatter } from "./tooltipFormatters";

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
  
  // Calculate dynamic y-axis domain - Make sure getDynamicPercentageAxisDomain accepts an array
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
    options.xAxis = {
      ...options.xAxis,
      opposite: false,
      min: yMin,
      max: yMax,
      tickInterval: tickInterval,
      labels: {
        ...(options.xAxis as Highcharts.XAxisOptions).labels,
        format: '{value}%'
      }
    };
    
    options.yAxis = {
      ...options.yAxis,
      type: 'category',
    };
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
    formatter: createPercentageTooltipFormatter()
  };
  
  return options;
}
