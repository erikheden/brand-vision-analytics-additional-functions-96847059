
import React from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';
import { createTooltipFormatter } from '../../sustainability-knowledge/charts/utils/tooltipUtils';

interface ImpactTrendsViewProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategory: string;
  years: number[];
  impactLevels: string[];
}

const ImpactTrendsView: React.FC<ImpactTrendsViewProps> = ({
  processedData,
  selectedCategory,
  years,
  impactLevels
}) => {
  if (!selectedCategory || !processedData[selectedCategory]) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select a category to view trends.
        </div>
      </Card>
    );
  }

  const series = impactLevels.map((level, index) => {
    const data = years.map(year => {
      const value = processedData[selectedCategory][year]?.[level] || 0;
      return [year, value * 100]; // Convert to percentage
    });

    const colorIntensity = 0.9 - (index * 0.2);
    return {
      name: level,
      data: data,
      type: 'line' as const,
      color: `rgba(52, 80, 43, ${Math.max(0.3, colorIntensity)})`,
    };
  });

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: `Impact Level Trends - ${selectedCategory}`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      title: {
        text: 'Year',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      categories: years.map(String)
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
        format: '{value}%'
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: createTooltipFormatter
    },
    series: series,
    legend: {
      enabled: true,
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    credits: {
      enabled: false
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
  );
};

export default ImpactTrendsView;
