
import { getFullCountryName } from "@/components/CountrySelect";
import { BrandData } from "@/types/brand";
import { normalizeBrandName, getSpecialBrandName } from "@/utils/industry/brandNormalization";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches brand data for a specific country using a simplified matching strategy
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
    
    // For each selected brand, find potential matches in the current country
    const matchedBrandsPromises = selectedBrands.map(async (selectedBrand) => {
      console.log(`Trying to match "${selectedBrand}" in ${country}`);
      const normalizedBrand = normalizeBrandName(selectedBrand);
      
      // Step 1: Try exact match (case insensitive)
      let { data: exactMatches, error: exactError } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select("*")
        .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
        .ilike('Brand', selectedBrand)
        .order('Year', { ascending: true });
      
      if (exactError) {
        console.error(`Error fetching exact matches for ${selectedBrand}:`, exactError);
      }
      
      if (exactMatches && exactMatches.length > 0) {
        console.log(`Found ${exactMatches.length} exact matches for "${selectedBrand}" in ${country}`);
        return exactMatches.map(match => ({
          ...match,
          matchMethod: "exact"
        }));
      }
      
      // Step 2: Get all brands in this country and try normalized matching
      let { data: allBrandsInCountry, error: brandsError } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select("Brand")
        .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
        .not('Brand', 'is', null)
        .not('Score', 'is', null); // Only include brands with scores - fixed the is() method
      
      if (brandsError) {
        console.error(`Error fetching all brands in ${country}:`, brandsError);
        return [];
      }
      
      if (!allBrandsInCountry || allBrandsInCountry.length === 0) {
        console.log(`No brands found in ${country}`);
        return [];
      }
      
      // Create a map of normalized brand names to original brand names
      const normalizedBrandMap = new Map<string, string>();
      allBrandsInCountry.forEach(item => {
        if (item.Brand) {
          const normalizedName = normalizeBrandName(item.Brand);
          normalizedBrandMap.set(normalizedName, item.Brand);
        }
      });
      
      // Check if our normalized selected brand exists in this country
      if (normalizedBrandMap.has(normalizedBrand)) {
        const matchingBrandName = normalizedBrandMap.get(normalizedBrand);
        console.log(`Found normalized match: "${selectedBrand}" matches "${matchingBrandName}" in ${country}`);
        
        // Get data for this matching brand
        let { data: brandData, error: dataError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
          .eq('Brand', matchingBrandName)
          .order('Year', { ascending: true });
        
        if (dataError) {
          console.error(`Error fetching data for matched brand ${matchingBrandName}:`, dataError);
          return [];
        }
        
        if (brandData && brandData.length > 0) {
          return brandData.map(item => ({
            ...item,
            OriginalBrand: item.Brand,
            Brand: selectedBrand, // Use the selected brand name for consistency
            NormalizedBrand: normalizedBrand,
            matchMethod: "normalized"
          }));
        }
      }
      
      // Step 3: Try to find partial matches
      const potentialMatches: string[] = [];
      normalizedBrandMap.forEach((originalBrand, normalizedName) => {
        // Check for substring match in either direction
        if (normalizedName.includes(normalizedBrand) || normalizedBrand.includes(normalizedName)) {
          potentialMatches.push(originalBrand);
        }
      });
      
      if (potentialMatches.length > 0) {
        console.log(`Found ${potentialMatches.length} partial matches for "${selectedBrand}" in ${country}: ${potentialMatches.join(', ')}`);
        
        // Try with the first potential match
        const bestMatch = potentialMatches[0];
        let { data: partialMatchData, error: partialError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
          .eq('Brand', bestMatch)
          .order('Year', { ascending: true });
        
        if (partialError) {
          console.error(`Error fetching data for partial match ${bestMatch}:`, partialError);
          return [];
        }
        
        if (partialMatchData && partialMatchData.length > 0) {
          return partialMatchData.map(item => ({
            ...item,
            OriginalBrand: item.Brand,
            Brand: selectedBrand, // Use the selected brand name for consistency
            NormalizedBrand: normalizedBrand,
            matchMethod: "partial"
          }));
        }
      }
      
      // Step 4: Look for special brand name variants
      const specialBrandName = getSpecialBrandName(normalizedBrand);
      if (specialBrandName) {
        let { data: specialNameData, error: specialError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
          .ilike('Brand', specialBrandName)
          .order('Year', { ascending: true });
        
        if (specialError) {
          console.error(`Error fetching data for special brand name ${specialBrandName}:`, specialError);
        }
        
        if (specialNameData && specialNameData.length > 0) {
          console.log(`Found match using special brand name "${specialBrandName}" for "${selectedBrand}" in ${country}`);
          return specialNameData.map(item => ({
            ...item,
            OriginalBrand: item.Brand,
            Brand: selectedBrand,
            NormalizedBrand: normalizedBrand,
            matchMethod: "special"
          }));
        }
      }
      
      // No matches found
      console.log(`No matches found for "${selectedBrand}" in ${country}`);
      return [];
    });
    
    // Wait for all brand queries to complete
    const brandDataArrays = await Promise.all(matchedBrandsPromises);
    
    // Flatten the array of arrays and filter out empty results
    const allBrandData = brandDataArrays.flat();
    
    console.log(`Final data for ${country}: ${allBrandData.length} records`);
    
    // Get market average data to include
    let { data: averageData, error: averageError } = await supabase
      .from("SBI Average Scores")
      .select("*")
      .or(`country.eq.${country},country.eq.${fullCountryName}`)
      .order('year', { ascending: true });
    
    if (averageError) {
      console.error("Error fetching average scores:", averageError);
    } else if (averageData && averageData.length > 0) {
      console.log(`Found ${averageData.length} market average records for ${country}`);
      
      // Add market average data as special entries
      const marketAverages = averageData.map(avgData => ({
        "Row ID": -100 - avgData.year, // Use negative IDs for average data
        Year: avgData.year,
        Brand: "Market Average",
        Country: country,
        Score: avgData.score,
        industry: "All Industries",
        IsMarketAverage: true,
        matchMethod: "average"
      }));
      
      // Add market averages to our results
      allBrandData.push(...marketAverages);
    }
    
    return allBrandData;
  } catch (err) {
    console.error("Exception in chart data query:", err);
    return [];
  }
};
