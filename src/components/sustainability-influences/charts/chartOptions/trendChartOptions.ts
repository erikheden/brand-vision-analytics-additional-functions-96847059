
import Highcharts from 'highcharts';
import { InfluenceData } from '@/hooks/sustainability-influences';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';
import { getDynamicPercentageAxisDomain, getDynamicTickInterval } from '@/utils/charts/axisUtils';

export const createTrendChartOptions = (
  data: Record<string, InfluenceData[]>,
  selectedInfluences: string[],
  countries: string[]
): Highcharts.Options => {
  const chartSeries = createTrendChartSeries(data, selectedInfluences, countries);
  
  // Extract all percentage values to calculate the y-axis domain
  const allPercentages: number[] = [];
  chartSeries.forEach(series => {
    // Check if it's a line series with data array
    if (series.type === 'line' && Array.isArray(series.data)) {
      (series.data as any[]).forEach(point => {
        if (Array.isArray(point) && point.length > 1 && typeof point[1] === 'number') {
          allPercentages.push(point[1]);
        }
      });
    }
  });
  
  // Calculate dynamic y-axis domain
  const [yMin, yMax] = getDynamicPercentageAxisDomain(allPercentages);
  const tickInterval = getDynamicTickInterval(yMax);
  
  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      },
      height: 500,
      spacingBottom: 20,
      spacingTop: 20,
      spacingLeft: 20,
      spacingRight: 20
    },
    title: {
      text: 'Sustainability Influences Trends',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    subtitle: {
      text: countries.length === 1 
        ? getFullCountryName(countries[0]) 
        : `Comparing ${countries.length} countries`,
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
      type: 'category',
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    yAxis: {
      // Dynamic axis configuration
      min: yMin,
      max: yMax,
      tickInterval: tickInterval,
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
      formatter: function () {
        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y?.toFixed(1)}%`;
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
    series: chartSeries,
    credits: {
      enabled: false
    },
    legend: {
      enabled: true,
      itemStyle: {
        fontFamily: FONT_FAMILY,
        color: '#34502b'
      },
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    }
  };

  return options;
};

export const createTrendChartSeries = (
  data: Record<string, InfluenceData[]>,
  selectedInfluences: string[],
  countries: string[]
): Highcharts.SeriesLineOptions[] => { // Specify the exact series type here
  if (!data || Object.keys(data).length === 0 || 
      countries.length === 0 || selectedInfluences.length === 0) {
    return [];
  }

  const series: Highcharts.SeriesLineOptions[] = []; // Use the specific series type
  
  // Define colors to ensure visual distinction
  const baseColors = [
    '#34502b', '#4e7441', '#689857', '#81bc6d', 
    '#257179', '#328a94', '#3fa3ae', '#4dbcc9'
  ];
  
  // For each country and each selected influence, create a series
  countries.forEach((country, countryIndex) => {
    const countryData = data[country] || [];
    
    selectedInfluences.forEach((influence, influenceIndex) => {
      // Get data for this influence across all years
      const influenceData = countryData
        .filter(item => item.english_label_short === influence || item.medium === influence)
        .sort((a, b) => a.year - b.year);
      
      if (influenceData.length > 0) {
        // Format data for Highcharts - multiply by 100 to show as percentage
        const seriesData = influenceData.map(item => [
          item.year,
          Math.round(item.percentage * 100) // Convert from 0-1 to 0-100%
        ]);
        
        // Calculate color - cycle through colors by influence first, then by country
        const colorIndex = (influenceIndex * countries.length + countryIndex) % baseColors.length;
        const color = baseColors[colorIndex];
        
        // Use different dash styles per country for better distinction when colors repeat
        const dashStyles = ['Solid', 'Dash', 'DashDot', 'Dot'];
        const dashStyle = countries.length > 1 ? dashStyles[countryIndex % dashStyles.length] : 'Solid';
        
        series.push({
          type: 'line',
          name: `${getFullCountryName(country)} - ${influence}`,
          data: seriesData,
          color: color,
          dashStyle: dashStyle as Highcharts.DashStyleValue,
          marker: {
            enabled: true,
            symbol: 'circle'
          },
          lineWidth: 2
        });
      }
    });
  });
  
  return series;
};
