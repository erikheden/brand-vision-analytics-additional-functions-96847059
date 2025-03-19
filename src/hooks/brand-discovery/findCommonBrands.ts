import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { addWellKnownGlobalBrands } from "./globalBrands";
import { findCloseMatches } from "./brandMatching";

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
  
  // NEW APPROACH: Find brands that exist in ANY of the selected countries
  // This is more inclusive than requiring brands to exist in ALL countries
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
  
  // Filter to only include brands that appear in at least 2 countries
  const multiCountryBrands = Array.from(allNormalizedNames)
    .filter(brand => (brandCountries.get(brand)?.size || 0) >= 2);
  
  console.log(`Found ${multiCountryBrands.length} brands that exist in at least 2 of the selected countries`);
  
  // If we found very few common brands, fall back to the original intersection approach
  let intersectionBrands: Set<string> | null = null;
  
  if (multiCountryBrands.length < 10) {
    console.log("Falling back to original intersection approach");
    
    // Step 3: Find the intersection of brand names that appear in ALL selected countries
    intersectionBrands = null;
    
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
      console.log("First country set size:", brandNamesByCountry.get(selectedCountries[0])?.size);
      console.log("Second country set size:", brandNamesByCountry.get(selectedCountries[1])?.size);
      
      // Let's try logging some sample normalized names from each set to see what we're working with
      const set1 = brandNamesByCountry.get(selectedCountries[0]);
      const set2 = brandNamesByCountry.get(selectedCountries[1]);
      
      if (set1 && set2) {
        // Find names that are close matches but not exact
        const closeMatches = findCloseMatches(set1, set2);
        console.log("Potential close matches that didn't intersect:", closeMatches.slice(0, 10));
      }
      
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
  const uniqueRecords = new Map<string, any>();
  
  // For each common normalized brand name, find all matching brand records
  normalizedNamesToUse.forEach(normalizedName => {
    selectedCountries.forEach(country => {
      const countryRecords = brandRecordsByCountry.get(country)?.get(normalizedName) || [];
      
      if (countryRecords.length > 0) {
        // If multiple records exist for this brand in this country, use the one with highest score
        const bestRecord = countryRecords.reduce((best, current) => {
          return (!best.Score || (current.Score && current.Score > best.Score)) ? current : best;
        }, countryRecords[0]);
        
        const key = `${normalizedName}-${country}`;
        uniqueRecords.set(key, bestRecord);
      }
    });
  });
  
  // If we found very few brands and there are at least 2 countries selected,
  // add some well-known global brands that should be present in all countries
  if (uniqueRecords.size < 15 && selectedCountries.length >= 2) {
    console.log(`Few common brands found naturally (${uniqueRecords.size}) across ${selectedCountries.length} countries, adding known common brands as fallback`);
    return addWellKnownGlobalBrands(uniqueRecords, selectedCountries, availableBrands);
  }
  
  console.log(`Found ${uniqueRecords.size} unique brand records across countries`);
  return Array.from(uniqueRecords.values());
};

/**
 * Gets unique brand records for common normalized brand names
 */
function getUniqueBrandRecords(
  commonNormalizedNames: Set<string>,
  selectedCountries: string[],
  brandRecordsByCountry: Map<string, Map<string, any[]>>
): Map<string, any> {
  const uniqueRecords = new Map<string, any>();
  
  // For each common normalized brand name, find all matching brand records
  Array.from(commonNormalizedNames).forEach(normalizedName => {
    selectedCountries.forEach(country => {
      const countryRecords = brandRecordsByCountry.get(country)?.get(normalizedName) || [];
      
      if (countryRecords.length > 0) {
        // If multiple records exist for this brand in this country, use the one with highest score
        const bestRecord = countryRecords.reduce((best, current) => {
          return (!best.Score || (current.Score && current.Score > best.Score)) ? current : best;
        }, countryRecords[0]);
        
        const key = `${normalizedName}-${country}`;
        uniqueRecords.set(key, bestRecord);
      }
    });
  });
  
  console.log(`Found ${uniqueRecords.size} unique brand records across countries`);
  return uniqueRecords;
}
