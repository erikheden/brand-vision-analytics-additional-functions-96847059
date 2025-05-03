
import React, { useMemo } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getFullCountryName } from '@/components/CountrySelect';
import { FONT_FAMILY } from '@/utils/constants';

interface KnowledgeTrendComparisonChartProps {
  countriesData: Record<string, KnowledgeData[]>;
  selectedCountries: string[];
  selectedTerms: string[];
}

const KnowledgeTrendComparisonChart: React.FC<KnowledgeTrendComparisonChartProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms
}) => {
  // Colors for different countries and terms
  const COUNTRY_COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89'
  ];
  
  const TERM_LINE_TYPES = [
    'Solid', 'Dash', 'DashDot', 'Dot'
  ];
  
  const chartOptions = useMemo(() => {
    if (!countriesData || Object.keys(countriesData).length === 0 || selectedTerms.length === 0) {
      return {};
    }
    
    // Get all years from all countries
    const allYears = new Set<number>();
    Object.values(countriesData).forEach(countryData => {
      countryData.forEach(item => {
        if (selectedTerms.includes(item.term)) {
          allYears.add(item.year);
        }
      });
    });
    
    // Sort years
    const sortedYears = Array.from(allYears).sort((a, b) => a - b);
    
    // Create series for each country-term combination
    const series: Highcharts.SeriesOptionsType[] = [];
    
    selectedCountries.forEach((country, countryIndex) => {
      const countryData = countriesData[country] || [];
      
      selectedTerms.forEach((term, termIndex) => {
        // Check if there's data for this combination
        const termData = countryData.filter(item => 
          item.term === term && selectedTerms.includes(term)
        );
        
        if (termData.length > 0) {
          series.push({
            name: `${getFullCountryName(country)} - ${term}`,
            type: 'line',
            color: COUNTRY_COLORS[countryIndex % COUNTRY_COLORS.length],
            dashStyle: termIndex > 0 ? 
                      TERM_LINE_TYPES[termIndex % TERM_LINE_TYPES.length] as Highcharts.DashStyleValue : 
                      undefined,
            data: sortedYears.map(year => {
              const yearData = termData.find(item => item.year === year);
              
              if (!yearData) return [year, null];
              
              const percentage = typeof yearData.percentage === 'number'
                ? Math.round(yearData.percentage * 100)
                : null;
              
              return [year, percentage];
            })
          });
        }
      });
    });

    return {
      chart: {
        type: 'line',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: 'Knowledge Level Trends',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        title: {
          text: 'Year'
        },
        accessibility: {
          rangeDescription: 'Range: years from available data'
        }
      },
      yAxis: {
        title: {
          text: 'Knowledge Level (%)'
        },
        min: 0,
        max: 100,
        labels: {
          format: '{value}%'
        }
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: 'Year {point.x}: {point.y}%'
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true,
            radius: 4
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        maxHeight: 200,
        scrollable: true
      },
      series: series,
      credits: {
        enabled: false
      }
    };
  }, [countriesData, selectedCountries, selectedTerms, COUNTRY_COLORS, TERM_LINE_TYPES]);

  if (!selectedTerms.length || !Object.keys(countriesData).length) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No trend data available for the selected criteria</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions} 
      />
    </div>
  );
};

export default KnowledgeTrendComparisonChart;
