
import { useMemo } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';

export const useProcessedComparisonData = (
  countriesData: Record<string, KnowledgeData[]>,
  selectedCountries: string[],
  selectedTerms: string[],
  selectedYear: number
) => {
  // Colors for different countries
  const COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', 
    '#257179', '#328a94', '#3fa3ae', '#4dbcc9', '#66c7d2'
  ];
  
  const chartData = useMemo(() => {
    if (!countriesData || selectedTerms.length === 0) return [];
    
    // Create data for the selected terms across all countries
    return selectedTerms.map(term => {
      const termData: Record<string, any> = { term };
      
      selectedCountries.forEach(country => {
        const countryData = countriesData[country] || [];
        const yearData = countryData.find(
          item => item.term === term && item.year === selectedYear
        );
        
        // Convert from decimal (0-1) to percentage (0-100) if needed
        const percentage = yearData 
          ? (typeof yearData.percentage === 'number' 
              ? Math.round(yearData.percentage * 100) 
              : 0)
          : 0;
        
        termData[country] = percentage;
      });
      
      return termData;
    });
  }, [countriesData, selectedCountries, selectedTerms, selectedYear]);

  return { chartData, COLORS };
};
