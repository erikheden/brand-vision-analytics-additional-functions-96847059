
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';

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
  // Fix: Use a more generic typing approach that works with Highcharts
  return function(this: any) {
    const tooltipContext = this as {
      points?: Array<{
        y: number | null;
        series: { name: string; color: string };
      }>;
      x?: any;
    };
    
    if (!tooltipContext.points) return '';
    
    const sortedPoints = [...tooltipContext.points].sort((a, b) => 
      ((b.y ?? 0) - (a.y ?? 0)) as number
    );

    const pointsHtml = sortedPoints.map(point => {
      const color = point.series.color;
      const value = point.y?.toFixed(2);
      
      // Add comparison to average if available
      let comparisonHtml = '';
      if (averageScore !== null && point.y !== null) {
        const diff = point.y - averageScore;
        const diffText = diff >= 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
        const diffColor = diff >= 0 ? '#34802b' : '#c44';
        comparisonHtml = `<span style="margin-left: 5px; color: ${diffColor};">(${diffText})</span>`;
      }
      
      return `
        <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
          <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
          <span style="color: #34502b;">${point.series.name}:</span>
          <span style="font-weight: bold; color: #34502b;">${value}${comparisonHtml}</span>
        </div>
      `;
    }).join('');

    // Add average line info if available
    let averageHtml = '';
    if (averageScore !== null) {
      averageHtml = `
        <div style="margin-top: 8px; padding-top: 4px; border-top: 1px dotted #34502b;">
          <span style="color: #34502b; font-style: italic;">Market Average:</span>
          <span style="font-weight: bold; color: #34502b; margin-left: 5px;">${averageScore.toFixed(2)}</span>
        </div>
      `;
    }

    return `
      <div style="font-family: '${FONT_FAMILY}'; padding: 8px; background: white; border-radius: 4px;">
        <div style="font-weight: bold; margin-bottom: 8px; color: #34502b;">${tooltipContext.x}</div>
        ${pointsHtml}
        ${averageHtml}
      </div>
    `;
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
