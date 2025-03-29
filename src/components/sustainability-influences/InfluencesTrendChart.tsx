
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { FONT_FAMILY } from '@/utils/constants';

interface InfluencesTrendChartProps {
  data: InfluenceData[];
  selectedInfluences: string[];
  country: string;
}

const InfluencesTrendChart: React.FC<InfluencesTrendChartProps> = ({
  data,
  selectedInfluences,
  country
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0 || selectedInfluences.length === 0) return [];

    // Filter data for selected influences only
    const filteredData = data.filter(item => selectedInfluences.includes(item.english_label_short));
    
    // Group by year and influence
    const years = [...new Set(filteredData.map(item => item.year))].sort((a, b) => a - b);
    
    return selectedInfluences.map(influence => {
      const influenceData = years.map(year => {
        const yearData = filteredData.find(
          item => item.year === year && item.english_label_short === influence
        );
        return [year, yearData ? yearData.percentage * 100 : null];
      });
      
      return {
        name: influence,
        data: influenceData
      };
    });
  }, [data, selectedInfluences]);

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
      text: country,
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
        lineWidth: 3
      }
    },
    series: chartData.map((series, index) => ({
      type: 'line',
      name: series.name,
      data: series.data,
      color: `rgba(52, 80, 43, ${0.9 - (index * 0.1)})`
    })),
    credits: {
      enabled: false
    }
  };

  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one influence factor to display trend data.
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
