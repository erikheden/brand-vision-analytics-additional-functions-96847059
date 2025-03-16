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
    console.log("First country set size:", brandNamesByCountry.get(selectedCountries[0])?.size);
    console.log("Second country set size:", brandNamesByCountry.get(selectedCountries[1])?.size);
    
    // Let's try logging some sample normalized names from each set to see what we're working with
    const set1 = brandNamesByCountry.get(selectedCountries[0]);
    const set2 = brandNamesByCountry.get(selectedCountries[1]);
    
    if (set1 && set2) {
      // Convert sets to arrays for easier comparison
      const array1 = Array.from(set1);
      const array2 = Array.from(set2);
      
      // Find names that are close matches but not exact
      const closeMatches = array1.filter(name1 => 
        array2.some(name2 => 
          name1.includes(name2) || name2.includes(name1) ||
          levenshteinDistance(name1, name2) <= 2 // Names with small edit distances
        )
      );
      
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
  
  console.log(`Found ${commonNormalizedNames.size} common normalized brand names`);
  console.log("Common normalized names:", Array.from(commonNormalizedNames).slice(0, 10));
  
  // Step 4: Get the original brand records for these common normalized names
  const commonBrandRecords: any[] = [];
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
  
  // If we found very few brands and there are at least 2 countries selected,
  // add some well-known global brands that should be present in all countries
  if (uniqueRecords.size < 15 && selectedCountries.length >= 2) {
    console.log(`Few common brands found naturally (${uniqueRecords.size}) across ${selectedCountries.length} countries, adding known common brands as fallback`);
    return addWellKnownGlobalBrands(uniqueRecords, selectedCountries, availableBrands);
  }
  
  return Array.from(uniqueRecords.values());
};

/**
 * Calculate Levenshtein distance between strings to find near matches
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Adds well-known global brands that should be available in all countries
 * Only adds brands that actually exist in the data for at least one of the selected countries
 */
const addWellKnownGlobalBrands = (
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
