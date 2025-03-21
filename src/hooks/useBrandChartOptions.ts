
import Highcharts from 'highcharts';
import { useMemo } from 'react';
import { createBrandChartOptions } from '@/utils/charts/createBrandChartOptions';

interface UseBrandChartOptionsProps {
  yearRange: { earliest: number; latest: number };
  series: Highcharts.SeriesOptionsType[];
  standardized: boolean;
  yearlyAverages: {year: number, average: number}[];
}

export const useBrandChartOptions = ({
  yearRange,
  series,
  standardized,
  yearlyAverages
}: UseBrandChartOptionsProps): Highcharts.Options => {
  return useMemo(() => {
    // Create complete chart options with modifications for standardized mode
    const options = createBrandChartOptions(
      yearRange,
      series,
      standardized,
      yearlyAverages
    );
    
    // Add a special plot line at zero for standardized scores
    if (standardized && options.yAxis && typeof options.yAxis !== 'boolean') {
      const yAxis = Array.isArray(options.yAxis) ? options.yAxis[0] : options.yAxis;
      yAxis.plotLines = [{
        value: 0,
        color: '#666',
        width: 1,
        dashStyle: 'Dash' as Highcharts.DashStyleValue,
        label: {
          text: 'Market Average',
          align: 'right' as Highcharts.AlignValue,
          style: {
            fontStyle: 'italic',
            color: '#666'
          }
        }
      }];
      
      // Update y-axis labels for standardized values
      yAxis.labels = {
        ...yAxis.labels,
        format: '{value}σ'
      };
      
      // Update y-axis title for standardized view
      yAxis.title = {
        ...yAxis.title,
        text: 'Standard Deviations from Market Mean'
      };
      
      // Update tooltip formatter for standardized values
      if (options.tooltip) {
        const origFormatter = options.tooltip.formatter;
        options.tooltip.formatter = function() {
          // @ts-ignore - this is complex to type correctly
          const result = origFormatter ? origFormatter.call(this) : undefined;
          if (typeof result === 'string') {
            return result.replace(/(\d+\.\d+)/, '$1σ');
          }
          return result;
        };
      }
    }
    
    return options;
  }, [yearRange, series, standardized, yearlyAverages]);
};
