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
        fontFamily
      }
    },
    gridLineWidth: 1,
    gridLineDashStyle: 'Dot'
  },
  yAxis: {
    title: {
      text: undefined
    },
    labels: {
      style: {
        fontFamily
      }
    },
    gridLineWidth: 1,
    gridLineDashStyle: 'Dot'
  },
  legend: {
    itemStyle: {
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