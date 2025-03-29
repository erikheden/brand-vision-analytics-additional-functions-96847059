
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';
import { createTooltipContainer, createTooltipPoint, createAverageScoreDisplay, formatDifferenceText } from '@/utils/charts/tooltipFormatters';
import { roundPercentage } from '@/utils/formatting';

/**
 * Create y-axis configuration with plot lines for average scores 
 */
export const createYAxisConfig = (standardized: boolean, averageScore: number | null) => {
  const yAxisConfig: Highcharts.YAxisOptions = {
    title: {
      text: 'Score',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    labels: {
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      },
      formatter: function() {
        return roundPercentage(this.value as number) + '%';
      }
    },
    gridLineColor: 'rgba(52, 80, 43, 0.1)'
  };

  // Add plot line for market average if available
  if (averageScore !== null) {
    yAxisConfig.plotLines = [{
      value: averageScore,
      color: '#34502b',
      dashStyle: 'Dash' as Highcharts.DashStyleValue,
      width: 1,
      label: {
        text: 'Market Average',
        align: 'right' as Highcharts.AlignValue,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
          fontStyle: 'italic'
        }
      },
      zIndex: 5
    }];
  } else {
    // Ensure no plot lines when no average is available
    yAxisConfig.plotLines = undefined;
  }

  return yAxisConfig;
};

/**
 * Create a tooltip formatter function that displays brand scores
 */
export const createTooltipFormatter = (standardized: boolean, averageScore: number | null) => {
  // Use a more generic typing approach that works with Highcharts
  return function(this: any) {
    const tooltipContext = this as {
      points?: Array<{
        y: number | null;
        series: { name: string; color: string };
      }>;
      x?: any;
      point?: {
        name: string;
        y: number | null;
        color: string;
      };
    };
    
    // Handle single point hover (column chart case)
    if (tooltipContext.point && tooltipContext.point.y !== null) {
      const point = tooltipContext.point;
      const diff = averageScore !== null ? formatDifferenceText(point.y, averageScore) : '';
      
      return createTooltipContainer(
        point.name,
        createTooltipPoint('Score', roundPercentage(point.y), point.color, diff),
        averageScore !== null ? createAverageScoreDisplay(averageScore) : ''
      );
    }
    
    // Handle multi-series hover (original implementation)
    if (!tooltipContext.points) return '';
    
    const sortedPoints = [...tooltipContext.points].sort((a, b) => 
      ((b.y ?? 0) - (a.y ?? 0)) as number
    );

    const pointsHtml = sortedPoints.map(point => {
      const name = point.series.name;
      const color = point.series.color;
      const value = point.y;
      
      // Skip if no value
      if (value === null || value === undefined) return '';
      
      // Calculate difference from average if available
      const diff = averageScore !== null ? formatDifferenceText(value, averageScore) : '';
      
      return createTooltipPoint(name, roundPercentage(value), color, diff);
    }).join('');

    // Add average line info if available
    const averageHtml = averageScore !== null ? createAverageScoreDisplay(averageScore) : '';

    return createTooltipContainer(
      tooltipContext.x || 'Brand Score',
      pointsHtml,
      averageHtml
    );
  };
};

/**
 * Create chart title with year information
 */
export const createChartTitle = (
  year: number, 
  standardized: boolean, // Kept for API compatibility but ignored
  marketDataCount: string | number = 0
) => {
  const marketCountText = marketDataCount ? ` (${marketDataCount})` : '';
  return `Brand Performance ${year}${marketCountText}`;
};

/**
 * Prepare series data for bar chart
 */
export const prepareSeriesData = (
  data: any[], 
  selectedBrands: string[], 
  chartConfig: any
) => {
  const seriesItems = selectedBrands
    .map(brand => {
      const brandData = data.find(d => d[brand] !== undefined && d[brand] !== null);
      if (!brandData) return null;
      
      const color = chartConfig[brand]?.color || '#34502b';
      return {
        name: brand,
        y: brandData[brand],
        color
      };
    })
    .filter(item => item !== null);
    
  // Sort the items by value, high to low
  return seriesItems.sort((a, b) => (b?.y ?? 0) - (a?.y ?? 0));
};
