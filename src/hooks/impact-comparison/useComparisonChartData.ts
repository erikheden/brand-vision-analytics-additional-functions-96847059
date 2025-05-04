
import { useMemo } from 'react';
import { FONT_FAMILY } from '@/utils/constants';
import { getFullCountryName } from '@/components/CountrySelect';

export const useComparisonChartData = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategory: string,
  selectedImpactLevel: string,
  selectedYear: number | null,
  selectedCategories: string[],
  impactLevels: string[],
  activeCountries: string[],
  countryDataMap?: Record<string, any>
) => {
  // Create category comparison chart options
  const createCategoryChart = useMemo(() => {
    if (!selectedYear || !selectedImpactLevel || selectedCategories.length === 0 || activeCountries.length < 2) {
      return { series: [] };
    }
    
    // Create series for each country
    const series = activeCountries.map(country => {
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData || {};
      
      // Map each selected category to its value for this country and impact level
      const data = selectedCategories.map(category => {
        let value = 0;
        
        // Try to get value from country-specific data first
        if (countrySpecificData[category]?.[selectedYear]?.[selectedImpactLevel] !== undefined) {
          value = countrySpecificData[category][selectedYear][selectedImpactLevel];
        } 
        // Fall back to default processedData if specific data is not available
        else if (processedData[category]?.[selectedYear]?.[selectedImpactLevel] !== undefined) {
          value = processedData[category][selectedYear][selectedImpactLevel];
        }
        
        return value * 100; // Convert to percentage for display
      });
      
      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
    
    return {
      chart: {
        type: 'column',
        backgroundColor: 'white',
        style: { fontFamily: FONT_FAMILY }
      },
      title: {
        text: `${selectedImpactLevel} Impact Level Across Categories (${selectedYear})`,
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      subtitle: {
        text: `Comparing ${activeCountries.length} countries`,
        style: { color: '#666', fontFamily: FONT_FAMILY }
      },
      xAxis: {
        categories: selectedCategories,
        title: { text: 'Categories' },
        labels: {
          rotation: -45,
          style: { fontSize: '11px', fontFamily: FONT_FAMILY }
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage (%)',
          style: { color: '#34502b', fontFamily: FONT_FAMILY }
        },
        labels: { format: '{value}%' }
      },
      legend: {
        enabled: true,
        itemStyle: { fontFamily: FONT_FAMILY }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y:.1f}%',
        shared: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series,
      credits: { enabled: false }
    };
  }, [
    selectedYear, 
    selectedImpactLevel,
    selectedCategories.join(','), // Use join to create a dependency string
    activeCountries.join(','),   // Use join to create a dependency string 
    processedData, 
    countryDataMap
  ]);
  
  // Create impact level comparison chart options
  const createImpactLevelChart = useMemo(() => {
    if (!selectedYear || !selectedCategory || impactLevels.length === 0 || activeCountries.length < 2) {
      return { series: [] };
    }
    
    // Create series for each country
    const series = activeCountries.map(country => {
      // Use country-specific data from the map if available
      const countrySpecificData = countryDataMap?.[country]?.processedData || {};
      
      // Map each impact level to its value for this country and selected category
      const data = impactLevels.map(level => {
        let value = 0;
        
        // Try to get value from country-specific data first
        if (countrySpecificData[selectedCategory]?.[selectedYear]?.[level] !== undefined) {
          value = countrySpecificData[selectedCategory][selectedYear][level];
        }
        // Fall back to default processedData if specific data is not available
        else if (processedData[selectedCategory]?.[selectedYear]?.[level] !== undefined) {
          value = processedData[selectedCategory][selectedYear][level];
        }
        
        return value * 100; // Convert to percentage for display
      });
      
      return {
        name: getFullCountryName(country),
        data,
        type: 'column' as const
      };
    });
    
    return {
      chart: {
        type: 'column',
        backgroundColor: 'white',
        style: { fontFamily: FONT_FAMILY }
      },
      title: {
        text: `${selectedCategory} - Impact Levels Comparison (${selectedYear})`,
        style: { color: '#34502b', fontFamily: FONT_FAMILY }
      },
      subtitle: {
        text: `Comparing ${activeCountries.length} countries`,
        style: { color: '#666', fontFamily: FONT_FAMILY }
      },
      xAxis: {
        categories: impactLevels,
        title: { text: 'Impact Levels' }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percentage (%)',
          style: { color: '#34502b', fontFamily: FONT_FAMILY }
        },
        labels: { format: '{value}%' }
      },
      legend: {
        enabled: true,
        itemStyle: { fontFamily: FONT_FAMILY }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y:.1f}%',
        shared: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series,
      credits: { enabled: false }
    };
  }, [
    selectedYear, 
    selectedCategory,
    impactLevels.join(','), // Use join to create a dependency string
    activeCountries.join(','),   // Use join to create a dependency string
    processedData, 
    countryDataMap
  ]);
  
  return {
    createCategoryChart,
    createImpactLevelChart
  };
};
