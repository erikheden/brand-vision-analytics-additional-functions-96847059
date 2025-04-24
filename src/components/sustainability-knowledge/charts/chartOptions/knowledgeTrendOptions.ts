
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

export const createKnowledgeTrendChartOptions = (
  data: any,
  selectedTerms: string[],
  selectedCountries: string[]
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
        
        series.push({
          type: 'line',
          name: `${getFullCountryName(country)} - ${term}`,
          data: termData.map(d => [d.year, Math.round(d.percentage * 100)]),
          color,
          dashStyle: dashStyle as Highcharts.DashStyleValue
        });
      }
    });
  });

  return {
    chart: {
      type: 'line',
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
      }
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
      }
    },
    tooltip: {
      shared: true,
      formatter: function() {
        if (!this.points) return '';
        
        let html = `<b>Year: ${this.x}</b><br/>`;
        this.points.forEach(point => {
          const [country, term] = (point.series.name as string).split(' - ');
          html += `<span style="color: ${point.color}">\u25CF</span> ${country} - ${term}: <b>${point.y?.toFixed(1)}%</b><br/>`;
        });
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
