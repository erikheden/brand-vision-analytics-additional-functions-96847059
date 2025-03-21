
import Highcharts from 'highcharts';
import { useMemo } from 'react';
import { createBrandChartOptions } from '@/utils/charts/createBrandChartOptions';

interface UseBrandChartOptionsProps {
  yearRange: { earliest: number; latest: number };
  series: Highcharts.SeriesOptionsType[];
  standardized: boolean; // Kept for API compatibility but ignored
  yearlyAverages: {year: number, average: number}[];
}

export const useBrandChartOptions = ({
  yearRange,
  series,
  standardized, // Always treated as false
  yearlyAverages
}: UseBrandChartOptionsProps): Highcharts.Options => {
  return useMemo(() => {
    // Create complete chart options without standardization
    const options = createBrandChartOptions(
      yearRange,
      series,
      false, // Always pass false here
      yearlyAverages
    );
    
    if (options.yAxis && typeof options.yAxis !== 'boolean') {
      const yAxis = Array.isArray(options.yAxis) ? options.yAxis[0] : options.yAxis;
      
      // Reset the y-axis title to just "Score"
      yAxis.title = {
        ...yAxis.title,
        text: 'Score'
      };
      
      // Remove any sigma symbol from labels
      yAxis.labels = {
        ...yAxis.labels,
        format: undefined
      };
      
      // Only add plot lines for country average if we have data
      if (yearlyAverages && yearlyAverages.length > 0) {
        // Country average plot lines will be handled by the average series
        yAxis.plotLines = undefined;
      }
    }
    
    return options;
  }, [yearRange, series, yearlyAverages]);
};
