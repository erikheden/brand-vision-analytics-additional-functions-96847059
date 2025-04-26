
import { useMemo } from 'react';
import { FONT_FAMILY } from '@/utils/constants';

export const useLevelChartOptions = (
  data: Array<{ name: string; value: number; category: string }>,
  selectedYear: number | null
) => {
  return useMemo(() => ({
    chart: {
      type: 'pie',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: `Impact Level Distribution (${selectedYear})`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    series: [{
      name: 'Impact Levels',
      colorByPoint: true,
      data: data.map((item, index) => ({
        name: item.name,
        y: item.value,
        color: `rgba(52, 80, 43, ${0.9 - (index * 0.2)})`
      }))
    }],
    credits: {
      enabled: false
    }
  }), [data, selectedYear]);
};
