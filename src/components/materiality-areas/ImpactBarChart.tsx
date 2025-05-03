
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { roundPercentage } from '@/utils/formatting';
import { FONT_FAMILY } from '@/utils/constants';

interface ImpactBarChartProps {
  data: Array<{
    name: string;
    value: number;
    category: string;
  }>;
  title: string;
  categories: string[];
  chartType?: 'bar' | 'stacked';
}

const ImpactBarChart: React.FC<ImpactBarChartProps> = ({ 
  data, 
  title, 
  categories,
  chartType = 'bar'
}) => {
  // Color mapping for impact levels
  const getColor = (category: string, index: number) => {
    const colors = [
      '#34502b', '#7c9457', '#b7c895', '#6ec0dc', '#09657b', '#d9d9d9',
      '#25636b', '#3d7882', '#578d96', '#72a2aa', '#8db7be', '#a8ccd1'
    ];
    
    // Use consistent colors for specific categories if needed
    const colorMap: Record<string, string> = {
      'Food & Beverage': '#34502b',
      'Fashion & Apparel': '#7c9457',
      'Beauty & Personal Care': '#b7c895',
      'Home & Living': '#6ec0dc',
      'Electronics': '#09657b',
      'Travel & Tourism': '#d9d9d9'
    };
    
    return colorMap[category] || colors[index % colors.length];
  };
  
  // Define the correct sorting order for impact levels
  const impactLevelOrder = ["Aware", "Concerned", "Acting", "Willing to pay"];
  
  // Create chart options
  const chartOptions = useMemo(() => {
    // Get all unique impact levels present in data
    const impactLevels = [...new Set(data.map(item => item.name))];
    
    // Sort impact levels according to defined order
    const sortedLevels = impactLevels.sort((a, b) => {
      const indexA = impactLevelOrder.indexOf(a);
      const indexB = impactLevelOrder.indexOf(b);
      
      // If both are found in the ordering array, compare indices
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If one is not in the ordering array, prioritize the one that is
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the ordering array, sort alphabetically
      return a.localeCompare(b);
    });
    
    if (chartType === 'stacked') {
      // Prepare stacked data for each category
      const series = categories.map((category, index) => ({
        name: category,
        data: sortedLevels.map(level => {
          const item = data.find(d => d.name === level && d.category === category);
          return item ? item.value : 0;
        }),
        color: getColor(category, index)
      }));
      
      return {
        chart: {
          type: 'column',
          style: {
            fontFamily: FONT_FAMILY
          }
        },
        title: {
          text: title,
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        xAxis: {
          categories: sortedLevels,
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Percentage (%)'
          },
          labels: {
            format: '{value}%'
          }
        },
        tooltip: {
          formatter: function() {
            return `<b>${this.x}</b><br>${this.series.name}: ${roundPercentage(this.y)}%`;
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false
            },
            borderRadius: 3
          }
        },
        legend: {
          align: 'right',
          verticalAlign: 'top',
          layout: 'vertical'
        },
        series: series,
        credits: {
          enabled: false
        }
      };
    } else {
      // Prepare data for horizontal bar chart
      const series = categories.map((category, index) => ({
        name: category,
        data: sortedLevels.map(level => {
          const item = data.find(d => d.name === level && d.category === category);
          return item ? item.value : 0;
        }),
        color: getColor(category, index)
      }));

      return {
        chart: {
          type: 'bar',
          style: {
            fontFamily: FONT_FAMILY
          }
        },
        title: {
          text: title,
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        },
        xAxis: {
          categories: sortedLevels,
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Percentage (%)'
          },
          labels: {
            format: '{value}%'
          }
        },
        tooltip: {
          formatter: function() {
            return `<b>${this.x}</b><br>${this.series.name}: ${roundPercentage(this.y)}%`;
          }
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: false
            },
            borderRadius: 3
          }
        },
        legend: {
          align: 'right',
          verticalAlign: 'top',
          layout: 'vertical'
        },
        series: series,
        credits: {
          enabled: false
        }
      };
    }
  }, [data, title, categories, chartType, impactLevelOrder]);

  return (
    <div className="w-full h-full">
      <div className="h-[400px]">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
        />
      </div>
      
      {chartType === 'stacked' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Stacked view shows the distribution of impact levels within each category
        </div>
      )}
    </div>
  );
};

export default ImpactBarChart;
