
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';
import { getFullCountryName } from '@/components/CountrySelect';
import { ChartDataItem } from '../SingleCountryChart';

export const createSingleCountryChartOptions = (
  chartData: ChartDataItem[],
  selectedYear: number,
  country: string,
  isCompact: boolean = false
) => {
  const countryName = getFullCountryName(country);
  
  return {
    chart: {
      type: 'bar',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: isCompact ? 300 : 500,
      spacingTop: isCompact ? 30 : 40,
      spacingBottom: isCompact ? 15 : 20
    },
    title: {
      text: `${isCompact ? '' : 'Sustainability Influences in '}${countryName} (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY,
        fontSize: isCompact ? '14px' : '18px'
      }
    },
    xAxis: {
      categories: chartData.map(item => item.name),
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
          fontSize: isCompact ? '10px' : '12px'
        }
      }
    },
    yAxis: {
      title: {
        text: isCompact ? '' : 'Percentage',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        format: '{value}%',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
          fontSize: isCompact ? '10px' : '12px'
        }
      }
    },
    tooltip: {
      formatter: function(this: any) {
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
            fontFamily: FONT_FAMILY,
            fontSize: isCompact ? '10px' : '12px'
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
    },
    legend: {
      enabled: false
    },
    // Adjust margins and spacing for compact mode
    margin: isCompact ? [30, 30, 30, 50] : [60, 40, 60, 60]
  };
};
