
import { useSelectionData } from "@/hooks/useSelectionData";
import { findMultiCountryBrands } from "./commonBrandsFinder";
import { getFallbackBrands } from "./fallbackBrands";
import { 
  groupBrandsByNormalizedName, 
  getPreferredBrandNames,
  ensureImportantBrands
} from "./brandNormalization";

export const useBrandDiscovery = (
  selectedCountries: string[],
  selectedIndustries: string[] = []
) => {
  // Get all brands from all selected countries
  const { brands: availableBrands } = useSelectionData(
    selectedCountries.length > 0 ? selectedCountries : "",
    selectedIndustries
  );
  
  // Get brands that appear in at least some of the selected countries
  const getCommonBrands = () => {
    return findMultiCountryBrands(selectedCountries, availableBrands);
  };
  
  // Get unique brand names from filtered list, prioritizing capitalized versions
  const getNormalizedUniqueBrands = () => {
    const commonBrands = getCommonBrands();
    
    // Check if we need to use fallback brands
    const fallbackBrands = getFallbackBrands(commonBrands.length, selectedCountries.length);
    if (fallbackBrands) {
      return fallbackBrands;
    }
    
    // Group all brand variants by normalized name
    const normalizedBrands = groupBrandsByNormalizedName(commonBrands);
    
    // Get preferred display name for each normalized brand
    const preferredBrandNames = getPreferredBrandNames(normalizedBrands);
    
    // Make sure to include important brands if they were not included
    const finalBrandNames = ensureImportantBrands(preferredBrandNames, availableBrands, selectedCountries);
    
    console.log("Final preferred brand names:", finalBrandNames);
    return finalBrandNames;
  };

  return {
    availableBrands,
    commonBrands: getCommonBrands(),
    uniqueBrandNames: getNormalizedUniqueBrands()
  };
};
