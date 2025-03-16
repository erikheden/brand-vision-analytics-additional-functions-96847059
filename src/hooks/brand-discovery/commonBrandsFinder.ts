import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

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
  
  // Initialize a set for each country
  selectedCountries.forEach(country => {
    brandNamesByCountry.set(country, new Set());
  });
  
  // Step 2: Fill the sets with normalized brand names from each country
  availableBrands.forEach(brand => {
    if (!brand.Brand || !brand.Country) return;
    
    const country = brand.Country;
    if (selectedCountries.includes(country)) {
      const normalizedBrandName = normalizeBrandName(brand.Brand.toString());
      brandNamesByCountry.get(country)?.add(normalizedBrandName);
    }
  });
  
  // Debug: Output number of brands per country
  selectedCountries.forEach(country => {
    const brandNames = brandNamesByCountry.get(country);
    console.log(`${country} has ${brandNames?.size || 0} normalized brands`);
    // Debug first 5 brand names for transparency
    if (brandNames && brandNames.size > 0) {
      console.log(`Sample brands from ${country}:`, Array.from(brandNames).slice(0, 5));
    }
  });
  
  // Step 3: Find the intersection of brand names that appear in ALL selected countries
  let commonNormalizedNames: Set<string> | null = null;
  
  selectedCountries.forEach(country => {
    const countryBrands = brandNamesByCountry.get(country);
    
    if (!countryBrands) return;
    
    if (commonNormalizedNames === null) {
      // First country - start with all its brands
      commonNormalizedNames = new Set(countryBrands);
    } else {
      // Subsequent countries - keep only brands that exist in both sets
      commonNormalizedNames = new Set(
        [...commonNormalizedNames].filter(brand => countryBrands.has(brand))
      );
    }
  });
  
  if (!commonNormalizedNames || commonNormalizedNames.size === 0) {
    console.log("No common brands found across selected countries");
    return [];
  }
  
  console.log(`Found ${commonNormalizedNames.size} common normalized brand names`);
  console.log("Common normalized names:", Array.from(commonNormalizedNames).slice(0, 10));
  
  // Step 4: Get the original brand records for these common normalized names
  const commonBrandRecords: any[] = [];
  
  // For each common normalized brand name, find all matching brand records
  Array.from(commonNormalizedNames).forEach(normalizedName => {
    selectedCountries.forEach(country => {
      const matchingBrands = availableBrands.filter(brand => 
        brand.Country === country && 
        brand.Brand && 
        normalizeBrandName(brand.Brand.toString()) === normalizedName
      );
      
      if (matchingBrands.length > 0) {
        // If multiple records exist for this brand in this country, use the one with highest score
        const bestRecord = matchingBrands.reduce((best, current) => {
          return (!best.Score || (current.Score && current.Score > best.Score)) ? current : best;
        }, matchingBrands[0]);
        
        commonBrandRecords.push(bestRecord);
      }
    });
  });
  
  // Step 5: Deduplicate to ensure one record per country per normalized brand name
  const uniqueRecords = new Map<string, any>();
  
  commonBrandRecords.forEach(record => {
    const normalizedName = normalizeBrandName(record.Brand.toString());
    const country = record.Country;
    const key = `${normalizedName}-${country}`;
    
    if (!uniqueRecords.has(key) || record.Score > uniqueRecords.get(key).Score) {
      uniqueRecords.set(key, record);
    }
  });
  
  console.log(`Final common brand records: ${uniqueRecords.size}`);
  
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
