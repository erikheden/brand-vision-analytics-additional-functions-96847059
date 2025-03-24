

import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { addWellKnownGlobalBrands } from "./globalBrands";
import { findBrandIntersection, findBrandsInMultipleCountries } from "./brandIntersection";
import { getUniqueBrandRecords } from "./brandRecords";

/**
 * Finds brands that appear in multiple countries
 * Enhanced to better handle brands across different countries
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
    // Check if this is one of our selected countries
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
    console.log(`${country} has ${brandNames?.size || 0} normalized brands`);
    
    // Check if Strawberry exists in this country's brands
    if (brandNames) {
      const hasStrawberry = Array.from(brandNames).some(name => name.toLowerCase() === 'strawberry');
      console.log(`${country} has Strawberry: ${hasStrawberry}`);
    }
    
    // Debug: Log a sample of brands from each country for verification
    if (brandNames && brandNames.size > 0) {
      const sampleBrands = Array.from(brandNames).slice(0, 5);
      console.log(`Sample brands from ${country}:`, sampleBrands);
    }
  });
  
  // Find brands that exist in at least 2 countries
  const multiCountryBrands = findBrandsInMultipleCountries(brandNamesByCountry, selectedCountries, 2);
  console.log(`Found ${multiCountryBrands.length} brands that appear in at least 2 countries`);
  
  if (multiCountryBrands.length > 0) {
    console.log("Sample common brands:", multiCountryBrands.slice(0, 10));
  }
  
  // Use multiCountryBrands to get original records
  const uniqueRecords = getUniqueBrandRecords(multiCountryBrands, selectedCountries, brandRecordsByCountry);
  
  // If we found very few brands and there are at least 2 countries selected,
  // add some well-known global brands that should be present in all countries
  if (uniqueRecords.size < 15 && selectedCountries.length >= 2) {
    console.log(`Few common brands found naturally (${uniqueRecords.size}) across ${selectedCountries.length} countries, adding known common brands as fallback`);
    return addWellKnownGlobalBrands(uniqueRecords, selectedCountries, availableBrands);
  }
  
  console.log(`Found ${uniqueRecords.size} unique brand records across countries`);
  return Array.from(uniqueRecords.values());
};

