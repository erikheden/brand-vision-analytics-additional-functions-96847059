
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';

/**
 * Create y-axis configuration with plot lines for average scores 
 */
export const createYAxisConfig = (standardized: boolean, averageScore: number | null) => {
  const yAxisConfig: Highcharts.YAxisOptions = {
    title: {
      text: standardized ? 'Standardized Score' : 'Score',
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

  // Add plot line for average if available
  if (!standardized && averageScore !== null) {
    yAxisConfig.plotLines = [{
      value: averageScore,
      color: '#34502b',
      dashStyle: 'Dash' as Highcharts.DashStyleValue,
      width: 1,
      label: {
        text: 'Country Average',
        align: 'right' as Highcharts.AlignValue,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
          fontStyle: 'italic'
        }
      },
      zIndex: 5
    }];
  } else if (standardized) {
    // Add zero line for standardized view
    yAxisConfig.plotLines = [{
      value: 0,
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
  }

  return yAxisConfig;
};

/**
 * Create a tooltip formatter function that displays brand scores
 */
export const createTooltipFormatter = (standardized: boolean, averageScore: number | null) => {
  return function(this: Highcharts.TooltipFormatterCallbackFunction['this']) {
    if (!this.points) return '';
    
    const sortedPoints = [...this.points].sort((a, b) => 
      ((b.y ?? 0) - (a.y ?? 0)) as number
    );

    const pointsHtml = sortedPoints.map(point => {
      const color = point.series.color;
      const value = standardized ? 
        `${point.y?.toFixed(2)}σ` : 
        point.y?.toFixed(2);
      
      return `
        <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
          <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
          <span style="color: #34502b;">${point.series.name}:</span>
          <span style="font-weight: bold; color: #34502b;">${value}</span>
        </div>
      `;
    }).join('');

    return `
      <div style="font-family: '${FONT_FAMILY}'; padding: 8px; background: white; border-radius: 4px;">
        <div style="font-weight: bold; margin-bottom: 8px; color: #34502b;">${this.x}</div>
        ${pointsHtml}
      </div>
    `;
  };
};

/**
 * Create chart title with year information
 */
export const createChartTitle = (
  year: number, 
  standardized: boolean,
  marketDataCount: string | number = 0
) => {
  const yearText = year === 2025 ? '2025 (Projected)' : year;
  const standardizedText = standardized ? 'Standardized ' : '';
  const marketCountText = marketDataCount ? ` (${marketDataCount} markets)` : '';
  
  return `${standardizedText}Brand Performance ${yearText}${marketCountText}`;
};

/**
 * Prepare series data for bar chart
 */
export const prepareSeriesData = (
  data: any[], 
  selectedBrands: string[], 
  chartConfig: any
) => {
  return selectedBrands
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
};
