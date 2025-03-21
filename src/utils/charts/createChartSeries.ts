
import Highcharts from 'highcharts';

/**
 * Create main data series for brands
 */
export const createBrandSeries = (
  chartData: any[],
  selectedBrands: string[],
  chartConfig: any
): Highcharts.SeriesOptionsType[] => {
  return selectedBrands.map((brand, index) => {
    const brandColor = chartConfig[brand]?.color || '#333333';
    
    const data = chartData
      .map(point => {
        const isProjected = point.year === 2025 && point.Projected;
        
        return {
          x: point.year,
          y: point[brand],
          isProjected
        };
      })
      .filter(point => point.y !== null && point.y !== 0 && point.y !== undefined);
    
    const formattedData = data.map(point => ({ 
      x: point.x, 
      y: point.y,
      marker: point.isProjected ? { 
        fillColor: brandColor,
        lineWidth: 2,
        lineColor: '#ffffff',
        radius: 6
      } : undefined
    }));
    
    return {
      type: 'line' as const,
      name: brand,
      data: formattedData,
      color: brandColor,
      marker: {
        symbol: 'circle',
        radius: 4
      },
      lineWidth: 2,
      connectNulls: false
    };
  });
};

/**
 * Create average score series if data is available
 */
export const createAverageScoreSeries = (
  yearlyAverages: {year: number, average: number}[]
): Highcharts.SeriesLineOptions | null => {
  if (yearlyAverages.length === 0) return null;
  
  console.log("Creating market average series with data:", yearlyAverages);
  
  const averageData = yearlyAverages.map(item => ({
    x: item.year,
    y: item.average,
    marker: {
      fillColor: '#34502b',
      lineWidth: 2,
      lineColor: '#ffffff',
      radius: 4
    }
  }));

  return {
    type: 'line',
    name: 'Market Average',
    data: averageData,
    color: '#34502b',
    dashStyle: 'Dash',
    marker: {
      symbol: 'diamond',
      radius: 3
    },
    lineWidth: 1.5,
    zIndex: 1,
    connectNulls: false
  };
};
