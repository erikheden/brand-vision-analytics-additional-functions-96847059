
import { useMemo } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';

export const useProcessedTrendData = (
  countriesData: Record<string, KnowledgeData[]>,
  selectedCountries: string[],
  selectedTerms: string[]
) => {
  // Colors for different countries and terms
  const COUNTRY_COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89'
  ];
  
  const TERM_PATTERNS = [
    'solid', 'dashed', 'dotted', 'dashdot'
  ];
  
  const chartData = useMemo(() => {
    if (!countriesData || Object.keys(countriesData).length === 0) return [];
    
    // Get all years from all countries
    const allYears = new Set<number>();
    Object.values(countriesData).forEach(countryData => {
      countryData.forEach(item => {
        if (selectedTerms.includes(item.term)) {
          allYears.add(item.year);
        }
      });
    });
    
    // Sort years
    const sortedYears = Array.from(allYears).sort((a, b) => a - b);
    
    // Create data points for each year
    return sortedYears.map(year => {
      const yearData: Record<string, any> = { year };
      
      // Add data for each country and term combination
      selectedCountries.forEach(country => {
        const countryData = countriesData[country] || [];
        
        selectedTerms.forEach(term => {
          const termData = countryData.find(
            item => item.term === term && item.year === year
          );
          
          // Convert from decimal (0-1) to percentage (0-100) if needed
          const percentage = termData 
            ? (typeof termData.percentage === 'number' 
                ? Math.round(termData.percentage * 100) 
                : 0)
            : null;
          
          // Store as country-term combination
          yearData[`${country}-${term}`] = percentage;
        });
      });
      
      return yearData;
    });
  }, [countriesData, selectedCountries, selectedTerms]);

  // Create all possible combinations of country-term for the lines
  const lineConfigs = useMemo(() => {
    return selectedCountries.flatMap(country => 
      selectedTerms.map(term => ({
        dataKey: `${country}-${term}`,
        country,
        term
      }))
    );
  }, [selectedCountries, selectedTerms]);

  return { 
    chartData, 
    lineConfigs, 
    COUNTRY_COLORS, 
    TERM_PATTERNS 
  };
};
