
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

export const createTopicTrendChartOptions = (
  data: any[],
  selectedCountries: string[],
  selectedTopics: string[]
): Highcharts.Options => {
  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500
    },
    title: {
      text: 'Sustainability Discussion Topic Trends',
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
      type: 'linear',
      tickInterval: 1,
      gridLineWidth: 1,
      gridLineColor: '#E5E7EB',
      lineColor: '#E5E7EB',
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineColor: '#E5E7EB',
      labels: {
        format: '{value}%',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    tooltip: {
      shared: true,
      formatter: function() {
        // Using type assertion to handle the tooltip context properly
        const tooltipContext = this as unknown as Highcharts.TooltipFormatterContextObject;
        if (!tooltipContext.points) return '';
        
        let html = `<b>Year: ${tooltipContext.x}</b><br/>`;
        tooltipContext.points.forEach(point => {
          const [country, topic] = (point.series.name as string).split(' - ');
          html += `<span style="color: ${point.color}">\u25CF</span> ${getFullCountryName(country)} - ${topic}: <b>${point.y?.toFixed(1)}%</b><br/>`;
        });
        return html;
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4
        },
        lineWidth: 2
      }
    },
    legend: {
      enabled: true,
      itemStyle: {
        fontFamily: FONT_FAMILY,
        color: '#34502b'
      }
    },
    credits: {
      enabled: false
    }
  };

  return options;
};
