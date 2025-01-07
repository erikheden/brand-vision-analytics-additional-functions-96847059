import Highcharts from 'highcharts';
import { getBrandColors } from './chartDataUtils';

export const createSeriesConfig = (
  selectedBrands: string[],
  chartData: any[]
): Highcharts.SeriesOptionsType[] => {
  const brandColors = getBrandColors();
  
  return selectedBrands.map((brand, index) => ({
    type: 'line',
    name: brand,
    data: chartData.map(point => [point.year, point[brand] || null]),
    color: brandColors[index % brandColors.length],
    marker: {
      symbol: 'circle',
      radius: 4
    },
    lineWidth: 2
  }));
};