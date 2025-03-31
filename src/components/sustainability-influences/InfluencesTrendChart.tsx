
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

interface InfluencesTrendChartProps {
  data: Record<string, InfluenceData[]>;
  selectedInfluences: string[];
  countries: string[];
}

const InfluencesTrendChart: React.FC<InfluencesTrendChartProps> = ({
  data,
  selectedInfluences,
  countries
}) => {
  const chartSeries = useMemo(() => {
    if (!data || Object.keys(data).length === 0 || 
        countries.length === 0 || selectedInfluences.length === 0) {
      return [];
    }

    const series: Highcharts.SeriesOptionsType[] = [];
    
    // For each country and each selected influence, create a series
    countries.forEach((country, countryIndex) => {
      const countryData = data[country] || [];
      
      selectedInfluences.forEach((influence, influenceIndex) => {
        // Get data for this influence across all years
        const influenceData = countryData
          .filter(item => item.english_label_short === influence)
          .sort((a, b) => a.year - b.year);
        
        if (influenceData.length > 0) {
          // Format data for Highcharts
          const seriesData = influenceData.map(item => [
            item.year,
            item.percentage * 100
          ]);
          
          // Calculate color - vary by country and influence
          const colorIntensity = 0.9 - (countryIndex * 0.15) - (influenceIndex * 0.05);
          const color = `rgba(52, 80, 43, ${Math.max(0.3, colorIntensity)})`;
          const dashStyle = countryIndex % 2 === 0 ? 'Solid' : 'Dash';
          
          series.push({
            type: 'line',
            name: `${getFullCountryName(country)} - ${influence}`,
            data: seriesData,
            color: color,
            dashStyle: dashStyle as any,
            marker: {
              enabled: true
            },
            lineWidth: 2
          });
        }
      });
    });
    
    return series;
  }, [data, selectedInfluences, countries]);

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
      text: 'Sustainability Influences Trends',
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
      type: 'category',
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
      formatter: function () {
        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y?.toFixed(1)}%`;
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true
        },
        lineWidth: 2
      }
    },
    series: chartSeries,
    credits: {
      enabled: false
    },
    legend: {
      enabled: true,
      itemStyle: {
        fontFamily: FONT_FAMILY,
        color: '#34502b'
      }
    }
  };

  if (countries.length === 0 || selectedInfluences.length === 0 || chartSeries.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one country and one influence factor to display trend data.
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

export default InfluencesTrendChart;
