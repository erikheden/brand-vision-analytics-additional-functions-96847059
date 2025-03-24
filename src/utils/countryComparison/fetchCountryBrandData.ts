
import { getFullCountryName } from "@/components/CountrySelect";
import { BrandData } from "@/types/brand";
import { normalizeBrandName, getSpecialBrandName } from "@/utils/industry/brandNormalization";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches brand data for a specific country and list of selected brands
 */
export const fetchCountryBrandData = async (
  country: string,
  selectedBrands: string[]
): Promise<BrandData[]> => {
  // Return early if no country or no brands are selected
  if (!country || selectedBrands.length === 0) return [];
  
  console.log(`Fetching chart data for country: ${country} and brands:`, selectedBrands);
  
  try {
    // Get the full country name for better matching
    const fullCountryName = getFullCountryName(country);
    console.log(`Country code: ${country}, Full name: ${fullCountryName}`);
    
    // Build a condition to match either country code or full name
    const countryCondition = `Country.ilike.${country},Country.ilike.${fullCountryName}`;
    
    // Process each brand and find matches in the database
    const brandResultsPromises = selectedBrands.map(async (brandName) => {
      console.log(`Finding matches for brand "${brandName}" in ${country}`);
      
      // Step 1: Try exact match first (case insensitive)
      const { data: exactMatches, error: exactError } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select("*")
        .or(countryCondition)
        .ilike('Brand', brandName)
        .order('Year', { ascending: true });
      
      if (exactError) {
        console.error(`Error with exact match query for ${brandName}:`, exactError);
      }
      
      if (exactMatches && exactMatches.length > 0) {
        console.log(`Found ${exactMatches.length} exact matches for "${brandName}"`);
        return exactMatches.map(match => ({
          ...match,
          matchType: "exact" as const
        }));
      }
      
      // Step 2: Try normalized match
      // First get all brands in this country
      const { data: allCountryBrands, error: brandsError } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select("Brand")
        .or(countryCondition)
        .not('Brand', 'is', null)
        .not('Score', 'is', null);
      
      if (brandsError) {
        console.error(`Error fetching brands in ${country}:`, brandsError);
        return [];
      }
      
      if (!allCountryBrands || allCountryBrands.length === 0) {
        console.log(`No brands found in ${country}`);
        return [];
      }
      
      // Normalize the selected brand name
      const normalizedSelectedBrand = normalizeBrandName(brandName);
      
      // Map of normalized names to original database brand names
      const brandMap = new Map<string, string>();
      allCountryBrands.forEach(item => {
        if (item.Brand) {
          const normalizedName = normalizeBrandName(item.Brand);
          brandMap.set(normalizedName, item.Brand);
        }
      });
      
      // Check if we have a normalized match
      if (brandMap.has(normalizedSelectedBrand)) {
        const matchedDbBrandName = brandMap.get(normalizedSelectedBrand);
        console.log(`Found normalized match: "${brandName}" → "${matchedDbBrandName}"`);
        
        // Get data for this brand
        const { data: normalizedMatches, error: normalizedError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(countryCondition)
          .eq('Brand', matchedDbBrandName)
          .order('Year', { ascending: true });
        
        if (normalizedError) {
          console.error(`Error fetching normalized match data:`, normalizedError);
          return [];
        }
        
        if (normalizedMatches && normalizedMatches.length > 0) {
          return normalizedMatches.map(match => ({
            ...match,
            OriginalBrand: match.Brand,
            Brand: brandName, // Use the selected brand name for consistency
            matchType: "normalized" as const
          }));
        }
      }
      
      // Step 3: Try partial matching (substring match)
      const partialMatches: string[] = [];
      brandMap.forEach((originalBrand, normalizedName) => {
        if (normalizedName.includes(normalizedSelectedBrand) || 
            normalizedSelectedBrand.includes(normalizedName)) {
          partialMatches.push(originalBrand);
        }
      });
      
      if (partialMatches.length > 0) {
        console.log(`Found ${partialMatches.length} partial matches for "${brandName}": ${partialMatches.join(', ')}`);
        
        // Use the first match (could be enhanced with a better matching algorithm)
        const bestMatch = partialMatches[0];
        
        const { data: partialMatchData, error: partialError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(countryCondition)
          .eq('Brand', bestMatch)
          .order('Year', { ascending: true });
        
        if (partialError) {
          console.error(`Error fetching partial match data:`, partialError);
          return [];
        }
        
        if (partialMatchData && partialMatchData.length > 0) {
          return partialMatchData.map(match => ({
            ...match,
            OriginalBrand: match.Brand,
            Brand: brandName, // Use the selected brand name for consistency
            matchType: "partial" as const
          }));
        }
      }
      
      // Step 4: Try special brand name variants
      const specialBrandName = getSpecialBrandName(normalizedSelectedBrand);
      if (specialBrandName) {
        console.log(`Trying special brand name "${specialBrandName}" for "${brandName}"`);
        
        const { data: specialNameData, error: specialError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(countryCondition)
          .ilike('Brand', specialBrandName)
          .order('Year', { ascending: true });
        
        if (specialError) {
          console.error(`Error fetching special brand name match:`, specialError);
          return [];
        }
        
        if (specialNameData && specialNameData.length > 0) {
          console.log(`Found ${specialNameData.length} matches using special name "${specialBrandName}"`);
          return specialNameData.map(match => ({
            ...match,
            OriginalBrand: match.Brand,
            Brand: brandName, // Use the selected brand name for consistency
            matchType: "special" as const
          }));
        }
      }
      
      // No matches found after all attempts
      console.log(`No matches found for "${brandName}" in ${country}`);
      return [];
    });
    
    // Wait for all brand queries to complete
    const brandResultArrays = await Promise.all(brandResultsPromises);
    
    // Flatten the array of arrays and filter out empty results
    const allBrandData = brandResultArrays.flat();
    
    console.log(`Final data for ${country}: ${allBrandData.length} brand data points`);
    
    // Add market average data
    const { data: marketAverages, error: marketError } = await supabase
      .from("SBI Average Scores")
      .select("*")
      .or(`country.eq.${country},country.eq.${fullCountryName}`)
      .order('year', { ascending: true });
    
    if (marketError) {
      console.error("Error fetching market averages:", marketError);
    } else if (marketAverages && marketAverages.length > 0) {
      console.log(`Found ${marketAverages.length} market average records for ${country}`);
      
      // Transform market average data to match BrandData format
      const formattedAverages = marketAverages.map(avg => ({
        "Row ID": -1 * avg.year, // Use negative IDs for average data
        Year: avg.year,
        Brand: "Market Average",
        Country: country,
        Score: avg.score,
        industry: "All Industries",
        isMarketAverage: true,
        OriginalBrand: "Market Average",
        matchType: "average" as const
      }));
      
      // Add the market averages to our results
      allBrandData.push(...formattedAverages);
    }
    
    return allBrandData;
  } catch (err) {
    console.error("Exception in chart data fetch:", err);
    return [];
  }
};
