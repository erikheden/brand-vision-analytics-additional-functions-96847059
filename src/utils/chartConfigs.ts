
import { Options } from 'highcharts';
import { FONT_FAMILY } from './constants';

export const createChartOptions = (fontFamily: string = FONT_FAMILY): Options => ({
  chart: {
    style: {
      fontFamily,
    },
    backgroundColor: 'transparent',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: 'Brand Score Trends',
    style: {
      color: '#34502b',
      fontFamily,
    }
  },
  tooltip: {
    style: {
      fontFamily,
    }
  },
  xAxis: {
    type: 'linear',
    labels: {
      style: {
        color: '#34502b',
        fontFamily,
      }
    },
    lineColor: '#34502b',
    gridLineColor: 'rgba(52, 80, 43, 0.1)'
  },
  yAxis: {
    title: {
      text: 'Score',
      style: {
        color: '#34502b',
        fontFamily,
      }
    },
    labels: {
      style: {
        color: '#34502b',
        fontFamily,
      }
    },
    gridLineColor: 'rgba(52, 80, 43, 0.1)'
  },
  legend: {
    itemStyle: {
      color: '#34502b',
      fontFamily,
    }
  }
});

export const createBarChartOptions = (fontFamily: string = FONT_FAMILY): Options => ({
  ...createChartOptions(fontFamily),
  xAxis: {
    type: 'category',
    labels: {
      style: {
        color: '#34502b',
        fontFamily,
      }
    },
    lineColor: '#34502b',
    gridLineColor: 'rgba(52, 80, 43, 0.1)'
  },
  plotOptions: {
    column: {
      borderRadius: 5
    }
  }
});
