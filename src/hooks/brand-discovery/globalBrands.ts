import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

/**
 * Adds well-known global brands that should be available in all countries
 * Only adds brands that actually exist in the data for at least one of the selected countries
 */
export const addWellKnownGlobalBrands = (
  uniqueRecords: Map<string, any>,
  selectedCountries: string[],
  availableBrands: any[],
  forceAddAll: boolean = false
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
  
  console.log(`Adding ${wellKnownBrands.length} known common brands as fallback`);
  let addedCount = 0;
  
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
    
    if (alreadyExists && !forceAddAll) continue;
    
    // Check if this brand exists in at least one of the selected countries
    for (const country of selectedCountries) {
      const matchingBrands = availableBrands.filter(b => 
        b.Country === country && 
        b.Brand && 
        normalizeBrandName(b.Brand.toString()) === normalizedBrand
      );
      
      if (matchingBrands.length > 0) {
        // If forceAddAll is true, add this brand for all countries where it exists
        // Otherwise, check if it exists in all selected countries
        let shouldAdd = forceAddAll;
        
        if (!forceAddAll) {
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
          
          shouldAdd = existsInAllCountries;
        }
        
        // Add one record for each country
        if (shouldAdd) {
          addedCount++;
          for (const addCountry of selectedCountries) {
            const countryBrands = availableBrands.filter(b => 
              b.Country === addCountry && 
              b.Brand && 
              normalizeBrandName(b.Brand.toString()) === normalizedBrand
            );
            
            if (countryBrands.length > 0) {
              // Find the record with the highest score
              const bestRecord = countryBrands.reduce((best, current) => {
                return (current.Score && best.Score && current.Score > best.Score) ? current : best;
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
  
  console.log(`Added ${addedCount} brands from the global list`);
  console.log(`Final brand count: ${uniqueRecords.size} records`);
  
  return Array.from(uniqueRecords.values());
};
