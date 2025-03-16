
import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

/**
 * Finds brands that appear in multiple countries
 */
export const findMultiCountryBrands = (selectedCountries: string[], availableBrands: any[]) => {
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
  
  // Create a map to track the original brand names for each normalized name
  const normalizedToOriginals = new Map<string, Set<string>>();
  
  // For each brand, add its normalized name to the appropriate country set
  availableBrands.forEach(brand => {
    if (!brand.Brand || !brand.Country) return;
    
    const country = brand.Country;
    if (selectedCountries.includes(country)) {
      const brandName = brand.Brand.toString();
      const normalizedName = normalizeBrandName(brandName);
      
      // Add to country set
      brandsByCountry.get(country)?.add(normalizedName);
      
      // Track original brand name
      if (!normalizedToOriginals.has(normalizedName)) {
        normalizedToOriginals.set(normalizedName, new Set<string>());
      }
      normalizedToOriginals.get(normalizedName)?.add(brandName);
    }
  });
  
  // Log detailed information about brands in each country
  console.log("Detailed brands by country:");
  selectedCountries.forEach(country => {
    const brands = brandsByCountry.get(country);
    console.log(`${country} has ${brands?.size || 0} normalized brands`);
    if (brands && brands.size > 0) {
      console.log(`Sample brands in ${country}:`, Array.from(brands).slice(0, 10));
    }
  });
  
  // Find brands that appear in at least one country
  const brandCountryCount = new Map<string, number>();
  
  // Count country occurrences for each brand
  brandsByCountry.forEach((brandSet, country) => {
    brandSet.forEach(normalizedBrand => {
      const currentCount = brandCountryCount.get(normalizedBrand) || 0;
      brandCountryCount.set(normalizedBrand, currentCount + 1);
    });
  });
  
  // Log information about brands that appear in multiple countries
  console.log("Brands appearing in multiple countries:");
  brandCountryCount.forEach((count, brand) => {
    if (count >= 1) {
      console.log(`Brand "${brand}" appears in ${count}/${selectedCountries.length} countries`);
    }
  });
  
  // Include all brands that appear in at least one of the selected countries
  // This ensures we show ALL brands across the selected countries
  const multiCountryBrands = Array.from(brandCountryCount.entries())
    .filter(([_, count]) => count >= 1)  // Include all brands that appear in at least one country
    .map(([brand, _]) => brand);
  
  console.log(`Found ${multiCountryBrands.length} brands that appear in the selected countries`);
  
  // Get all brand records that match the multi-country normalized names
  const commonBrandRecords = availableBrands.filter(brand => {
    if (!brand.Brand) return false;
    const normalizedName = normalizeBrandName(brand.Brand.toString());
    return multiCountryBrands.includes(normalizedName);
  });
  
  console.log("Multi-country brand records found:", commonBrandRecords.length);
  return commonBrandRecords;
};
