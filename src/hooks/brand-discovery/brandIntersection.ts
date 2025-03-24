import { normalizeBrandName } from "@/utils/industry/brandNormalization";

/**
 * Utility functions for finding brands that exist across multiple countries
 */

/**
 * Finds the intersection of brand names that appear in ALL selected countries
 */
export const findBrandIntersection = (
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[]
): Set<string> => {
  if (selectedCountries.length === 0) {
    return new Set<string>();
  }
  
  // Start with the first country's brand names
  const firstCountry = selectedCountries[0];
  const firstCountryBrands = brandNamesByCountry.get(firstCountry) || new Set<string>();
  
  // Use a set to track the intersection
  const intersection = new Set<string>(firstCountryBrands);
  
  // For each additional country, keep only the brands that exist in both sets
  for (let i = 1; i < selectedCountries.length; i++) {
    const country = selectedCountries[i];
    const countryBrands = brandNamesByCountry.get(country) || new Set<string>();
    
    // Remove brands from intersection that don't exist in this country
    for (const brand of intersection) {
      if (!countryBrands.has(brand)) {
        intersection.delete(brand);
      }
    }
  }
  
  return intersection;
};

/**
 * Finds brands that exist in at least N countries (default: 2)
 * This is more flexible than a strict intersection and can find more common brands
 */
export const findBrandsInMultipleCountries = (
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[],
  minCountryCount: number = 2
): string[] => {
  if (selectedCountries.length < minCountryCount) {
    return [];
  }
  
  // Create a map to count brand appearances across countries
  const brandCountMap = new Map<string, number>();
  const brandCountries = new Map<string, string[]>();
  
  // Count how many countries each brand appears in
  selectedCountries.forEach(country => {
    const brands = brandNamesByCountry.get(country) || new Set<string>();
    
    brands.forEach(brand => {
      // Increment the count for this brand
      const currentCount = brandCountMap.get(brand) || 0;
      brandCountMap.set(brand, currentCount + 1);
      
      // Track which countries this brand appears in
      if (!brandCountries.has(brand)) {
        brandCountries.set(brand, []);
      }
      brandCountries.get(brand)?.push(country);
    });
  });
  
  // Filter for brands that appear in at least minCountryCount countries
  const multiCountryBrands = [...brandCountMap.entries()]
    .filter(([_, count]) => count >= minCountryCount)
    .map(([brand, _]) => brand);
  
  // Debug log to see brands and their counts
  multiCountryBrands.forEach(brand => {
    const count = brandCountMap.get(brand) || 0;
    const countries = brandCountries.get(brand) || [];
    console.log(`Brand "${brand}" appears in ${count} countries: ${countries.join(', ')}`);
  });
  
  return multiCountryBrands;
};
