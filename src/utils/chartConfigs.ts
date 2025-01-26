import Highcharts from 'highcharts';

export const createChartOptions = (fontFamily: string): Partial<Highcharts.Options> => ({
  chart: {
    type: 'line',
    style: {
      fontFamily
    },
    backgroundColor: 'transparent'
  },
  title: {
    text: undefined
  },
  xAxis: {
    type: 'linear',
    title: {
      text: undefined
    },
    labels: {
      style: {
        color: '#ffffff',
        fontFamily
      }
    },
    gridLineWidth: 1,
    gridLineDashStyle: 'Dot',
    gridLineColor: 'rgba(255, 255, 255, 0.2)', // Increased opacity for better visibility
    lineColor: '#ffffff'
  },
  yAxis: {
    title: {
      text: undefined
    },
    labels: {
      style: {
        color: '#ffffff',
        fontFamily
      }
    },
    gridLineWidth: 1,
    gridLineDashStyle: 'Dot',
    gridLineColor: 'rgba(255, 255, 255, 0.2)' // Increased opacity for better visibility
  },
  legend: {
    itemStyle: {
      color: '#ffffff',
      fontFamily
    }
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    line: {
      connectNulls: true
    },
    series: {
      animation: {
        duration: 1000
      }
    }
  }
});