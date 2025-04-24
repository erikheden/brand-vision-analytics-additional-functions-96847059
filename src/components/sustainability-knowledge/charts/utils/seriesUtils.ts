
import { getFullCountryName } from '@/components/CountrySelect';
import { ChartSeriesData, TermData } from '../types/chartTypes';

export const calculateYearOverYearChange = (current: number, previous: number): number => {
  return previous !== 0 ? (current - previous) / previous : 0;
};

export const createSeriesData = (
  data: Record<string, TermData[]>,
  selectedTerms: string[],
  selectedCountries: string[]
): Highcharts.SeriesOptionsType[] => {
  const series: Highcharts.SeriesOptionsType[] = [];
  
  selectedCountries.forEach((country, countryIndex) => {
    const countryData = data[country] || [];
    
    selectedTerms.forEach((term, termIndex) => {
      const termData = countryData
        .filter(item => item.term === term)
        .sort((a, b) => a.year - b.year);
      
      if (termData.length > 0) {
        const colorIntensity = 0.9 - (countryIndex * 0.15) - (termIndex * 0.05);
        const color = `rgba(52, 80, 43, ${Math.max(0.3, colorIntensity)})`;
        const dashStyle = countryIndex % 2 === 0 ? 'Solid' : 'Dash';
        
        const chartData = termData.map((d, idx, arr) => {
          const change = idx > 0 ? calculateYearOverYearChange(d.percentage, arr[idx-1].percentage) : 0;
          
          return {
            x: d.year,
            y: Math.round(d.percentage * 100),
            change: change !== 0 ? (change * 100).toFixed(1) : null
          };
        });

        const seriesObj: Highcharts.SeriesOptionsType = {
          type: 'line',
          name: `${getFullCountryName(country)} - ${term}`,
          data: chartData,
          color,
          dashStyle: dashStyle as Highcharts.DashStyleValue
        };
        
        series.push(seriesObj);
      }
    });
  });

  return series;
};
