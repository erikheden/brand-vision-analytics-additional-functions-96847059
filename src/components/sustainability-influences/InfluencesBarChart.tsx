
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

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
    
    // Convert to array and sort alphabetically
    return Array.from(allInfluenceTypes).sort();
  }, [data, selectedYear, countries]);

  const series = useMemo(() => {
    return countries.map(country => {
      const countryData = data[country] || [];
      const yearData = countryData.filter(item => item.year === selectedYear);
      
      // Map each influence to its percentage value
      const seriesData = chartData.map(influence => {
        const influenceData = yearData.find(item => item.english_label_short === influence);
        return influenceData ? influenceData.percentage * 100 : 0;
      });
      
      return {
        name: getFullCountryName(country),
        data: seriesData,
        type: 'column' as const
      };
    });
  }, [data, selectedYear, countries, chartData]);

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500
    },
    title: {
      text: `Sustainability Influences ${selectedYear}`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    subtitle: {
      text: countries.length === 1 
        ? getFullCountryName(countries[0]) 
        : `Comparing ${countries.length} countries`,
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
      formatter: function () {
        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y.toFixed(1)}%`;
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
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

  if (countries.length === 0 || chartData.length === 0) {
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
