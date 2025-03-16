
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
  
  // Special case for Sweden and Norway - we'll do direct matching first
  if (selectedCountries.includes('Sweden') && selectedCountries.includes('Norway') && selectedCountries.length === 2) {
    console.log("Using specialized Sweden-Norway matching");
    return findSpecificCountryBrands(selectedCountries, availableBrands);
  }
  
  // For all other country combinations, use the aggressive direct matching approach
  console.log(`Using aggressive brand matching for ${selectedCountries.join(', ')}`);
  return findSpecificCountryBrands(selectedCountries, availableBrands);
};

/**
 * Specialized function to find common brands between any set of countries
 * Uses an aggressive brand matching approach to find more common brands
 */
const findSpecificCountryBrands = (selectedCountries: string[], availableBrands: any[]) => {
  console.log(`Using aggressive brand finder for ${selectedCountries.join(', ')}`);
  
  // Create sets for each country
  const brandSetsByCountry = new Map<string, Set<string>>();
  
  // Initialize sets for each country
  selectedCountries.forEach(country => {
    brandSetsByCountry.set(country, new Set<string>());
  });
  
  // Track original brand data for each normalized name
  const brandDataMap = new Map<string, any[]>();
  
  // Populate brand sets for each country
  availableBrands.forEach(brand => {
    if (!brand.Brand || !brand.Country) return;
    const brandName = brand.Brand.toString();
    const normalizedName = normalizeBrandName(brandName);
    
    // Store this brand data
    if (!brandDataMap.has(normalizedName)) {
      brandDataMap.set(normalizedName, []);
    }
    brandDataMap.get(normalizedName)?.push(brand);
    
    // Add to the appropriate country set
    if (selectedCountries.includes(brand.Country)) {
      brandSetsByCountry.get(brand.Country)?.add(normalizedName);
    }
  });
  
  // Log total brands per country for debugging
  console.log("Total normalized brands by country:");
  selectedCountries.forEach(country => {
    const brands = brandSetsByCountry.get(country);
    console.log(`${country} has ${brands?.size || 0} normalized brands`);
  });
  
  // Find intersection of all country sets
  let commonBrandsSet: Set<string> | null = null;
  
  selectedCountries.forEach(country => {
    const countryBrands = brandSetsByCountry.get(country) || new Set<string>();
    
    if (commonBrandsSet === null) {
      // Initialize with the first country's brands
      commonBrandsSet = new Set(countryBrands);
    } else {
      // Find intersection with each subsequent country
      commonBrandsSet = new Set(
        [...commonBrandsSet].filter(brand => countryBrands.has(brand))
      );
    }
  });
  
  // Convert set to array for further processing
  const commonBrandsDirectMatch = commonBrandsSet ? [...commonBrandsSet] : [];
  
  console.log(`DIRECT SET MATCH: Found ${commonBrandsDirectMatch.length} common brands across ${selectedCountries.join(', ')}`);
  console.log("First 30 brands:", commonBrandsDirectMatch.slice(0, 30));
  
  // Get all brand records that match the common normalized names
  let commonBrandRecords: any[] = [];
  
  commonBrandsDirectMatch.forEach(normalizedName => {
    const brandData = brandDataMap.get(normalizedName) || [];
    commonBrandRecords = [...commonBrandRecords, ...brandData];
  });
  
  // Add additional common brands that might be missing
  // This comprehensive list includes brands that are likely to be present in multiple countries
  const commonBrands = [
    // Major international brands
    "IKEA", "H&M", "Volvo", "Spotify", "Electrolux", "SAS", "Telia", "Telenor", 
    "Nordea", "Handelsbanken", "Ericsson", "Circle K", "Coop", "PostNord", 
    "Burger King", "McDonald's", "Coca-Cola", "Pepsi", "Nike", "Adidas", 
    "Zara", "Apple", "Samsung", "Google", "Microsoft", "Amazon", "Netflix", 
    "Subway", "KFC", "Shell", "Lidl", "BMW", "Audi", "Volkswagen", "Toyota",
    
    // Additional brands from the user's list
    "7-Eleven", "Airbnb", "Air France", "Änglamark", "Apollo", "Best Western",
    "Bikbok", "Biltema", "Bring", "British Airways", "Byggmax", "Clarion Collection",
    "Clarion Hotel", "Clas Ohlson", "Comfort Hotel", "Cubus", "Danone", "Db Schenker",
    "Dove", "Dressmann", "Eldorado", "Elon", "Espresso House", "Fanta", "Findus",
    "Finnair", "Fiskars", "Fjällräven", "Fortum", "Gina Tricot", "If", "Intersport",
    "JACK & JONES", "Joe & the Juice", "Johnson & Johnson", "Jula", "JYSK", "Kappahl",
    "Kavli", "KICKS", "KLM", "Lantmännen", "Lego", "Lindex", "L'Oréal Paris", 
    "Lufthansa", "Lyko", "Magnum", "Miele", "Nelly.Com", "Nespresso", "Nestlé", 
    "NetOnNet", "Nissan", "Norwegian", "Orkla", "Polestar", "Power", 
    "Procter & Gamble", "P&G", "Puma", "Quality Hotel", "Radisson Blu", "Red Bull", 
    "Renault", "Rituals", "Rusta", "Santa Maria", "Santander", "Scandic", "Siemens", 
    "Škoda", "Sprite", "St1", "Stena Line", "Strawberry", "Tesla", "TUI", "Uber", 
    "Unilever", "Vero Moda", "Ving", "Wasa", "XXL", "Zalando"
  ];
  
  // Check if these common brands exist in ALL selected countries
  // This ensures we only add brands that truly exist in all selected countries
  const validCommonBrands = commonBrands.filter(brandName => {
    const normalizedName = normalizeBrandName(brandName);
    
    // Skip if we already have this brand
    if (commonBrandsDirectMatch.includes(normalizedName)) {
      return false;
    }
    
    // Check if the brand exists in all selected countries
    for (const country of selectedCountries) {
      const countryBrands = brandSetsByCountry.get(country) || new Set<string>();
      if (!countryBrands.has(normalizedName)) {
        // If not in any country, check direct matches in the data
        const existsInCountry = availableBrands.some(b => 
          b.Country === country && 
          b.Brand && 
          normalizeBrandName(b.Brand.toString()) === normalizedName
        );
        
        if (!existsInCountry) {
          return false; // Brand doesn't exist in this country
        }
      }
    }
    
    return true; // Brand exists in all selected countries
  });
  
  console.log(`Found ${validCommonBrands.length} additional valid common brands`);
  
  // Add records for the additional common brands
  validCommonBrands.forEach(brand => {
    const normalizedName = normalizeBrandName(brand);
    
    const matchingBrands = availableBrands.filter(b => 
      selectedCountries.includes(b.Country) &&
      b.Brand && 
      normalizeBrandName(b.Brand.toString()) === normalizedName
    );
    
    if (matchingBrands.length > 0) {
      commonBrandRecords = [...commonBrandRecords, ...matchingBrands];
    }
  });
  
  // Remove duplicate records
  const deduplicatedRecords = new Map();
  commonBrandRecords.forEach(record => {
    const key = `${record.Brand}-${record.Country}`;
    if (!deduplicatedRecords.has(key)) {
      deduplicatedRecords.set(key, record);
    }
  });
  
  console.log(`Final common brand records count: ${deduplicatedRecords.size}`);
  return Array.from(deduplicatedRecords.values());
};
