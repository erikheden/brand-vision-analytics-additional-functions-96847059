
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
  
  // Log detailed information about brands in each country
  console.log("Detailed brands by country:");
  selectedCountries.forEach(country => {
    const brands = brandsByCountry.get(country);
    console.log(`${country} has ${brands?.size || 0} normalized brands`);
    if (brands && brands.size > 0) {
      console.log(`Sample brands in ${country}:`, Array.from(brands).slice(0, 10));
    }
  });
  
  // Find brands that appear in ALL selected countries
  const commonBrands = new Set<string>();
  
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
  return commonBrandRecords;
};
