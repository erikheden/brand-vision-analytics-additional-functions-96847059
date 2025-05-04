
import { useImpactCategories } from './useImpactCategories';

export const useImpactData = (selectedCountries: string[]) => {
  // Reuse existing logic from useImpactCategories
  const {
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    countryDataMap
  } = useImpactCategories(selectedCountries);
  
  return {
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    countryDataMap
  };
};
