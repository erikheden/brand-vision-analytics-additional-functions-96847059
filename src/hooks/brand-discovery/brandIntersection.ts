
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
  
  // Improved debugging: Log all brands that appear in multiple countries, not just a sample
  if (result.length > 0) {
    console.log(`Found ${result.length} brands that appear in at least ${minCountryCount} countries:`);
    console.log("All common brands:", result);
    
    // For each brand, log which countries it appears in
    result.forEach(brand => {
      const countriesWithBrand = selectedCountries.filter(country => 
        brandNamesByCountry.get(country)?.has(brand) || false
      );
      console.log(`${brand} appears in: ${countriesWithBrand.join(', ')}`);
    });
  } else {
    console.log(`No brands found that appear in at least ${minCountryCount} countries`);
    
    // Log some diagnostic information to help understand why no matches were found
    console.log("Checking for potential near-matches...");
    
    // Look for brands that appear in at least one country
    const singleCountryBrands = Array.from(allBrandNames).filter(brand => 
      (brandCountryCount.get(brand) || 0) >= 1
    );
    
    // Sample some of these brands for debugging
    const sampleBrands = singleCountryBrands.slice(0, 20);
    console.log(`Sample of brands that appear in at least one country: ${sampleBrands.join(', ')}`);
    
    // Check for special brands like "Strawberry" that might need different normalization
    const specialBrandCases = ["Strawberry", "McDonald's", "Coca-Cola", "Nordic Choice", "Clarion Hotel"];
    specialBrandCases.forEach(specialBrand => {
      console.log(`Checking for special brand: ${specialBrand}`);
      const normalizedSpecial = normalizeBrandName(specialBrand);
      
      selectedCountries.forEach(country => {
        const countryBrands = brandNamesByCountry.get(country) || new Set<string>();
        const hasSpecialBrand = Array.from(countryBrands).some(brand => 
          normalizeBrandName(brand) === normalizedSpecial
        );
        console.log(`- ${specialBrand} in ${country}: ${hasSpecialBrand}`);
      });
    });
  }
  
  return result;
};
