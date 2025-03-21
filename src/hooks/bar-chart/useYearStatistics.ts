
import { useMemo } from 'react';
import { BrandData } from "@/types/brand";
import { calculateYearStatistics } from "@/utils/statistics/yearStatistics";

/**
 * Hook to calculate statistical information for each country-year combination
 * Use this hook in React components where you need to derive statistics from country data
 * @param allCountriesData Data grouped by country with brand scores
 * @returns A nested map of country -> year -> stats object with mean, stdDev, and count
 */
export const useYearStatistics = (allCountriesData: Record<string, BrandData[]>) => {
  return useMemo(() => {
    return calculateYearStatistics(allCountriesData);
  }, [allCountriesData]);
};

export default useYearStatistics;
