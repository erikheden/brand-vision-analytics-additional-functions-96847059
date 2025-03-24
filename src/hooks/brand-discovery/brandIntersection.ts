import { normalizeBrandName } from "@/utils/industry/brandNormalization";

/**
 * Finds the brand intersection (brands that appear in ALL selected countries)
 */
export const findBrandIntersection = (
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[]
): Set<string> => {
  // If no countries are selected, return empty set
  if (selectedCountries.length === 0) {
    return new Set();
  }
  
  // If only one country is selected, return all its brands
  if (selectedCountries.length === 1) {
    return brandNamesByCountry.get(selectedCountries[0]) || new Set();
  }
  
  // Start with the brand set of the first country
  const firstCountry = selectedCountries[0];
  const firstCountryBrands = brandNamesByCountry.get(firstCountry) || new Set();
  const commonBrands = new Set([...firstCountryBrands]);
  
  // For every other country, keep only the brands that appear in that country too
  for (let i = 1; i < selectedCountries.length; i++) {
    const country = selectedCountries[i];
    const countryBrands = brandNamesByCountry.get(country) || new Set();
    
    // Keep only the brands that exist in both sets
    for (const brand of commonBrands) {
      if (!countryBrands.has(brand)) {
        commonBrands.delete(brand);
      }
    }
  }
  
  console.log(`Found ${commonBrands.size} brands that exist in ALL ${selectedCountries.length} countries`);
  
  return commonBrands;
};

/**
 * Finds brands that appear in at least 2 countries, but not necessarily all
 */
export const findBrandsInMultipleCountries = (
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[]
): string[] => {
  // Create a map to count country occurrences for each normalized brand name
  const brandCountryCount: Map<string, Set<string>> = new Map();
  
  // Count in how many countries each brand appears
  selectedCountries.forEach(country => {
    const brandSet = brandNamesByCountry.get(country) || new Set();
    
    brandSet.forEach(brand => {
      if (!brandCountryCount.has(brand)) {
        brandCountryCount.set(brand, new Set());
      }
      brandCountryCount.get(brand)?.add(country);
    });
  });
  
  // Filter to brands that appear in at least 2 countries
  const multiCountryBrands: string[] = [];
  
  brandCountryCount.forEach((countries, brand) => {
    if (countries.size >= 2) {
      multiCountryBrands.push(brand);
    }
  });
  
  console.log(`Found ${multiCountryBrands.length} brands that exist in at least 2 out of ${selectedCountries.length} countries`);
  
  return multiCountryBrands;
};
