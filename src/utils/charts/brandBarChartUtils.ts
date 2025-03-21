
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';

/**
 * Creates the yAxis configuration for the brand bar chart based on standardized mode
 */
export const createYAxisConfig = (
  standardized: boolean, 
  averageScore: number | null
): Highcharts.YAxisOptions => {
  if (standardized) {
    return {
      title: {
        text: 'Standard Deviations from Market Mean',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
        }
      },
      labels: {
        format: '{value}σ',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
        }
      },
      plotLines: [{
        value: 0,
        color: '#34502b',
        dashStyle: 'Dash' as Highcharts.DashStyleValue,
        width: 1.5,
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
      }],
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
    };
  } else {
    const config: Highcharts.YAxisOptions = {
      title: {
        text: 'Score',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
        }
      },
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
        }
      },
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
    };

    if (averageScore) {
      config.plotLines = [{
        value: averageScore,
        color: '#34502b',
        dashStyle: 'Dash' as Highcharts.DashStyleValue,
        width: 1.5,
        label: {
          text: `Country Average: ${averageScore.toFixed(2)}`,
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

    return config;
  }
};

/**
 * Creates tooltip formatter function for brand bar chart
 */
export const createTooltipFormatter = (standardized: boolean, averageScore: number | null) => {
  return function(this: Highcharts.TooltipFormatterContextObject): string {
    if (standardized) {
      const value = `${this.y?.toFixed(2)}σ`;
      return `<b>${this.key}</b>: ${value} from market average`;
    } else {
      let tooltipText = `<b>${this.key}</b>: ${this.y?.toFixed(2)}`;
      
      if (averageScore !== null) {
        const diff = (this.y as number) - averageScore;
        const diffText = diff >= 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
        tooltipText += `<br/><span style="font-size: 0.9em; font-style: italic;">Difference from average: ${diffText}</span>`;
      }
      
      return tooltipText;
    }
  };
};

/**
 * Creates chart title based on the display parameters
 */
export const createChartTitle = (
  displayYear: number, 
  isStandardized: boolean, 
  marketDataCount: string | number
): string => {
  const marketComparisonText = typeof marketDataCount === 'string'
    ? marketDataCount
    : marketDataCount > 0 
      ? `vs ${marketDataCount} brands` 
      : 'Market Standardized';

  return isStandardized 
    ? `${displayYear} Market-Relative Brand Scores (${marketComparisonText})`
    : `${displayYear} Brand Scores Comparison`;
};

/**
 * Prepares chart series data from brand scores
 */
export const prepareSeriesData = (
  dataToUse: any[], 
  selectedBrands: string[], 
  chartConfig: any
): Highcharts.PointOptionsObject[] => {
  return selectedBrands.map(brand => {
    const scoreValue = dataToUse[0]?.[brand] || 0;
    return {
      name: brand,
      y: scoreValue,
      color: chartConfig[brand]?.color || '#4E79A7' // Default color
    };
  }).sort((a, b) => (b.y as number) - (a.y as number));
};
