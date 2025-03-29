
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { FONT_FAMILY } from '@/utils/constants';

interface InfluencesBarChartProps {
  data: InfluenceData[];
  selectedYear: number;
  country: string;
}

const InfluencesBarChart: React.FC<InfluencesBarChartProps> = ({
  data,
  selectedYear,
  country
}) => {
  const chartData = useMemo(() => {
    // Filter data for the selected year
    const yearData = data.filter(item => item.year === selectedYear);
    
    // Sort by percentage in descending order
    return [...yearData].sort((a, b) => b.percentage - a.percentage);
  }, [data, selectedYear]);

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
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
      text: country,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: chartData.map(item => item.english_label_short),
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
        return `<b>${this.x}</b>: ${this.y.toFixed(1)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y:.1f}%',
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
      data: chartData.map(item => item.percentage * 100) // Convert decimal to percentage
    }],
    credits: {
      enabled: false
    }
  };

  if (chartData.length === 0) {
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
