import { FONT_FAMILY } from './constants';

export const createChartOptions = (fontFamily: string = FONT_FAMILY) => ({
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
    style: {
      color: '#ffffff',
      fontFamily,
    }
  },
  tooltip: {
    style: {
      fontFamily,
    }
  }
});

export const createBarChartOptions = (fontFamily: string = FONT_FAMILY) => ({
  ...createChartOptions(fontFamily),
  xAxis: {
    type: 'category',
    labels: {
      style: {
        color: '#ffffff',
        fontFamily,
      }
    },
    lineColor: '#ffffff',
    gridLineColor: 'rgba(255, 255, 255, 0.1)'
  },
  yAxis: {
    title: {
      text: 'Score',
      style: {
        color: '#ffffff',
        fontFamily,
      }
    },
    labels: {
      style: {
        color: '#ffffff',
        fontFamily,
      }
    },
    gridLineColor: 'rgba(255, 255, 255, 0.1)'
  },
  plotOptions: {
    column: {
      borderRadius: 5
    }
  }
});