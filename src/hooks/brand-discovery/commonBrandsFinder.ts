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
  
  console.log(`Finding common brands for ${selectedCountries.length} countries: ${selectedCountries.join(', ')}`);
  
  // Create a map of normalized brand names per country
  const brandsByCountry = new Map<string, Set<string>>();
  
  // Initialize sets for each country
  selectedCountries.forEach(country => {
    brandsByCountry.set(country, new Set<string>());
  });
  
  // Create a map to track the original brand data for each normalized name and country
  const brandDataByCountry = new Map<string, Map<string, any[]>>();
  
  // Initialize brand data maps for each country
  selectedCountries.forEach(country => {
    brandDataByCountry.set(country, new Map<string, any[]>());
  });
  
  // For each brand, add its normalized name to the appropriate country set
  availableBrands.forEach(brand => {
    if (!brand.Brand || !brand.Country) return;
    
    const country = brand.Country;
    if (selectedCountries.includes(country)) {
      const brandName = brand.Brand.toString();
      const normalizedName = normalizeBrandName(brandName);
      
      // Add to country set
      brandsByCountry.get(country)?.add(normalizedName);
      
      // Store the original brand data
      const countryBrandData = brandDataByCountry.get(country);
      if (countryBrandData) {
        if (!countryBrandData.has(normalizedName)) {
          countryBrandData.set(normalizedName, []);
        }
        countryBrandData.get(normalizedName)?.push(brand);
      }
    }
  });
  
  // Count total brands per country before filtering
  console.log("Total normalized brands by country before intersection:");
  selectedCountries.forEach(country => {
    const brands = brandsByCountry.get(country);
    console.log(`${country} has ${brands?.size || 0} normalized brands`);
  });
  
  // Find brands that appear in ALL selected countries
  let commonNormalizedBrands = new Set<string>();
  
  if (selectedCountries.length > 0) {
    // Start with all brands from the first country
    const firstCountryBrands = brandsByCountry.get(selectedCountries[0]) || new Set<string>();
    
    // For each brand in the first country
    firstCountryBrands.forEach(brand => {
      // Check if it exists in all other countries
      let presentInAllCountries = true;
      
      for (let i = 1; i < selectedCountries.length; i++) {
        const countryBrands = brandsByCountry.get(selectedCountries[i]) || new Set<string>();
        if (!countryBrands.has(brand)) {
          presentInAllCountries = false;
          break;
        }
      }
      
      // If the brand is present in all countries, add it to the common brands set
      if (presentInAllCountries) {
        commonNormalizedBrands.add(brand);
      }
    });
  }
  
  console.log(`Found ${commonNormalizedBrands.size} normalized brands common to all ${selectedCountries.length} countries`);
  console.log("Common normalized brands:", Array.from(commonNormalizedBrands).slice(0, 10));
  
  // Get all brand records that match the common normalized names
  const commonBrandRecords: any[] = [];
  
  // For each country, get the brand records for the common brands
  selectedCountries.forEach(country => {
    const countryBrandData = brandDataByCountry.get(country);
    if (!countryBrandData) return;
    
    commonNormalizedBrands.forEach(normalizedName => {
      const brandRecords = countryBrandData.get(normalizedName) || [];
      if (brandRecords.length > 0) {
        commonBrandRecords.push(...brandRecords);
      }
    });
  });
  
  console.log(`Retrieved ${commonBrandRecords.length} total brand records for common brands`);
  
  // Remove duplicates (same normalized brand name across different countries)
  // Keep one record per brand per country
  const uniqueRecords = new Map<string, any>();
  
  commonBrandRecords.forEach(record => {
    const normalizedName = normalizeBrandName(record.Brand.toString());
    const country = record.Country;
    const key = `${normalizedName}-${country}`;
    
    // Choose the record with the highest score for each brand-country combination
    if (!uniqueRecords.has(key) || record.Score > uniqueRecords.get(key).Score) {
      uniqueRecords.set(key, record);
    }
  });
  
  console.log(`Final common brand records (deduplicated): ${uniqueRecords.size}`);
  
  // If we found very few brands and there are at least 2 countries selected,
  // add some well-known global brands that should be present in all countries
  if (uniqueRecords.size < 15 && selectedCountries.length >= 2) {
    console.log("Not enough common brands found, adding well-known global brands");
    addWellKnownGlobalBrands(uniqueRecords, selectedCountries, availableBrands);
  }
  
  return Array.from(uniqueRecords.values());
};

/**
 * Adds well-known global brands that should be available in all countries
 * Only adds brands that actually exist in the data for at least one of the selected countries
 */
const addWellKnownGlobalBrands = (
  uniqueRecords: Map<string, any>,
  selectedCountries: string[],
  availableBrands: any[]
) => {
  // List of well-known global brands that should be available in most countries
  const wellKnownBrands = [
    "IKEA", "H&M", "Volvo", "Spotify", "McDonald's", "Burger King", 
    "Coca-Cola", "Pepsi", "Nike", "Adidas", "Zara", "Apple", "Samsung", 
    "Google", "Microsoft", "Amazon", "Netflix", "Subway", "KFC", "Shell", 
    "Lidl", "BMW", "Audi", "Volkswagen", "Toyota", "SAS", "Finnair",
    "Norwegian", "Telenor", "Telia", "Spotify", "Electrolux", "Nordea",
    "Handelsbanken", "Circle K", "7-Eleven", "Coop", "ICA", "Kiwi", "Rema 1000"
  ];
  
  for (const brand of wellKnownBrands) {
    // Skip if we already have this brand
    const normalizedBrand = normalizeBrandName(brand);
    let alreadyExists = false;
    
    for (const [key, record] of uniqueRecords.entries()) {
      if (key.startsWith(`${normalizedBrand}-`)) {
        alreadyExists = true;
        break;
      }
    }
    
    if (alreadyExists) continue;
    
    // Check if this brand exists in at least one of the selected countries
    for (const country of selectedCountries) {
      const matchingBrands = availableBrands.filter(b => 
        b.Country === country && 
        b.Brand && 
        normalizeBrandName(b.Brand.toString()) === normalizedBrand
      );
      
      if (matchingBrands.length > 0) {
        // Check if this brand exists in all selected countries
        let existsInAllCountries = true;
        
        for (const checkCountry of selectedCountries) {
          const countryHasBrand = availableBrands.some(b => 
            b.Country === checkCountry && 
            b.Brand && 
            normalizeBrandName(b.Brand.toString()) === normalizedBrand
          );
          
          if (!countryHasBrand) {
            existsInAllCountries = false;
            break;
          }
        }
        
        // Only add if the brand exists in all selected countries
        if (existsInAllCountries) {
          // Add one record for each country
          for (const addCountry of selectedCountries) {
            const countryBrands = availableBrands.filter(b => 
              b.Country === addCountry && 
              b.Brand && 
              normalizeBrandName(b.Brand.toString()) === normalizedBrand
            );
            
            if (countryBrands.length > 0) {
              // Find the record with the highest score
              const bestRecord = countryBrands.reduce((best, current) => {
                return (current.Score > best.Score) ? current : best;
              }, countryBrands[0]);
              
              uniqueRecords.set(`${normalizedBrand}-${addCountry}`, bestRecord);
            }
          }
        }
        
        // Break the country loop as we've already found and processed this brand
        break;
      }
    }
  }
  
  console.log(`After adding well-known brands: ${uniqueRecords.size} records`);
};
