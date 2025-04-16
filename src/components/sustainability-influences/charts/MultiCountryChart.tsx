
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

interface MultiCountryChartProps {
  data: Record<string, InfluenceData[]>;
  selectedYear: number;
  countries: string[];
}

const MultiCountryChart: React.FC<MultiCountryChartProps> = ({
  data,
  selectedYear,
  countries
}) => {
  // Process data for chart
  const { influenceTypes, series } = useMemo(() => {
    // Filter data for the selected year
    const filteredData: Record<string, InfluenceData[]> = {};
    const allInfluenceTypes = new Set<string>();
    
    countries.forEach(country => {
      const countryData = data[country] || [];
      const yearData = countryData.filter(item => item.year === selectedYear);
      
      filteredData[country] = yearData;
      
      // Collect all unique influence types
      yearData.forEach(item => {
        if (item.english_label_short) {
          allInfluenceTypes.add(item.english_label_short);
        }
      });
    });
    
    // Calculate average value for each influence type across countries
    const typeAverages: Record<string, number> = {};
    
    Array.from(allInfluenceTypes).forEach(type => {
      let sum = 0;
      let count = 0;
      
      countries.forEach(country => {
        const countryData = filteredData[country] || [];
        const typeData = countryData.find(item => item.english_label_short === type);
        
        if (typeData && typeof typeData.percentage === 'number') {
          sum += typeData.percentage * 100; // Convert to percentage
          count++;
        }
      });
      
      typeAverages[type] = count > 0 ? sum / count : 0;
    });
    
    // Sort influence types by average value (high to low)
    const sortedTypes = Array.from(allInfluenceTypes).sort((a, b) => typeAverages[b] - typeAverages[a]);
    
    // Create series for each country
    const chartSeries: Highcharts.SeriesOptionsType[] = countries.map(country => {
      const countryData = filteredData[country] || [];
      
      // Assign a color based on country code
      const countryColor = getCountryColor(country);
      
      return {
        name: getFullCountryName(country),
        type: 'column',
        data: sortedTypes.map(type => {
          const typeData = countryData.find(item => item.english_label_short === type);
          return typeData ? typeData.percentage * 100 : 0; // Convert to percentage
        }),
        color: countryColor
      };
    });
    
    return { influenceTypes: sortedTypes, series: chartSeries };
  }, [data, countries, selectedYear]);
  
  // Get color based on country code
  function getCountryColor(country: string): string {
    const colorMap: Record<string, string> = {
      'Se': '#34502b',
      'No': '#5c8f4a',
      'Dk': '#84c066',
      'Fi': '#aad68b',
      'Nl': '#d1ebc1',
      // Add uppercase variants
      'SE': '#34502b',
      'NO': '#5c8f4a',
      'DK': '#84c066',
      'FI': '#aad68b',
      'NL': '#d1ebc1'
    };
    
    return colorMap[country] || '#34502b';
  }
  
  if (influenceTypes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No data available for {selectedYear}. Please select a different year.
      </div>
    );
  }
  
  // Chart options
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: Math.max(400, 60 + 20 * influenceTypes.length),
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: `Sustainability Influences Comparison (${selectedYear})`,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    xAxis: {
      categories: influenceTypes,
      title: {
        text: 'Influence Types',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        style: { color: '#34502b', fontFamily: FONT_FAMILY },
        rotation: -45,
        align: 'right'
      }
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      labels: {
        format: '{value}%',
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      }
    },
    tooltip: {
      formatter: function(this: any) {
        const countryName = this.series.name;
        const influenceType = this.point.category;
        const percentage = this.y || 0;
        
        return `<b>${countryName}</b><br/>${influenceType}: ${percentage.toFixed(1)}%`;
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        pointPadding: 0.2,
        borderWidth: 0,
        groupPadding: 0.1
      }
    },
    legend: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      },
      maxHeight: 80
    },
    series: series,
    credits: {
      enabled: false
    }
  };
  
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default MultiCountryChart;
