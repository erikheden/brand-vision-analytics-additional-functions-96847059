
import React from 'react';
import { Card } from '@/components/ui/card';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';

interface KnowledgeComparisonBarChartProps {
  countriesData: Record<string, KnowledgeData[]>;
  selectedCountries: string[];
  selectedTerms: string[];
  selectedYear: number;
}

const KnowledgeComparisonBarChart: React.FC<KnowledgeComparisonBarChartProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms,
  selectedYear
}) => {
  if (!selectedTerms || selectedTerms.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex justify-center items-center h-60">
          <p className="text-gray-500">Please select at least one term to compare</p>
        </div>
      </Card>
    );
  }

  // Process data for chart with sorting
  const chartData = selectedTerms.map(term => {
    const data: Record<string, number> = {};
    
    selectedCountries.forEach(country => {
      const countryData = countriesData[country] || [];
      const yearData = countryData.find(
        item => item.term === term && item.year === selectedYear
      );
      
      data[country] = yearData 
        ? Math.round(yearData.percentage * 100)
        : 0;
    });
    
    return {
      name: term,
      data: Object.values(data)
    };
  }).sort((a, b) => {
    // Sort by the average percentage across all countries
    const avgA = a.data.reduce((sum, val) => sum + val, 0) / a.data.length;
    const avgB = b.data.reduce((sum, val) => sum + val, 0) / b.data.length;
    return avgB - avgA; // Descending order
  });

  // Adjust chart height dynamically based on number of terms
  const chartHeight = Math.max(400, 60 + 40 * selectedTerms.length);

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: chartHeight,
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: `Sustainability Knowledge Comparison (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: chartData.map(item => item.name), // Use sorted names
      title: {
        text: 'Knowledge Terms',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        },
        rotation: -45,
        align: 'right'
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
    tooltip: {
      formatter: function() {
        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y}%`;
      }
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    series: selectedCountries.map((country, index) => ({
      name: country,
      type: 'column' as const,
      data: chartData.map(item => item.data[index]),
      color: [
        '#34502b',
        '#4d7342',
        '#668c5a',
        '#7fa571',
        '#98be89',
        '#257179'
      ][index % 6]
    })),
    credits: {
      enabled: false
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </Card>
  );
};

export default KnowledgeComparisonBarChart;
