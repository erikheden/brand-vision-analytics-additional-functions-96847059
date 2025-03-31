
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';
import { roundPercentage } from '@/utils/formatting';

interface InfluencesBarChartProps {
  data: Record<string, InfluenceData[]>;
  selectedYear: number;
  countries: string[];
}

const InfluencesBarChart: React.FC<InfluencesBarChartProps> = ({
  data,
  selectedYear,
  countries
}) => {
  // Process chart data
  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0 || countries.length === 0) {
      return [];
    }

    // Get all unique influence types across all countries
    const allInfluenceTypes = new Set<string>();
    
    Object.entries(data).forEach(([_, countryData]) => {
      const yearData = countryData.filter(item => item.year === selectedYear);
      yearData.forEach(item => {
        allInfluenceTypes.add(item.english_label_short);
      });
    });
    
    // Convert to array and sort
    const influenceTypes = Array.from(allInfluenceTypes).sort();
    
    if (countries.length === 1) {
      // For single country, create a simple array of influence types with their percentages
      const countryData = data[countries[0]] || [];
      const yearData = countryData.filter(item => item.year === selectedYear);
      
      // Create data sorted by percentage in descending order
      return yearData
        .sort((a, b) => b.percentage - a.percentage)
        .map(item => ({
          name: item.english_label_short,
          percentage: item.percentage
        }));
    } else {
      // For multiple countries, return the influence types only
      return influenceTypes;
    }
  }, [data, selectedYear, countries]);

  // Create options for single country chart
  const singleCountryOptions = useMemo(() => {
    if (countries.length !== 1 || chartData.length === 0) return null;
    
    const countryName = getFullCountryName(countries[0]);
    
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
  }, [chartData, countries, selectedYear]);

  // Create options for multi-country chart
  const multiCountryOptions = useMemo(() => {
    if (countries.length <= 1 || typeof chartData === 'object' || chartData.length === 0) return null;
    
    const series = countries.map(country => {
      const countryData = data[country] || [];
      const yearData = countryData.filter(item => item.year === selectedYear);
      
      // Map each influence to its percentage value
      const seriesData = chartData.map(influence => {
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
        categories: chartData,
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
  }, [chartData, countries, data, selectedYear]);

  // Choose the appropriate options based on number of countries
  const options = countries.length === 1 ? singleCountryOptions : multiCountryOptions;

  if (countries.length === 0 || !options) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available for {selectedYear}. Please select a different year or country.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default InfluencesBarChart;
