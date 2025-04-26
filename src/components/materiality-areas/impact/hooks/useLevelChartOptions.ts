
import { useMemo } from 'react';
import { FONT_FAMILY } from '@/utils/constants';

export const useLevelChartOptions = (
  data: Array<{ name: string; value: number; category: string }>,
  selectedYear: number | null
) => {
  return useMemo(() => {
    // Log to confirm when this is recalculated
    console.log('Recalculating level chart options');
    
    // Map data to pie chart format with stable structure
    const seriesData = data.map((item, index) => ({
      name: item.name,
      y: item.value,
      color: `rgba(52, 80, 43, ${0.9 - (index * 0.2)})`,
      dataLabels: {
        enabled: true
      }
    }));

    return {
      chart: {
        type: 'pie',
        backgroundColor: 'white',
        style: {
          fontFamily: FONT_FAMILY
        },
        events: {
          load: function() {
            console.log('Level chart loaded successfully');
          }
        }
      },
      title: {
        text: selectedYear ? `Impact Level Distribution (${selectedYear})` : 'Impact Level Distribution',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      series: [{
        name: 'Impact Levels',
        colorByPoint: true,
        data: seriesData
      }],
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      credits: {
        enabled: false
      }
    };
  }, [
    // Use stable stringification for data comparison
    JSON.stringify(data),
    selectedYear
  ]);
};
