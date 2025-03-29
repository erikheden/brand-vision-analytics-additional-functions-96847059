
import Highcharts from "highcharts";
import { FONT_FAMILY } from "@/utils/constants";
import { roundPercentage } from "@/utils/formatting";
import { createTooltipFormatter } from "@/components/ChartTooltip";

/**
 * Creates the base chart options for country comparison charts
 */
export const createCountryChartOptions = (
  minYear: number,
  maxYear: number,
  yAxisDomain: [number, number],
  standardized: boolean,
  series: Highcharts.SeriesOptionsType[]
): Highcharts.Options => {
  return {
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
        formatter: function() {
          const roundedValue = roundPercentage(this.value as number);
          return standardized ? `${roundedValue}σ` : `${roundedValue}%`;
        },
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineColor: 'rgba(52, 80, 43, 0.1)',
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
        connectNulls: false,
      },
      series: {
        marker: {
          enabled: true
        }
      }
    },
    series
  };
};
