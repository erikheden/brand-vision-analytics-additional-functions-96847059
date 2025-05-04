
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
    // Get all unique categories present in data
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    
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

    // For each category, calculate total percentage to sort by
    const categoriesWithTotals = uniqueCategories.map(category => {
      const totalValue = data
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.value, 0);
      return { name: category, total: totalValue };
    });

    // Sort categories by total percentage (high to low)
    const sortedCategories = categoriesWithTotals
      .sort((a, b) => b.total - a.total)
      .map(item => item.name);
    
    if (chartType === 'stacked') {
      // Create stacked column chart
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
          categories: sortedCategories, // Use sorted categories
          title: {
            text: 'Sustainability Areas'
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
            return `<b>${this.series.name}</b><br>${this.x}: ${roundPercentage(this.y)}%`;
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y > 5 ? roundPercentage(this.y) + '%' : '';
              }
            },
            borderRadius: 3
          }
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal'
        },
        series: sortedLevels.map((level, index) => ({
          name: level,
          data: sortedCategories.map(category => {
            const item = data.find(d => d.name === level && d.category === category);
            return item ? item.value : 0;
          }),
          color: getColor(level, index)
        })),
        credits: {
          enabled: false
        }
      };
    } else {
      // Create standard column chart (not stacked)
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
          categories: sortedCategories, // Use sorted categories
          title: {
            text: 'Sustainability Areas'
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
            return `<b>${this.series.name}</b><br>${this.x}: ${roundPercentage(this.y)}%`;
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y > 5 ? roundPercentage(this.y) + '%' : '';
              }
            },
            borderRadius: 3
          }
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal'
        },
        series: sortedLevels.map((level, index) => ({
          name: level,
          data: sortedCategories.map(category => {
            const item = data.find(d => d.name === level && d.category === category);
            return item ? item.value : 0;
          }),
          color: getColor(level, index)
        })),
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
          Stacked view shows the distribution of impact levels across sustainability areas
        </div>
      )}
    </div>
  );
};

export default ImpactBarChart;
