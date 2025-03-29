
import Highcharts from "highcharts";
import { LineConfig } from "@/hooks/useCountryLineChart";

/**
 * Creates series for regular country lines
 */
export const createRegularSeries = (
  chartData: any[],
  lines: LineConfig[]
): Highcharts.SeriesOptionsType[] => {
  const regularLines = lines.filter(line => !line.name.includes("Market Average"));
  
  return regularLines.map(line => {
    const seriesData = chartData.map(point => {
      // Only include points that have a non-zero and non-null value
      const value = point[line.dataKey];
      if (value === null || value === undefined || value === 0) {
        return [point.year, null]; // Use null to create a break in the line
      }
      return [point.year, value];
    });
    
    return {
      type: 'line' as const,
      name: line.name,
      data: seriesData,
      color: line.color,
      lineWidth: 2,
      dashStyle: line.strokeDasharray ? ('Dash' as Highcharts.DashStyleValue) : ('Solid' as Highcharts.DashStyleValue),
      marker: {
        symbol: 'circle',
        radius: 4
      },
      opacity: line.opacity
    };
  });
};

/**
 * Creates series for market average lines
 */
export const createMarketAverageSeries = (
  chartData: any[],
  lines: LineConfig[]
): Highcharts.SeriesOptionsType[] => {
  const marketAverageLines = lines.filter(line => line.name.includes("Market Average"));
  
  return marketAverageLines.map(line => {
    const seriesData = chartData.map(point => {
      const value = point[line.dataKey];
      if (value === null || value === undefined || value === 0) {
        return [point.year, null];
      }
      return [point.year, value];
    });
    
    return {
      type: 'line' as const,
      name: line.name,
      data: seriesData,
      color: '#34502b',
      lineWidth: 1.5,
      dashStyle: 'Dash' as Highcharts.DashStyleValue,
      marker: {
        symbol: 'diamond',
        radius: 3
      },
      opacity: 0.8,
      zIndex: 1
    };
  });
};
