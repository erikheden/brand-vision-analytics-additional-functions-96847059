
import { MaterialityData } from '@/hooks/useGeneralMaterialityData';
import { getFullCountryName } from '@/components/CountrySelect';

/**
 * Processes chart data for the country comparison bar chart
 */
export const processComparisonChartData = (
  allCountriesData: Record<string, MaterialityData[]>,
  selectedAreas: string[],
  selectedYear: number
) => {
  if (!allCountriesData || Object.keys(allCountriesData).length === 0) {
    console.log('No country data available for chart');
    return {};
  }

  // Debug log to see what data we're working with
  console.log('Raw allCountriesData structure:', Object.keys(allCountriesData));
  console.log('Selected year:', selectedYear);
  console.log('Selected areas:', selectedAreas);

  // Filter data for the selected year and areas
  const filteredData: Record<string, Record<string, number>> = {};
  
  Object.entries(allCountriesData).forEach(([country, data]) => {
    // Find data for the selected year
    const yearData = data.filter(item => item.year === selectedYear);
    
    console.log(`Country ${country} - yearData count for ${selectedYear}:`, yearData.length);
    
    if (yearData.length === 0) {
      console.log(`No data for country ${country} in year ${selectedYear}`);
    } else {
      console.log(`Sample data for country ${country}:`, yearData[0]);
    }
    
    // Filter for selected areas or use all if none selected
    const areasData = selectedAreas.length > 0 
      ? yearData.filter(item => selectedAreas.includes(item.materiality_area))
      : yearData;
    
    console.log(`Country ${country} - filtered areasData count:`, areasData.length);
    
    // Add data to filtered set
    if (areasData.length > 0) {
      filteredData[country] = {};
      areasData.forEach(area => {
        // Ensure percentage is properly converted to a number and multiplied by 100 for display
        let percentage: number;
        
        if (typeof area.percentage === 'number') {
          percentage = area.percentage * 100;
        } else if (typeof area.percentage === 'string') {
          percentage = parseFloat(area.percentage) * 100;
        } else {
          console.warn(`Invalid percentage for ${area.materiality_area}:`, area.percentage);
          percentage = 0;
        }
        
        console.log(`Area ${area.materiality_area} - raw percentage:`, area.percentage, 
                   `type: ${typeof area.percentage}, converted:`, percentage);
        
        filteredData[country][area.materiality_area] = percentage;
      });
    }
  });
  
  // Log the filtered data for debugging
  console.log('Filtered chart data:', filteredData);
  
  return filteredData;
};

/**
 * Gets all unique materiality areas from the chart data
 */
export const getUniqueAreas = (chartData: Record<string, Record<string, number>>) => {
  const areas = new Set<string>();
  Object.values(chartData).forEach(country => {
    Object.keys(country).forEach(area => areas.add(area));
  });
  return Array.from(areas);
};

/**
 * Calculates average value for each area across all countries
 */
export const calculateAreaAverages = (
  chartData: Record<string, Record<string, number>>, 
  allAreas: string[]
) => {
  const averages: Record<string, number> = {};
  const areaCounts: Record<string, number> = {};
  
  // Calculate sum and count for each area
  Object.values(chartData).forEach(countryData => {
    Object.entries(countryData).forEach(([area, value]) => {
      if (!averages[area]) {
        averages[area] = 0;
        areaCounts[area] = 0;
      }
      averages[area] += value;
      areaCounts[area]++;
    });
  });
  
  // Calculate average for each area
  Object.keys(averages).forEach(area => {
    averages[area] = averages[area] / areaCounts[area];
  });
  
  console.log('Area averages:', averages);
  return averages;
};

/**
 * Sorts areas by their average values in descending order
 */
export const sortAreasByAverage = (allAreas: string[], areaAverages: Record<string, number>) => {
  // Log initial data for debugging
  console.log('Before sorting - allAreas:', allAreas);
  console.log('Before sorting - areaAverages:', areaAverages);
  
  // Create a new array to avoid modifying the original
  const sortedAreas = [...allAreas].sort((a, b) => {
    // Get values for both areas, defaulting to 0 if undefined
    const valueA = areaAverages[a] || 0;
    const valueB = areaAverages[b] || 0;
    
    // Sort in descending order (highest first)
    const result = valueB - valueA;
    
    // Log comparison for debugging
    console.log(`Comparing ${a}(${valueA}) vs ${b}(${valueB}): result=${result}`);
    
    return result;
  });
  
  // Log the final sorted result for verification
  console.log('After sorting - sortedAreas:', sortedAreas);
  
  return sortedAreas;
};

/**
 * Prepares series data for Highcharts
 * Now updates to work with standard bar chart where categories are on x-axis
 */
export const prepareChartSeries = (
  chartData: Record<string, Record<string, number>>,
  sortedAreas: string[]
) => {
  // Log to ensure our sorted areas are correct
  console.log('prepareChartSeries - sortedAreas:', sortedAreas);
  
  const series = Object.entries(chartData).map(([country, data]) => {
    const seriesData = sortedAreas.map(area => {
      // For standard bar charts with categories on x-axis
      const value = data[area] || 0;
      return value;
    });
    
    console.log(`Series data for ${country}:`, seriesData);
    
    return {
      type: 'bar' as const,
      name: getFullCountryName(country),
      data: seriesData
    };
  });
  
  // Log prepared series for debugging
  console.log('Prepared series:', series.map(s => ({
    name: s.name,
    dataLength: s.data.length,
    sample: s.data.slice(0, 3)
  })));
  
  return series;
};
