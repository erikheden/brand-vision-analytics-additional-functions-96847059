
import { useMemo } from 'react';
import { calculateIndustryAverages } from '@/utils/industry';

/**
 * Hook to calculate industry averages from market data
 */
export const useIndustryAverages = (marketData: any[]) => {
  // Calculate industry averages using ALL brands, completely independent of selected brands
  // Using useMemo to prevent recalculation on every render
  return useMemo(() => {
    console.log("Recalculating industry averages with ALL brands");
    return calculateIndustryAverages(marketData);
  }, [marketData]);  // Only depend on marketData array
};
