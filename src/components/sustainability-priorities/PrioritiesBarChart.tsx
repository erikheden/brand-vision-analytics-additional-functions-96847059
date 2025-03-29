
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { MaterialityData } from '@/hooks/useGeneralMaterialityData';
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';

interface PrioritiesBarChartProps {
  data: MaterialityData[];
  selectedYear: number;
  selectedAgeId?: number | null;
}

const PrioritiesBarChart: React.FC<PrioritiesBarChartProps> = ({
  data,
  selectedYear,
  selectedAgeId = null
}) => {
  const chartData = useMemo(() => {
    console.log(`Filtering data for year ${selectedYear}, total data points: ${data.length}`);

    // Filter data for the selected year
    const yearData = data.filter(item => item.year === selectedYear);
    console.log(`Found ${yearData.length} records for year ${selectedYear}`);

    // Sort data by percentage in descending order
    return [...yearData].sort((a, b) => b.percentage - a.percentage);
  }, [data, selectedYear]);

  // Get subtitle based on selected age group
  const subtitle = useMemo(() => {
    if (!selectedAgeId) {
      return 'General Population';
    }
    
    const ageItem = data.find(item => item.age_id === selectedAgeId);
    return ageItem?.age_group || `Age Group ID: ${selectedAgeId}`;
  }, [data, selectedAgeId]);

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 600 // Increased height from default
    },
    title: {
      text: `Sustainability Priorities ${selectedYear}`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    subtitle: {
      text: subtitle,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      categories: chartData.map(item => item.materiality_area),
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
        return `<b>${this.x}</b>: ${roundPercentage(this.y)}%`;
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y}%',
          formatter: function() {
            return roundPercentage(this.y) + '%';
          },
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
      name: 'Priority',
      type: 'bar',
      data: chartData.map(item => item.percentage * 100) // Convert decimal to percentage
    }],
    credits: {
      enabled: false
    }
  };

  if (chartData.length === 0) {
    return <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available for {selectedYear}. Please select a different year or country.
        </div>
      </Card>;
  }

  return <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[600px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>;
};

export default PrioritiesBarChart;
