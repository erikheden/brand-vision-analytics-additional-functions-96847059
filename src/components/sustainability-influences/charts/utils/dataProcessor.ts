
import { InfluenceData } from '@/hooks/sustainability-influences';
import { getFullCountryName } from '@/components/CountrySelect';
import { getCountryColor } from './chartUtils';
import { SeriesOptionsType } from 'highcharts';

/**
 * Process data for the multi-country chart
 */
export function processChartData(
  data: Record<string, InfluenceData[]>,
  selectedYear: number,
  countries: string[]
) {
  console.log(`Processing chart data for year ${selectedYear} and ${countries.length} countries`);
  
  // Filter data for the selected year
  const filteredData: Record<string, InfluenceData[]> = {};
  const allInfluenceTypes = new Set<string>();
  
  countries.forEach(country => {
    const countryData = data[country] || [];
    const yearData = countryData.filter(item => item.year === selectedYear);
    
    filteredData[country] = yearData;
    
    // Collect all unique influence types
    yearData.forEach(item => {
      if (item.english_label_short) {
        allInfluenceTypes.add(item.english_label_short);
      }
    });
  });
  
  // Calculate average value for each influence type across countries
  const typeAverages: Record<string, number> = {};
  
  Array.from(allInfluenceTypes).forEach(type => {
    let sum = 0;
    let count = 0;
    
    countries.forEach(country => {
      const countryData = filteredData[country] || [];
      const typeData = countryData.find(item => item.english_label_short === type);
      
      if (typeData && typeof typeData.percentage === 'number') {
        sum += typeData.percentage * 100; // Convert to percentage
        count++;
      }
    });
    
    typeAverages[type] = count > 0 ? sum / count : 0;
  });
  
  // Sort influence types by average value (high to low)
  const sortedTypes = Array.from(allInfluenceTypes).sort((a, b) => typeAverages[b] - typeAverages[a]);
  
  // Create series for each country
  const series: SeriesOptionsType[] = countries.map(country => {
    const countryData = filteredData[country] || [];
    
    // Assign a color based on country code
    const countryColor = getCountryColor(country);
    
    const seriesData = sortedTypes.map(type => {
      const typeData = countryData.find(item => item.english_label_short === type);
      return typeData ? typeData.percentage * 100 : 0; // Convert to percentage
    });
    
    console.log(`Series data for ${country}: ${seriesData.length} points`);
    
    return {
      name: getFullCountryName(country),
      type: 'column',
      data: seriesData,
      color: countryColor,
      id: `${country}-${selectedYear}` // Add stable ID for the series
    };
  });
  
  return { influenceTypes: sortedTypes, series };
}
