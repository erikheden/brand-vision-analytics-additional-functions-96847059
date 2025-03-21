import Highcharts from 'highcharts';
import { createChartOptions } from '@/utils/chartConfigs';
import { FONT_FAMILY } from '@/utils/constants';

/**
 * Creates tooltip formatter function for brand chart
 */
export const createTooltipFormatter = (standardized: boolean, yearlyAverages: {year: number, average: number}[]) => {
  return function(this: any): string {
    const tooltipContext = this as unknown as { 
      points?: Highcharts.Point[],
      x?: number
    };
    
    if (!tooltipContext.points || tooltipContext.points.length === 0) return '';

    const points = [...tooltipContext.points].sort((a, b) => 
      ((b.y ?? 0) - (a.y ?? 0)) as number
    );
    
    const pointYear = tooltipContext.x;
    
    // Find average for this year if available
    let averageForYear: number | null = null;
    if (!standardized && yearlyAverages.length > 0) {
      const yearAverage = yearlyAverages.find(item => item.year === pointYear);
      if (yearAverage) {
        averageForYear = yearAverage.average;
      }
    }
    
    let pointsHtml = points.map(point => {
      // Skip the average line in the individual points section
      if (point.series.name === 'Country Average') return '';
      
      const color = point.series.color;
      const value = standardized ? 
        `${point.y?.toFixed(2)} SD` : 
        point.y?.toFixed(2);
      
      // Add difference from average if available
      let diffText = '';
      if (!standardized && averageForYear !== null && point.series.name !== 'Country Average') {
        const diff = (point.y as number) - averageForYear;
        diffText = `<span style="font-size: 0.85em; margin-left: 5px; color: ${diff >= 0 ? '#34502b' : '#b74134'}">(${diff >= 0 ? '+' : ''}${diff.toFixed(2)})</span>`;
      }
      
      return `
        <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
          <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
          <span style="color: #34502b;">${point.series.name}:</span>
          <span style="font-weight: bold; color: #34502b;">${value}${diffText}</span>
        </div>
      `;
    }).join('');
    
    // Add average line info if available
    if (!standardized && averageForYear !== null) {
      pointsHtml = `
        <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0; border-top: 1px dotted #34502b; padding-top: 4px;">
          <div style="width: 10px; height: 1px; background-color: #34502b; border-radius: 0;"></div>
          <span style="color: #34502b; font-style: italic;">Country Average:</span>
          <span style="font-weight: bold; color: #34502b;">${averageForYear.toFixed(2)}</span>
        </div>
      ` + pointsHtml;
    }
    
    const yearLabel = `${pointYear}`;
    
    return `
      <div style="font-family: '${FONT_FAMILY}'; padding: 8px; background: #ffffff; border: 1px solid rgba(52, 80, 43, 0.2); border-radius: 4px;">
        <div style="font-weight: bold; margin-bottom: 8px; color: #34502b;">${yearLabel}</div>
        ${pointsHtml}
      </div>
    `;
  };
};

/**
 * Creates complete chart options for brand trend chart
 */
export const createBrandChartOptions = (
  yearRange: { earliest: number; latest: number },
  series: Highcharts.SeriesOptionsType[],
  standardized: boolean,
  yearlyAverages: {year: number, average: number}[]
): Highcharts.Options => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  const latestYearToShow = 2025;
  
  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line',
      backgroundColor: '#ffffff',
    },
    title: {
      text: standardized ? 'Standardized Brand Score Trends' : 'Brand Score Trends',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    yAxis: {
      ...baseOptions.yAxis,
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
    },
    xAxis: {
      ...baseOptions.xAxis,
      min: yearRange.earliest,
      max: latestYearToShow,
      allowDecimals: false,
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      lineColor: '#34502b',
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: createTooltipFormatter(standardized, yearlyAverages)
    },
    series
  };
};
