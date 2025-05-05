
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { MaterialityData } from '@/hooks/useGeneralMaterialityData';
import { FONT_FAMILY } from '@/utils/constants';
import { roundPercentage } from '@/utils/formatting';
import { toast } from 'sonner';
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from '@/utils/charts/axisUtils';

interface PrioritiesBarChartProps {
  data: MaterialityData[];
  selectedYear: number;
}

const PrioritiesBarChart: React.FC<PrioritiesBarChartProps> = ({
  data,
  selectedYear
}) => {
  const chartData = useMemo(() => {
    console.log(`Filtering data for year ${selectedYear}, total data points: ${data.length}`);

    // Filter data for the selected year
    const yearData = data.filter(item => item.year === selectedYear);
    console.log(`Found ${yearData.length} records for year ${selectedYear}`);

    if (yearData.length === 0 && data.length > 0) {
      // Only show toast if we have data but not for the selected year
      toast.info(`No data available for ${selectedYear}. Showing the most recent year instead.`);
      // Get the most recent year data instead
      const years = [...new Set(data.map(item => item.year))];
      const mostRecentYear = Math.max(...years);
      return [...data.filter(item => item.year === mostRecentYear)]
        .sort((a, b) => b.percentage - a.percentage);
    }

    // Sort data by percentage in descending order
    return [...yearData].sort((a, b) => b.percentage - a.percentage);
  }, [data, selectedYear]);

  // Extract percentage values for y-axis calculation
  const percentageValues = chartData.map(item => Math.round(item.percentage * 100));
  
  // Calculate dynamic y-axis domain
  const [yMin, yMax] = getDynamicPercentageAxisDomain(percentageValues);
  const tickInterval = getDynamicTickInterval(yMax);

  const isPlaceholderData = useMemo(() => {
    // Check if we're using placeholder data by looking at the data structure
    // Real data should have row_id, placeholder doesn't
    return data.length > 0 && data.every(item => !item.row_id);
  }, [data]);

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
      text: `Sustainability Priorities ${selectedYear}${isPlaceholderData ? ' (Sample Data)' : ''}`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    subtitle: {
      text: 'General Population',
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
      // Dynamic axis range
      min: yMin,
      max: yMax,
      tickInterval: tickInterval,
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
      data: chartData.map(item => Math.round(item.percentage * 100)) // Round to whole number and convert decimal to percentage
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
      {isPlaceholderData && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
          <p className="font-medium">Note: Sample data is being displayed.</p>
          <p>No actual data was found in the database for the selected country.</p>
        </div>
      )}
    </Card>;
};

export default PrioritiesBarChart;
