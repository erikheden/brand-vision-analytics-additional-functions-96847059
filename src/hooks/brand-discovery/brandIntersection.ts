
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

/**
 * Finds the intersection of brand names across all selected countries
 */
export const findBrandIntersection = (
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[]
): string[] => {
  if (selectedCountries.length === 0) return [];
  
  // Start with all brands from the first country
  const firstCountry = selectedCountries[0];
  const firstCountryBrands = brandNamesByCountry.get(firstCountry) || new Set<string>();
  
  // Intersect with each subsequent country
  const commonBrands = new Set(firstCountryBrands);
  
  for (let i = 1; i < selectedCountries.length; i++) {
    const country = selectedCountries[i];
    const countryBrands = brandNamesByCountry.get(country) || new Set<string>();
    
    // Keep only brands that are in both sets
    for (const brand of commonBrands) {
      if (!countryBrands.has(brand)) {
        commonBrands.delete(brand);
      }
    }
  }
  
  return Array.from(commonBrands);
};

/**
 * Finds brands that appear in at least the specified number of countries
 * Improved to properly track brand occurrences across countries
 */
export const findBrandsInMultipleCountries = (
  brandNamesByCountry: Map<string, Set<string>>,
  selectedCountries: string[],
  minCountryCount: number
): string[] => {
  if (selectedCountries.length < minCountryCount) return [];
  
  // Count how many countries each brand appears in
  const brandCountryCount = new Map<string, number>();
  const allBrandNames = new Set<string>();
  
  // First collect all unique brand names across all countries
  selectedCountries.forEach(country => {
    const countryBrands = brandNamesByCountry.get(country) || new Set<string>();
    countryBrands.forEach(brand => allBrandNames.add(brand));
  });
  
  // Then count appearances for each brand
  allBrandNames.forEach(brand => {
    let count = 0;
    selectedCountries.forEach(country => {
      const countryBrands = brandNamesByCountry.get(country) || new Set<string>();
      if (countryBrands.has(brand)) {
        count++;
      }
    });
    brandCountryCount.set(brand, count);
  });
  
  // Filter brands that appear in at least minCountryCount countries
  const result = Array.from(allBrandNames).filter(brand => 
    (brandCountryCount.get(brand) || 0) >= minCountryCount
  );
  
  // Sort by frequency (most common first)
  result.sort((a, b) => 
    (brandCountryCount.get(b) || 0) - (brandCountryCount.get(a) || 0)
  );
  
  // Improved debugging: Log detailed information about brand matches
  if (result.length > 0) {
    console.log(`Found ${result.length} brands that appear in at least ${minCountryCount} countries:`);
    const sampleCounts = result.slice(0, 10).map(brand => 
      `${brand}: ${brandCountryCount.get(brand)} countries`
    );
    console.log("Sample brand country counts:", sampleCounts);
  } else {
    console.log(`No brands found that appear in at least ${minCountryCount} countries`);
  }
  
  return result;
};
