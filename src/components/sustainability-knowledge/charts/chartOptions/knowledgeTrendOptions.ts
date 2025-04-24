
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

export const createKnowledgeTrendChartOptions = (
  data: any,
  selectedTerms: string[],
  selectedCountries: string[],
  chartType: 'line' | 'column' = 'line'
): Highcharts.Options => {
  // Create series data
  const series: Highcharts.SeriesOptionsType[] = [];
  
  selectedCountries.forEach((country, countryIndex) => {
    const countryData = data[country] || [];
    
    selectedTerms.forEach((term, termIndex) => {
      // Get data for this term across all years
      const termData = countryData
        .filter(item => item.term === term)
        .sort((a, b) => a.year - b.year);
      
      if (termData.length > 0) {
        // Calculate color with varying intensity
        const colorIntensity = 0.9 - (countryIndex * 0.15) - (termIndex * 0.05);
        const color = `rgba(52, 80, 43, ${Math.max(0.3, colorIntensity)})`;
        const dashStyle = countryIndex % 2 === 0 ? 'Solid' : 'Dash';
        
        // Calculate year-over-year change
        const chartData = termData.map((d, idx, arr) => {
          let change = 0;
          if (idx > 0) {
            change = (d.percentage - arr[idx-1].percentage) / arr[idx-1].percentage;
          }
          
          return {
            x: d.year,
            y: Math.round(d.percentage * 100),
            change: change !== 0 ? (change * 100).toFixed(1) : null
          };
        });

        const seriesObj: any = {
          type: chartType,
          name: `${getFullCountryName(country)} - ${term}`,
          color,
        };
        
        if (Array.isArray(chartData) && chartData.length > 0) {
          seriesObj.data = chartData;
        }
        
        if (chartType === 'line') {
          seriesObj.dashStyle = dashStyle as Highcharts.DashStyleValue;
        }
        
        series.push(seriesObj);
      }
    });
  });

  // Calculate the years range for nice x-axis display
  const years = new Set<number>();
  
  // Fixed: Use proper type checking and casting
  series.forEach((s: any) => {
    if (s.data && Array.isArray(s.data)) {
      s.data.forEach((point: any) => {
        if (typeof point === 'object' && point.x) {
          years.add(point.x);
        } else if (Array.isArray(point)) {
          years.add(point[0] as number);
        }
      });
    }
  });
  
  const minYear = years.size > 0 ? Math.min(...Array.from(years)) : new Date().getFullYear() - 5;
  const maxYear = years.size > 0 ? Math.max(...Array.from(years)) : new Date().getFullYear();

  return {
    chart: {
      type: chartType,
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500
    },
    title: {
      text: 'Sustainability Knowledge Trends',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    subtitle: {
      text: selectedCountries.length === 1 
        ? getFullCountryName(selectedCountries[0]) 
        : `Comparing ${selectedCountries.length} countries`,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      title: {
        text: 'Year',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      type: 'linear',
      min: minYear - 0.5,
      max: maxYear + 0.5,
      tickInterval: 1,
      startOnTick: false,
      endOnTick: false,
      gridLineWidth: chartType === 'column' ? 0 : 1
    },
    yAxis: {
      title: {
        text: 'Percentage',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        format: '{value}%',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineWidth: 1
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        if (!this.points) return '';
        
        let html = `<div style="font-family:${FONT_FAMILY}"><b>Year: ${this.x}</b><br/>`;
        this.points.forEach(point => {
          const [country, term] = (point.series.name as string).split(' - ');
          // Fixed: Access the custom properties from options
          const pointOptions = point.point.options as any;
          const change = pointOptions.change;
          
          html += `<span style="color: ${point.color}">\u25CF</span> ${country} - ${term}: <b>${point.y?.toFixed(1)}%</b>`;
          
          // Add year-over-year change if available
          if (change) {
            const changeValue = parseFloat(change);
            const changeIcon = changeValue > 0 ? '▲' : '▼';
            const changeColor = changeValue > 0 ? '#34502b' : '#ea4444';
            html += ` <span style="color:${changeColor}">${changeIcon} ${Math.abs(changeValue).toFixed(1)}%</span>`;
          }
          
          html += `<br/>`;
        });
        html += '</div>';
        
        return html;
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4
        },
        lineWidth: 2
      },
      column: {
        groupPadding: 0.1,
        pointPadding: 0.1,
        borderWidth: 0
      }
    },
    series,
    credits: {
      enabled: false
    },
    legend: {
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    }
  };
};
