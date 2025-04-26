
import { useMemo } from 'react';
import { FONT_FAMILY } from '@/utils/constants';

export const useCategoryChartOptions = (
  data: Array<{ name: string; value: number; category: string }>,
  selectedYear: number | null,
  selectedLevels: string[]
) => {
  return useMemo(() => {
    // Get unique categories from data
    const categories = [...new Set(data.map(item => item.name))];
    
    // Get unique series names from data
    const seriesNames = [...new Set(data.map(item => item.category))];
    
    // Create series data
    const series = seriesNames
      .filter(name => selectedLevels.includes(name))
      .map(seriesName => ({
        name: seriesName,
        data: categories.map(category => {
          const matchingItem = data.find(item => item.name === category && item.category === seriesName);
          return matchingItem ? matchingItem.value : 0;
        }),
        type: 'column'
      }));

    return {
      chart: {
        type: 'bar',
        backgroundColor: 'white',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: `Impact by Category (${selectedYear})`,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        categories,
        title: {
          text: 'Category',
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY
          }
        }
      },
      yAxis: {
        min: 0,
        max: 100,
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
      series,
      credits: {
        enabled: false
      }
    };
  }, [
    // Stringify data for stable comparison
    JSON.stringify(data), 
    selectedYear, 
    JSON.stringify(selectedLevels)
  ]);
};
