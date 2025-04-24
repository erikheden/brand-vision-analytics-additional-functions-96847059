
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';
import { createSeriesData } from '../utils/seriesUtils';
import { calculateYearsRange } from '../utils/yearsUtils';
import { createTooltipFormatter } from '../utils/tooltipUtils';

export const createKnowledgeTrendChartOptions = (
  data: any,
  selectedTerms: string[],
  selectedCountries: string[],
  chartType: 'line' | 'column' = 'line'
): Highcharts.Options => {
  const series = createSeriesData(data, selectedTerms, selectedCountries);
  const { minYear, maxYear } = calculateYearsRange(series);

  return {
    chart: {
      type: chartType,
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500
    },
    title: {
      text: 'Sustainability Knowledge Trends',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    subtitle: {
      text: selectedCountries.length === 1 
        ? getFullCountryName(selectedCountries[0]) 
        : `Comparing ${selectedCountries.length} countries`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      title: {
        text: 'Year',
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
      type: 'linear',
      min: minYear - 0.5,
      max: maxYear + 0.5,
      tickInterval: 1,
      startOnTick: false,
      endOnTick: false,
      gridLineWidth: chartType === 'column' ? 0 : 1
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        format: '{value}%',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineWidth: 1
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: createTooltipFormatter
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4
        },
        lineWidth: 2
      },
      column: {
        groupPadding: 0.1,
        pointPadding: 0.1,
        borderWidth: 0
      }
    },
    series,
    credits: {
      enabled: false
    },
    legend: {
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    }
  };
};
