
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
  
  // Count total brands per country before filtering
  console.log("Total normalized brands by country before intersection:");
  selectedCountries.forEach(country => {
    const brands = brandsByCountry.get(country);
    console.log(`${country} has ${brands?.size || 0} normalized brands`);
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
  
  // If we're not finding enough brands, let's see what's in availableBrands
  if (commonBrandRecords.length < 100 && selectedCountries.includes('Sweden') && selectedCountries.includes('Norway')) {
    console.log("Available brands count:", availableBrands.length);
    console.log("First 20 available brands sample:");
    
    const brandSample = availableBrands
      .filter(b => b.Brand && b.Country)
      .slice(0, 20)
      .map(b => ({ brand: b.Brand, country: b.Country, normalized: normalizeBrandName(b.Brand.toString()) }));
    
    console.log(brandSample);
    
    // Let's try a direct matching approach to find why we're missing some brands
    const swedishBrandSet = new Set<string>();
    const norwegianBrandSet = new Set<string>();
    
    // Populate brand sets
    availableBrands.forEach(brand => {
      if (!brand.Brand || !brand.Country) return;
      const normalizedName = normalizeBrandName(brand.Brand.toString());
      
      if (brand.Country === 'Sweden') {
        swedishBrandSet.add(normalizedName);
      } else if (brand.Country === 'Norway') {
        norwegianBrandSet.add(normalizedName);
      }
    });
    
    // Find intersection using Set operations
    const swedishBrands = Array.from(swedishBrandSet);
    const commonBrandsDirectMatch = swedishBrands.filter(brand => norwegianBrandSet.has(brand));
    
    console.log(`DIRECT SET MATCH: Found ${commonBrandsDirectMatch.length} common brands between Sweden and Norway`);
    console.log("First 50 common brands from direct set matching:", commonBrandsDirectMatch.slice(0, 50));
    
    // Check data consistency
    if (commonBrandsDirectMatch.length > commonBrands.size) {
      console.log("WARNING: Direct matching found more brands than the algorithm!");
      
      // Find what brands are missing from our algorithm
      const missingBrands = commonBrandsDirectMatch.filter(brand => !commonBrands.has(brand));
      console.log(`Missing ${missingBrands.length} brands in algorithm that direct matching found:`);
      console.log(missingBrands.slice(0, 30));
      
      // Add the missing brands to our results
      missingBrands.forEach(brand => commonBrands.add(brand));
      
      // Recalculate brand records with the expanded set
      const expandedBrandRecords = availableBrands.filter(brand => {
        if (!brand.Brand) return false;
        const normalizedName = normalizeBrandName(brand.Brand.toString());
        return commonBrands.has(normalizedName);
      });
      
      console.log(`After correction: found ${expandedBrandRecords.length} brand records`);
      return expandedBrandRecords;
    }
  }
  
  console.log("Common brand records found:", commonBrandRecords.length);
  return commonBrandRecords;
};
