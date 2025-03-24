
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { knownGlobalBrands } from "./fallbackBrands";

/**
 * Adds well-known global brands to the results even if they weren't naturally found
 */
export const addWellKnownGlobalBrands = (
  uniqueRecords: Map<string, any>,
  selectedCountries: string[],
  availableBrands: any[],
  forceAdd: boolean = false
): any[] => {
  const knownBrands = knownGlobalBrands;
  
  if (!forceAdd && uniqueRecords.size >= 15) {
    // We already have enough brands, don't add more
    return Array.from(uniqueRecords.values());
  }
  
  // Loop through known global brands and ensure they're included
  knownBrands.forEach(globalBrand => {
    const normalizedGlobalBrand = normalizeBrandName(globalBrand);
    
    // Check if this global brand exists in our data for any country
    let brandExists = false;
    
    // First check if we already have it in our unique records
    if (Array.from(uniqueRecords.keys()).some(key => 
      normalizeBrandName(key) === normalizedGlobalBrand
    )) {
      brandExists = true;
    } else {
      // Check if it exists in our available brands for any selected country
      brandExists = availableBrands.some(item => 
        item.Brand && 
        normalizeBrandName(item.Brand.toString()) === normalizedGlobalBrand &&
        selectedCountries.includes(item.Country)
      );
    }
    
    // If it exists but we don't have it yet, add it
    if (brandExists && !uniqueRecords.has(globalBrand)) {
      console.log(`Adding global brand: ${globalBrand}`);
      
      // Find a sample record to use (any country is fine for now)
      const sampleRecord = availableBrands.find(item => 
        item.Brand && 
        normalizeBrandName(item.Brand.toString()) === normalizedGlobalBrand
      );
      
      if (sampleRecord) {
        // Create a modified record with the preferred brand name
        const modifiedRecord = {
          ...sampleRecord,
          Brand: globalBrand // Use the standard name
        };
        
        uniqueRecords.set(globalBrand, modifiedRecord);
      }
    }
  });
  
  // If we still don't have enough brands, force add some popular ones
  if (uniqueRecords.size < 5 && forceAdd) {
    const popularBrands = [
      "McDonald's", "Coca-Cola", "IKEA", "H&M", "Apple", 
      "Google", "Netflix", "Spotify", "Adidas", "Tesla",
      "Clarion Hotel", "Strawberry", "Scandic"
    ];
    
    for (const brand of popularBrands) {
      if (!uniqueRecords.has(brand)) {
        // Create a dummy record
        const dummyRecord = {
          Brand: brand,
          Score: null,
          Year: new Date().getFullYear(),
          ForceAdded: true
        };
        
        uniqueRecords.set(brand, dummyRecord);
        console.log(`Force adding popular brand: ${brand}`);
        
        // Stop after we've added enough
        if (uniqueRecords.size >= 10) break;
      }
    }
  }
  
  return Array.from(uniqueRecords.values());
};
