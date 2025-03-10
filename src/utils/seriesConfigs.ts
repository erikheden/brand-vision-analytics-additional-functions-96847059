
import Highcharts from 'highcharts';
import { getBrandColors } from './chartDataUtils';

export const createSeriesConfig = (
  selectedBrands: string[],
  chartData: any[]
): Highcharts.SeriesOptionsType[] => {
  const brandColors = getBrandColors();
  
  return selectedBrands.map((brand, index) => {
    const data = chartData
      .map(point => [point.year, point[brand]])
      .filter(([_, value]) => value !== null && value !== 0 && value !== undefined);
    
    // Check if 2025 exists - if not, add null point to extend line to 2025
    const has2025Data = data.some(([year]) => year === 2025);
    if (!has2025Data) {
      data.push([2025, null]);
    }
    
    // Sort data points by year to ensure correct line drawing
    data.sort((a, b) => (a[0] as number) - (b[0] as number));
    
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
