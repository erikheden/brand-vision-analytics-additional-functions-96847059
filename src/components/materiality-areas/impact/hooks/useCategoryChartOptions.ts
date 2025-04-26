
import { useMemo } from 'react';
import { FONT_FAMILY } from '@/utils/constants';

export const useCategoryChartOptions = (
  data: Array<{ name: string; value: number; category: string }>,
  selectedYear: number | null,
  selectedLevels: string[]
) => {
  return useMemo(() => ({
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
      categories: [...new Set(data.map(item => item.name))],
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
    series: selectedLevels.map(level => ({
      name: level,
      data: data
        .filter(item => item.category === level)
        .map(item => item.value)
    })),
    credits: {
      enabled: false
    }
  }), [data, selectedYear, selectedLevels]);
};
