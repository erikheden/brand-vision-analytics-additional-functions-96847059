
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';
import { getFullCountryName } from '@/components/CountrySelect';
import { ChartDataItem } from '../SingleCountryChart';
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from '@/utils/charts/axisUtils';

export const createSingleCountryChartOptions = (
  chartData: ChartDataItem[],
  selectedYear: number,
  country: string,
  isCompact: boolean = false
) => {
  const countryName = getFullCountryName(country);
  
  // Extract percentage values for calculating axis domain
  const percentageValues = chartData.map(item => item.percentage * 100); // Convert decimals to percentages
  
  // Calculate dynamic y-axis domain
  const [yMin, yMax] = getDynamicPercentageAxisDomain(percentageValues);
  const tickInterval = getDynamicTickInterval(yMax);
  
  console.log(`Chart options for ${country}: percentages range from ${Math.min(...percentageValues)} to ${Math.max(...percentageValues)}`);
  console.log(`Axis domain: [${yMin}, ${yMax}] with tick interval ${tickInterval}`);
  
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
      // Dynamic axis range
      min: yMin,
      max: yMax,
      tickInterval: tickInterval,
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
      data: chartData.map(item => item.percentage * 100) // Convert decimal to percentage for display
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
