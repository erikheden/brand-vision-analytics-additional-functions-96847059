
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';
import { getFullCountryName } from '@/components/CountrySelect';
import { ChartDataItem } from '../SingleCountryChart';

export const createSingleCountryChartOptions = (
  chartData: ChartDataItem[],
  selectedYear: number,
  country: string
) => {
  const countryName = getFullCountryName(country);
  
  return {
    chart: {
      type: 'bar',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500
    },
    title: {
      text: `Sustainability Influences in ${countryName} (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: chartData.map(item => item.name),
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
      labels: {
        format: '{value}%',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b>: ${roundPercentage(this.y)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y:.0f}%',
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        colorByPoint: true,
        colors: chartData.map((_, index) => {
          // Create a gradient from dark green to light green
          const shade = 80 - index * (60 / Math.max(chartData.length, 1));
          return `rgba(52, 80, 43, ${shade / 100})`;
        })
      }
    },
    series: [{
      name: 'Influence',
      type: 'bar',
      data: chartData.map(item => Math.round(item.percentage * 100))
    }],
    credits: {
      enabled: false
    }
  };
};
