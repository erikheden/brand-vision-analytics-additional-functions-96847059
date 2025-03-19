
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { addWellKnownGlobalBrands } from "./globalBrands";
import { findBrandIntersection, findBrandsInMultipleCountries } from "./brandIntersection";
import { getUniqueBrandRecords } from "./brandRecords";

/**
 * Finds brands that appear in multiple countries
 */
export const findMultiCountryBrands = (selectedCountries: string[], availableBrands: any[]) => {
  // If no countries selected, return empty array
  if (selectedCountries.length <= 0) {
    return [];
  }
  
  // If only one country selected, return all its brands
  if (selectedCountries.length === 1) {
    return availableBrands.filter(brand => 
      brand.Country === selectedCountries[0] && brand.Brand
    );
  }
  
  console.log(`Finding common brands for ${selectedCountries.length} countries: ${selectedCountries.join(', ')}`);
  
  // Step 1: Create a map to collect all brand names by country (normalized)
  const brandNamesByCountry = new Map<string, Set<string>>();
  const brandRecordsByCountry = new Map<string, Map<string, any[]>>();
  
  // Initialize a set for each country
  selectedCountries.forEach(country => {
    brandNamesByCountry.set(country, new Set());
    brandRecordsByCountry.set(country, new Map());
  });
  
  // Step 2: Fill the sets with normalized brand names from each country
  // Also store the original records for later retrieval
  availableBrands.forEach(brand => {
    if (!brand.Brand || !brand.Country) return;
    
    const country = brand.Country;
    if (selectedCountries.includes(country)) {
      const normalizedBrandName = normalizeBrandName(brand.Brand.toString());
      
      // Add to the set of normalized brand names for this country
      brandNamesByCountry.get(country)?.add(normalizedBrandName);
      
      // Store the original record mapped by normalized name
      if (!brandRecordsByCountry.get(country)?.has(normalizedBrandName)) {
        brandRecordsByCountry.get(country)?.set(normalizedBrandName, []);
      }
      brandRecordsByCountry.get(country)?.get(normalizedBrandName)?.push(brand);
    }
  });
  
  // Debug: Output normalized brand names and record counts per country
  selectedCountries.forEach(country => {
    const brandNames = brandNamesByCountry.get(country);
    const recordCounts = Array.from(brandRecordsByCountry.get(country)?.entries() || [])
      .map(([name, records]) => `${name}: ${records.length}`);
    
    console.log(`${country} has ${brandNames?.size || 0} normalized brands`);
    
    // Debug first 5 brand names for transparency
    if (brandNames && brandNames.size > 0) {
      console.log(`Sample brands from ${country}:`, Array.from(brandNames).slice(0, 5));
      console.log(`Sample record counts from ${country}:`, recordCounts.slice(0, 5));
    }
  });
  
  // Find brands that exist in at least 2 countries
  const multiCountryBrands = findBrandsInMultipleCountries(brandNamesByCountry, selectedCountries);
  
  // If we found very few common brands, fall back to the original intersection approach
  let intersectionBrands: Set<string> | null = null;
  
  if (multiCountryBrands.length < 10) {
    console.log("Falling back to original intersection approach");
    
    // Find the intersection of brand names that appear in ALL selected countries
    intersectionBrands = findBrandIntersection(brandNamesByCountry, selectedCountries);
    
    if (!intersectionBrands || intersectionBrands.size === 0) {
      // No common brands found, add in well-known global brands
      return addWellKnownGlobalBrands(
        new Map<string, any>(),  // Start with empty map
        selectedCountries, 
        availableBrands,
        true // Force add brands from the global list even if none found naturally
      );
    }
  }
  
  // Use either multiCountryBrands (brands in 2+ countries) or intersectionBrands (brands in ALL countries)
  const normalizedNamesToUse = multiCountryBrands.length >= 10 ? multiCountryBrands : 
                              (intersectionBrands ? Array.from(intersectionBrands) : []);
  
  console.log(`Using ${normalizedNamesToUse.length} brand names`);
  
  // Step 4: Get the original brand records for these normalized names
  const uniqueRecords = getUniqueBrandRecords(normalizedNamesToUse, selectedCountries, brandRecordsByCountry);
  
  // If we found very few brands and there are at least 2 countries selected,
  // add some well-known global brands that should be present in all countries
  if (uniqueRecords.size < 15 && selectedCountries.length >= 2) {
    console.log(`Few common brands found naturally (${uniqueRecords.size}) across ${selectedCountries.length} countries, adding known common brands as fallback`);
    return addWellKnownGlobalBrands(uniqueRecords, selectedCountries, availableBrands);
  }
  
  console.log(`Found ${uniqueRecords.size} unique brand records across countries`);
  return Array.from(uniqueRecords.values());
};
