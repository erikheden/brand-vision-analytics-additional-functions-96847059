
import { useSelectionData } from "@/hooks/useSelectionData";
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
  
  // Get brands that appear in all selected countries using normalized comparison
  const getCommonBrands = () => {
    if (selectedCountries.length <= 0) {
      return [];
    }
    
    if (selectedCountries.length === 1) {
      return availableBrands;
    }
    
    // Create a map of normalized brand names per country
    const brandsByCountry = new Map<string, Set<string>>();
    
    // Initialize sets for each country
    selectedCountries.forEach(country => {
      brandsByCountry.set(country, new Set<string>());
    });
    
    // For each brand, add its normalized name to the appropriate country set
    availableBrands.forEach(brand => {
      if (!brand.Brand || !brand.Country) return;
      
      const country = brand.Country;
      if (selectedCountries.includes(country)) {
        const normalizedName = normalizeBrandName(brand.Brand);
        brandsByCountry.get(country)?.add(normalizedName);
      }
    });
    
    // Log debug information
    console.log("Brands by country:", Array.from(brandsByCountry.entries()).map(([country, brands]) => ({
      country,
      brandCount: brands.size,
      sampleBrands: Array.from(brands).slice(0, 5)
    })));
    
    // Find brands that appear in all selected countries
    let commonNormalizedBrands: Set<string> | null = null;
    
    // Iterate through each country's brand set
    for (const [country, brandSet] of brandsByCountry.entries()) {
      if (!commonNormalizedBrands) {
        // First country - start with all its brands
        commonNormalizedBrands = new Set(brandSet);
      } else {
        // Subsequent countries - keep only brands that exist in both sets
        const intersection = new Set<string>();
        for (const brand of commonNormalizedBrands) {
          if (brandSet.has(brand)) {
            intersection.add(brand);
          }
        }
        commonNormalizedBrands = intersection;
      }
    }
    
    console.log("Normalized common brands:", Array.from(commonNormalizedBrands || []));
    
    // Get all brand records that match the common normalized names
    const commonBrandRecords = availableBrands.filter(brand => {
      if (!brand.Brand) return false;
      const normalizedName = normalizeBrandName(brand.Brand);
      return commonNormalizedBrands?.has(normalizedName);
    });
    
    console.log("Common brands found:", commonBrandRecords.length);
    return commonBrandRecords;
  };
  
  // Get unique brand names from filtered list, prioritizing capitalized versions
  const getNormalizedUniqueBrands = () => {
    const commonBrands = getCommonBrands();
    const brandMap = new Map<string, string>();
    
    commonBrands.forEach(brand => {
      if (!brand.Brand) return;
      
      const normalizedName = normalizeBrandName(brand.Brand);
      
      // If we haven't seen this normalized brand yet, or the current name is capitalized
      // and the stored one isn't, update the map
      if (!brandMap.has(normalizedName) || 
          (brand.Brand.charAt(0) === brand.Brand.charAt(0).toUpperCase() && 
           brandMap.get(normalizedName)?.charAt(0) !== brandMap.get(normalizedName)?.charAt(0)?.toUpperCase())) {
        brandMap.set(normalizedName, brand.Brand);
      }
    });
    
    return Array.from(brandMap.values()).sort();
  };

  return {
    availableBrands,
    commonBrands: getCommonBrands(),
    uniqueBrandNames: getNormalizedUniqueBrands()
  };
};
