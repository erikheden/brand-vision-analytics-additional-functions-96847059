
import { useSelectionData } from "@/hooks/useSelectionData";
import { findMultiCountryBrands } from "./findCommonBrands";
import { getFallbackBrands, knownProblematicBrands, knownGlobalBrands } from "./fallbackBrands";
import { 
  groupBrandsByNormalizedName, 
  getPreferredBrandNames,
  ensureImportantBrands,
  getSpecialBrandName
} from "./brandNormalization";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

export const useBrandDiscovery = (
  selectedCountries: string[],
  selectedIndustries: string[] = []
) => {
  // Get all brands from all selected countries
  const { brands: availableBrands } = useSelectionData(
    selectedCountries.length > 0 ? selectedCountries : "",
    selectedIndustries
  );
  
  // Get brands that appear in the selected countries
  const getCommonBrands = () => {
    console.log(`Getting common brands for ${selectedCountries.length} countries with ${availableBrands.length} available brands`);
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
    console.log(`Found ${commonBrands.length} common brands after filtering problematic ones`);
    
    // If we didn't find any brands at all, fallback to global brands
    if (commonBrands.length === 0) {
      const fallbackBrands = getFallbackBrands(commonBrands.length, selectedCountries.length);
      if (fallbackBrands) {
        // Filter fallback brands to only include those with actual data
        const brandsWithData = fallbackBrands.filter(brand => {
          // Check if this brand has data in at least one country
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
          
          return countriesWithData >= 1;
        });
        
        console.log(`Filtered fallback brands with data: ${brandsWithData.length} out of ${fallbackBrands.length}`);
        return brandsWithData.length > 0 ? brandsWithData : fallbackBrands;
      }
    }
    
    // Group all brand variants by normalized name
    const normalizedBrands = groupBrandsByNormalizedName(commonBrands);
    console.log(`Grouped into ${normalizedBrands.size} normalized brand groups`);
    
    // Get preferred display name for each normalized brand
    const preferredBrandNames = getPreferredBrandNames(normalizedBrands);
    
    // Make sure to include important brands if they were not included
    const finalBrandNames = ensureImportantBrands(preferredBrandNames, availableBrands, selectedCountries);
    
    console.log(`Final brand count: ${finalBrandNames.length}`);
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
      
      // First pass - check chart data availability
      // Look for actual data visualized in the chart
      selectedCountries.forEach(country => {
        // Check if brand has non-zero score data in this country
        const hasChartData = availableBrands.some(item => 
          item.Country === country && 
          item.Brand && 
          normalizeBrandName(item.Brand.toString()) === normalizedBrand &&
          item.Score !== null && 
          item.Score !== 0
        );
        
        if (hasChartData) countriesWithData.push(country);
      });
      
      // Known global brands should always be shown as having data
      const isKnownGlobalBrand = knownGlobalBrands.includes(brand);
      
      // If it's a known global brand but we found less than 2 countries with data,
      // still mark it as having data across all countries
      if (isKnownGlobalBrand && countriesWithData.length < 2) {
        // For global brands, consider it has data in all selected countries
        countriesWithData.length = 0; // Clear existing entries
        selectedCountries.forEach(country => countriesWithData.push(country));
      }
      
      // For comparison purposes, a brand needs data in at least 2 countries
      const hasChartData = countriesWithData.length >= 2;
      
      brandsInfo[brand] = { 
        hasData: hasChartData || isKnownGlobalBrand, 
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
