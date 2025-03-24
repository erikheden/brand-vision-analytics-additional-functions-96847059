
import { getFullCountryName } from "@/components/CountrySelect";
import { BrandData } from "@/types/brand";
import { 
  findExactBrandMatch,
  findBrandByCaseVariations,
  findBrandByNameVariations,
  findBrandByNormalizedMatch,
  findBrandBySpecialMappings,
  findBrandByBroadSearch
} from "./brandMatchingStrategies";
import { processBrandData, enhanceBrandData } from "./brandDataProcessor";

/**
 * Fetches brand data for a specific country using various matching strategies
 */
export const fetchCountryBrandData = async (
  country: string,
  selectedBrands: string[]
): Promise<BrandData[]> => {
  if (!country || selectedBrands.length === 0) return [];
  
  console.log(`Fetching chart data for country: ${country} and brands:`, selectedBrands);
  
  try {
    // Get the full country name
    const fullCountryName = getFullCountryName(country);
    console.log(`Country code: ${country}, Full name: ${fullCountryName}`);
    
    // For each selected brand, we need to find potential matches in the current country
    const brandQueries = selectedBrands.map(async (selectedBrand) => {
      console.log(`Trying to match "${selectedBrand}" in ${country}`);
      
      // Try different strategies in order of specificity
      
      // 1. Try direct match first
      let matches = await findExactBrandMatch(country, fullCountryName, selectedBrand);
      if (matches.length > 0) {
        console.log(`Found direct match for "${selectedBrand}" in ${country}`);
        return {...matches[0], matchMethod: "exact"};
      }
      
      // 2. Try case variations
      matches = await findBrandByCaseVariations(country, fullCountryName, selectedBrand);
      if (matches.length > 0) {
        console.log(`Found case variation match for "${selectedBrand}" in ${country}`);
        return {...matches[0], matchMethod: "case-variation"};
      }
      
      // 3. Try name variations
      matches = await findBrandByNameVariations(country, fullCountryName, selectedBrand);
      if (matches.length > 0) {
        console.log(`Found name variation match for "${selectedBrand}" in ${country}`);
        return {...matches[0], matchMethod: "name-variation"};
      }
      
      // 4. Try normalized matching
      matches = await findBrandByNormalizedMatch(country, fullCountryName, selectedBrand);
      if (matches.length > 0) {
        console.log(`Found normalized match for "${selectedBrand}" in ${country}`);
        return {...matches[0], matchMethod: "normalized"};
      }
      
      // 5. Try special brand mappings
      matches = await findBrandBySpecialMappings(country, fullCountryName, selectedBrand);
      if (matches.length > 0) {
        console.log(`Found special mapping match for "${selectedBrand}" in ${country}`);
        return {...matches[0], matchMethod: "special-mapping"};
      }
      
      // 6. Last resort: Try broad search
      matches = await findBrandByBroadSearch(country, fullCountryName, selectedBrand);
      if (matches.length > 0) {
        console.log(`Found broad search match for "${selectedBrand}" in ${country}`);
        return {...matches[0], matchMethod: "broad-search"};
      }
      
      console.log(`No matches found for "${selectedBrand}" in ${country}`);
      return null;
    });
    
    // Wait for all brand queries to complete and filter out null results
    const brandData = (await Promise.all(brandQueries)).filter(Boolean);
    
    console.log(`Final data for ${country}: ${brandData.length} records`);
    
    // Process and deduplicate data
    const finalData = processBrandData(brandData);
    
    // Enhance with market data and projections
    return await enhanceBrandData(finalData, selectedBrands, country, fullCountryName);
  } catch (err) {
    console.error("Exception in chart data query:", err);
    return [];
  }
};
