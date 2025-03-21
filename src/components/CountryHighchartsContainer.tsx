
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FONT_FAMILY } from "@/utils/constants";
import { LineConfig } from "@/hooks/useCountryLineChart";
import { createTooltipFormatter } from "./ChartTooltip";

interface CountryHighchartsContainerProps {
  chartData: any[];
  lines: LineConfig[];
  yAxisDomain: [number, number];
  minYear: number;
  maxYear: number;
  standardized: boolean;
}

const CountryHighchartsContainer: React.FC<CountryHighchartsContainerProps> = ({
  chartData,
  lines,
  yAxisDomain,
  minYear,
  maxYear,
  standardized
}) => {
  // Create series data for Highcharts with proper typing
  const series: Highcharts.SeriesOptionsType[] = lines.map(line => {
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
  
  // Configure the Highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: standardized ? 'Standardized Country Brand Score Comparison' : 'Country Brand Score Comparison',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      type: 'linear',
      min: minYear,
      max: maxYear,
      tickInterval: 1,
      title: {
        text: 'Year',
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
      gridLineWidth: 1,
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
    },
    yAxis: {
      min: yAxisDomain[0],
      max: yAxisDomain[1],
      title: {
        text: standardized ? 'Standardized Score' : 'Score',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        // Only apply sigma format for standardized view
        format: standardized ? '{value:.1f}σ' : '{value:.0f}',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineColor: 'rgba(52, 80, 43, 0.1)',
      // Only add the market average line for standardized view
      plotLines: standardized ? [{
        value: 0,
        color: '#666',
        dashStyle: 'Dash',
        width: 1,
        label: {
          text: 'Market Average',
          align: 'right' as Highcharts.AlignValue,
          style: {
            fontStyle: 'italic',
            color: '#666'
          }
        }
      }] : undefined
    },
    tooltip: {
      formatter: createTooltipFormatter(FONT_FAMILY, standardized),
      shared: true,
      useHTML: true
    },
    legend: {
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      line: {
        connectNulls: false, // This is the key change - don't connect over null values
      },
      series: {
        marker: {
          enabled: true
        }
      }
    },
    series
  };
  
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default CountryHighchartsContainer;
