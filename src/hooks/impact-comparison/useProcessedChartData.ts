
import { useMemo } from 'react';
import { getFullCountryName } from '@/components/CountrySelect';

export const useProcessedChartData = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategory: string,
  selectedImpactLevel: string,
  selectedYear: number | null,
  selectedCategories: string[],
  impactLevels: string[],
  activeCountries: string[]
) => {
  const seriesData = useMemo(() => {
    return activeCountries.map(country => ({
      name: getFullCountryName(country),
      data: selectedCategories.map(category => {
        const countryData = processedData[category]?.[selectedYear]?.[selectedImpactLevel] || 0;
        return countryData * 100;
      }),
      type: 'column' as const
    }));
  }, [activeCountries, selectedCategories, processedData, selectedYear, selectedImpactLevel]);

  const impactLevelData = useMemo(() => {
    return activeCountries.map(country => ({
      name: getFullCountryName(country),
      data: impactLevels.map(level => {
        const countryData = processedData[selectedCategory]?.[selectedYear]?.[level] || 0;
        return countryData * 100;
      }),
      type: 'column' as const
    }));
  }, [activeCountries, impactLevels, processedData, selectedCategory, selectedYear]);

  return {
    seriesData,
    impactLevelData
  };
};
