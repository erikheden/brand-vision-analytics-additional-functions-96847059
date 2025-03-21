
import { useMemo } from 'react';
import { calculateIndustryAverages } from '@/utils/industry';

/**
 * Hook to calculate selection averages from the selected brands data
 */
export const useIndustryAverages = (marketData: any[]) => {
  // Calculate selection averages using only the selected brands in the dataset
  return useMemo(() => {
    console.log("Calculating selection averages based on selected brands");
    return calculateIndustryAverages(marketData);
  }, [marketData]);  // Only depend on marketData array
};
