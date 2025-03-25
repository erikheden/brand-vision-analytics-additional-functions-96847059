import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { findCloseMatches } from "./brandMatching";

/**
 * Find the intersection of brand names across multiple countries
 */
export function findBrandIntersection(
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[]
): Set<string> | null {
  let intersectionBrands: Set<string> | null = null;
  
  selectedCountries.forEach(country => {
    const countryBrands = brandNamesByCountry.get(country);
    
    if (!countryBrands) return;
    
    if (intersectionBrands === null) {
      // First country - start with all its brands
      intersectionBrands = new Set(countryBrands);
    } else {
      // Subsequent countries - keep only brands that exist in both sets
      intersectionBrands = new Set(
        [...intersectionBrands].filter(brand => countryBrands.has(brand))
      );
    }
  });
  
  if (!intersectionBrands || intersectionBrands.size === 0) {
    console.log("No common brands found across selected countries");
    
    if (selectedCountries.length >= 2) {
      console.log("First country set size:", brandNamesByCountry.get(selectedCountries[0])?.size);
      console.log("Second country set size:", brandNamesByCountry.get(selectedCountries[1])?.size);
      
      // Log potential close matches for debugging
      const set1 = brandNamesByCountry.get(selectedCountries[0]);
      const set2 = brandNamesByCountry.get(selectedCountries[1]);
      
      if (set1 && set2) {
        // Find names that are close matches but not exact
        const closeMatches = findCloseMatches(set1, set2);
        console.log("Potential close matches that didn't intersect:", closeMatches.slice(0, 10));
      }
    }
    
    return null;
  }
  
  return intersectionBrands;
}

/**
 * Find brands that exist in at least N countries (default: 2)
 */
export function findBrandsInMultipleCountries(
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[],
  minCountries: number = 2
): string[] {
  const allNormalizedNames = new Set<string>();
  const brandCountries = new Map<string, Set<string>>();
  
  // Collect all normalized brand names across all countries
  selectedCountries.forEach(country => {
    const countryBrands = brandNamesByCountry.get(country);
    if (countryBrands) {
      countryBrands.forEach(brand => {
        allNormalizedNames.add(brand);
        
        // Track which countries each brand appears in
        if (!brandCountries.has(brand)) {
          brandCountries.set(brand, new Set());
        }
        brandCountries.get(brand)?.add(country);
      });
    }
  });
  
  // Filter to only include brands that appear in at least minCountries countries
  const multiCountryBrands = Array.from(allNormalizedNames)
    .filter(brand => (brandCountries.get(brand)?.size || 0) >= minCountries);
  
  console.log(`Found ${multiCountryBrands.length} brands that exist in at least ${minCountries} of the selected countries`);
  
  return multiCountryBrands;
}
