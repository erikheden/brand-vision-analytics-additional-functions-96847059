
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';

/**
 * Creates plot options for the topic trends chart
 */
export const createPlotOptions = () => {
  return {
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4
        },
        lineWidth: 2
      }
    },
    legend: {
      enabled: true,
      itemStyle: {
        fontFamily: FONT_FAMILY,
        color: '#34502b'
      }
    },
    credits: {
      enabled: false
    }
  };
};
