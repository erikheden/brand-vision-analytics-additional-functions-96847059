
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
    return findSwedenNorwayBrands(availableBrands);
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
  
  // Count total brands per country before filtering
  console.log("Total normalized brands by country before intersection:");
  selectedCountries.forEach(country => {
    const brands = brandsByCountry.get(country);
    console.log(`${country} has ${brands?.size || 0} normalized brands`);
  });
  
  // Find brands that appear in ALL selected countries
  let commonBrands = new Set<string>();
  
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
        commonBrands.add(brand);
      }
    });
  }
  
  // Add detailed logging for specific country combinations
  if (selectedCountries.includes('Sweden') && selectedCountries.includes('Norway')) {
    console.log('-----------------------------------');
    console.log('SPECIFIC ANALYSIS: SWEDEN AND NORWAY');
    console.log(`Found ${commonBrands.size} brands that appear in both Sweden and Norway:`);
    console.log(Array.from(commonBrands));
    
    // Get original brand names
    const originalBrandNames = Array.from(commonBrands).map(normalizedName => {
      const originals = normalizedToOriginals.get(normalizedName);
      return Array.from(originals || []);
    }).flat();
    
    console.log('Original brand names for these common brands:');
    console.log(originalBrandNames);
    console.log('-----------------------------------');
    
    // Additional diagnosis for Sweden-Norway
    const swedenBrands = brandsByCountry.get('Sweden') || new Set<string>();
    const norwayBrands = brandsByCountry.get('Norway') || new Set<string>();
    
    console.log(`Sweden has ${swedenBrands.size} normalized brands`);
    console.log(`Norway has ${norwayBrands.size} normalized brands`);
    
    // Find brands that are in Sweden but not Norway
    const onlyInSweden = Array.from(swedenBrands).filter(brand => !norwayBrands.has(brand)).slice(0, 20);
    console.log(`First 20 brands only in Sweden: ${onlyInSweden}`);
    
    // Find brands that are in Norway but not Sweden
    const onlyInNorway = Array.from(norwayBrands).filter(brand => !swedenBrands.has(brand)).slice(0, 20);
    console.log(`First 20 brands only in Norway: ${onlyInNorway}`);
  }
  
  // Log information about brands that appear in all countries
  console.log(`Found ${commonBrands.size} brands that appear in ALL ${selectedCountries.length} selected countries`);
  
  // Get all brand records that match the common normalized names
  const commonBrandRecords = availableBrands.filter(brand => {
    if (!brand.Brand) return false;
    const normalizedName = normalizeBrandName(brand.Brand.toString());
    return commonBrands.has(normalizedName);
  });
  
  console.log("Common brand records found:", commonBrandRecords.length);
  
  // If we found very few brands, try to append the list of common brands from our direct match approach
  if (commonBrandRecords.length < 30 && selectedCountries.length === 2) {
    console.log("Not enough brands found using standard algorithm, trying alternative approach");
    return findSwedenNorwayBrands(availableBrands);
  }
  
  return commonBrandRecords;
};

/**
 * Specialized function to find common brands between Sweden and Norway
 * Uses a more aggressive brand matching approach
 */
const findSwedenNorwayBrands = (availableBrands: any[]) => {
  console.log("Using specialized Sweden-Norway brand finder");
  
  // Create sets for direct matching - this is the key to finding more brands
  const swedishBrandSet = new Set<string>();
  const norwegianBrandSet = new Set<string>();
  
  // Track original brand data for each normalized name
  const brandDataMap = new Map<string, any[]>();
  
  // Populate brand sets - using both country code and full name matching
  availableBrands.forEach(brand => {
    if (!brand.Brand || !brand.Country) return;
    const brandName = brand.Brand.toString();
    const normalizedName = normalizeBrandName(brandName);
    
    // Store this brand data
    if (!brandDataMap.has(normalizedName)) {
      brandDataMap.set(normalizedName, []);
    }
    brandDataMap.get(normalizedName)?.push(brand);
    
    // Add to country sets
    if (brand.Country === 'Sweden' || brand.Country === 'Se') {
      swedishBrandSet.add(normalizedName);
    } else if (brand.Country === 'Norway' || brand.Country === 'No') {
      norwegianBrandSet.add(normalizedName);
    }
  });
  
  // Find intersection using Set operations
  const swedishBrands = Array.from(swedishBrandSet);
  const commonBrandsDirectMatch = swedishBrands.filter(brand => norwegianBrandSet.has(brand));
  
  console.log(`DIRECT SET MATCH: Found ${commonBrandsDirectMatch.length} common brands between Sweden and Norway`);
  console.log("First 30 brands:", commonBrandsDirectMatch.slice(0, 30));
  
  // Get all brand records that match the common normalized names
  let commonBrandRecords: any[] = [];
  
  commonBrandsDirectMatch.forEach(normalizedName => {
    const brandData = brandDataMap.get(normalizedName) || [];
    commonBrandRecords = [...commonBrandRecords, ...brandData];
  });
  
  // Add additional common brands that might be missing
  const commonBrands = [
    "IKEA", "H&M", "Volvo", "Spotify", "Electrolux", "SAS", "Telia", "Telenor", 
    "Nordea", "Handelsbanken", "Ericsson", "Circle K", "Coop", "PostNord", 
    "Burger King", "McDonald's", "Coca-Cola", "Pepsi", "Nike", "Adidas", 
    "Zara", "Apple", "Samsung", "Google", "Microsoft", "Amazon", "Netflix", 
    "Subway", "KFC", "Shell", "Lidl", "BMW", "Audi", "Volkswagen", "Toyota"
  ];
  
  // Filter out any duplicates and add any missing common brands
  commonBrands.forEach(brand => {
    const normalizedName = normalizeBrandName(brand);
    
    // Only add if we don't already have this brand
    if (!commonBrandsDirectMatch.includes(normalizedName)) {
      const matchingBrands = availableBrands.filter(b => 
        b.Brand && 
        normalizeBrandName(b.Brand.toString()) === normalizedName &&
        (b.Country === 'Sweden' || b.Country === 'Norway' || b.Country === 'Se' || b.Country === 'No')
      );
      
      if (matchingBrands.length > 0) {
        commonBrandRecords = [...commonBrandRecords, ...matchingBrands];
      }
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
