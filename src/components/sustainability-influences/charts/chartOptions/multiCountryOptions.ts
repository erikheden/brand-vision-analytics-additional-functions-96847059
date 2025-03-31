
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';
import { getFullCountryName } from '@/components/CountrySelect';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';

export const createMultiCountryChartOptions = (
  influenceTypes: string[],
  data: Record<string, InfluenceData[]>,
  selectedYear: number,
  countries: string[]
) => {
  const series = countries.map(country => {
    const countryData = data[country] || [];
    const yearData = countryData.filter(item => item.year === selectedYear);
    
    // Map each influence to its percentage value
    const seriesData = influenceTypes.map(influence => {
      const influenceData = yearData.find(item => item.english_label_short === influence);
      return influenceData ? Math.round(influenceData.percentage * 100) : 0;
    });
    
    return {
      name: getFullCountryName(country),
      data: seriesData,
      type: 'column' as const
    };
  });

  return {
    chart: {
      type: 'column',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500
    },
    title: {
      text: `Sustainability Influences Comparison (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    subtitle: {
      text: `Comparing ${countries.length} countries`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: influenceTypes,
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        },
        rotation: -45
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
        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y}%`;
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{y}%',
          style: {
            fontWeight: 'normal',
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        }
      }
    },
    series: series,
    credits: {
      enabled: false
    }
  };
};
