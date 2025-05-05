
import React, { useMemo } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getFullCountryName } from '@/components/CountrySelect';
import { FONT_FAMILY } from '@/utils/constants';
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from '@/utils/charts/axisUtils';

interface KnowledgeComparisonChartProps {
  countriesData: Record<string, KnowledgeData[]>;
  selectedCountries: string[];
  selectedTerms: string[];
  selectedYear: number;
}

const KnowledgeComparisonChart: React.FC<KnowledgeComparisonChartProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms,
  selectedYear
}) => {
  // Colors for different countries
  const COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', 
    '#257179', '#328a94', '#3fa3ae', '#4dbcc9', '#66c7d2'
  ];
  
  const chartOptions = useMemo(() => {
    if (!selectedTerms.length || !selectedCountries.length) return {};
    
    // Collect all percentage values to calculate axis domain
    const allPercentages: number[] = [];
    
    // Create series for each country
    const series = selectedCountries.map((country, index) => {
      const countryData = countriesData[country] || [];
      
      const data = selectedTerms.map(term => {
        const termData = countryData.find(
          item => item.term === term && item.year === selectedYear
        );
        
        const percentage = termData 
          ? (typeof termData.percentage === 'number' 
              ? Math.round(termData.percentage * 100) 
              : 0)
          : 0;
          
        // Collect all percentages for y-axis calculation
        allPercentages.push(percentage);
        
        return {
          name: term,
          y: percentage
        };
      });
      
      return {
        name: getFullCountryName(country),
        data: data,
        color: COLORS[index % COLORS.length]
      };
    });
    
    // Calculate dynamic y-axis domain
    const [yMin, yMax] = getDynamicPercentageAxisDomain(allPercentages);
    const tickInterval = getDynamicTickInterval(yMax);

    return {
      chart: {
        type: 'bar',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: `Knowledge Comparison (${selectedYear})`,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        categories: selectedTerms,
        title: {
          text: null
        },
        labels: {
          formatter: function() {
            const term = this.value;
            return term.length > 20 ? `${term.substring(0, 18)}...` : term;
          },
          style: {
            fontSize: '12px',
            fontFamily: FONT_FAMILY
          }
        }
      },
      yAxis: {
        // Dynamic axis configuration
        min: yMin,
        max: yMax,
        tickInterval: tickInterval,
        title: {
          text: 'Knowledge Level (%)',
          align: 'high'
        },
        labels: {
          overflow: 'justify',
          format: '{value}%'
        }
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.series.name}</b><br/>${this.point.name}: ${this.point.y}%`;
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{y}%',
            style: {
              fontWeight: 'normal',
              fontFamily: FONT_FAMILY
            }
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: series
    };
  }, [countriesData, selectedCountries, selectedTerms, selectedYear, COLORS]);

  if (selectedTerms.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">Please select at least one term to compare</p>
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

export default KnowledgeComparisonChart;
