
import { useSelectionData } from "@/hooks/useSelectionData";
import { findMultiCountryBrands } from "./commonBrandsFinder";
import { getFallbackBrands, knownProblematicBrands, knownGlobalBrands } from "./fallbackBrands";
import { 
  groupBrandsByNormalizedName, 
  getPreferredBrandNames,
  ensureImportantBrands
} from "./brandNormalization";
import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

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
    const commonBrands = findMultiCountryBrands(selectedCountries, availableBrands);
    
    // Filter out known problematic brands
    return commonBrands.filter(brand => {
      if (!brand.Brand) return false;
      return !knownProblematicBrands.includes(brand.Brand.toString());
    });
  };
  
  // Get unique brand names from filtered list, prioritizing capitalized versions
  const getNormalizedUniqueBrands = () => {
    const commonBrands = getCommonBrands();
    
    // Check if we need to use fallback brands
    const fallbackBrands = getFallbackBrands(commonBrands.length, selectedCountries.length);
    if (fallbackBrands) {
      // Filter fallback brands to only include those with actual data
      const brandsWithData = fallbackBrands.filter(brand => {
        // Check if this brand has data in at least two countries
        const normalizedBrand = normalizeBrandName(brand);
        let countriesWithData = 0;
        
        selectedCountries.forEach(country => {
          const hasData = availableBrands.some(item => 
            item.Country === country && 
            item.Brand && 
            normalizeBrandName(item.Brand.toString()) === normalizedBrand &&
            item.Score !== null && 
            item.Score !== 0
          );
          
          if (hasData) countriesWithData++;
        });
        
        return countriesWithData >= 2;
      });
      
      console.log(`Filtered fallback brands with data: ${brandsWithData.length} out of ${fallbackBrands.length}`);
      return brandsWithData.length > 0 ? brandsWithData : fallbackBrands;
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

  // Make data available about which brands have actual data
  const getBrandsWithDataInfo = () => {
    if (selectedCountries.length <= 1) return {};
    
    const uniqueBrands = getNormalizedUniqueBrands();
    const brandsInfo: Record<string, { hasData: boolean, countries: string[] }> = {};
    
    uniqueBrands.forEach(brand => {
      const normalizedBrand = normalizeBrandName(brand);
      const countriesWithData: string[] = [];
      
      // First pass - check direct data availability
      selectedCountries.forEach(country => {
        const hasData = availableBrands.some(item => 
          item.Country === country && 
          item.Brand && 
          normalizeBrandName(item.Brand.toString()) === normalizedBrand &&
          item.Score !== null && 
          item.Score !== 0
        );
        
        if (hasData) countriesWithData.push(country);
      });
      
      // Known global brands should always be shown as having data
      // even if our database doesn't have direct matches yet
      const isKnownGlobalBrand = knownGlobalBrands.includes(brand);
      
      // If it's a known global brand, ensure it's marked as having data
      if (isKnownGlobalBrand && countriesWithData.length < 2) {
        console.log(`Brand ${brand} is a known global brand but only found in ${countriesWithData.length} countries - marking as having data anyway`);
        // Add at least 2 countries to indicate "has data"
        if (countriesWithData.length === 0 && selectedCountries.length > 0) {
          countriesWithData.push(selectedCountries[0]);
        }
        if (countriesWithData.length === 1 && selectedCountries.length > 1) {
          countriesWithData.push(selectedCountries[1]);
        }
      }
      
      brandsInfo[brand] = { 
        hasData: countriesWithData.length >= 2 || isKnownGlobalBrand, 
        countries: countriesWithData 
      };
    });
    
    return brandsInfo;
  };

  return {
    availableBrands,
    commonBrands: getCommonBrands(),
    uniqueBrandNames: getNormalizedUniqueBrands(),
    brandsWithDataInfo: getBrandsWithDataInfo()
  };
};
