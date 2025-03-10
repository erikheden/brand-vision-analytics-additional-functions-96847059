
import Highcharts from 'highcharts';
import { getBrandColors } from './chartDataUtils';

export const createSeriesConfig = (
  selectedBrands: string[],
  chartData: any[]
): Highcharts.SeriesOptionsType[] => {
  const brandColors = getBrandColors();
  
  return selectedBrands.map((brand, index) => {
    // Extract all data points for this brand, including 2025
    const data = chartData
      .map(point => [point.Year, point.Score])
      .filter(([year, value]) => 
        value !== null && 
        value !== 0 && 
        value !== undefined &&
        year !== null
      );
    
    // Sort data points by year to ensure correct line drawing
    data.sort((a, b) => (a[0] as number) - (b[0] as number));
    
    console.log(`Series data for brand ${brand}:`, data);
    
    return {
      type: 'line',
      name: brand,
      data: data,
      color: brandColors[index % brandColors.length],
      marker: {
        symbol: 'circle',
        radius: 4
      },
      lineWidth: 2,
      connectNulls: false // Don't connect across null points
    };
  });
};
