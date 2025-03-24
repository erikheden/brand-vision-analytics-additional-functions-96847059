
import { supabase } from "@/integrations/supabase/client";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { getPreferredBrandName } from "@/utils/industry/brandSelection";
import { BrandData } from "@/types/brand";

/**
 * Attempts to find a direct match for the brand in the given country
 */
export const findDirectBrandMatch = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  // Log this attempt for debugging purposes
  console.log(`Trying direct match for "${selectedBrand}" in ${country}`);
  
  // Try with country code or name, case-insensitive
  let { data: directMatchData, error: directMatchError } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("Brand, industry, Country, Year, Score, \"Row ID\"")
    .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
    .ilike('Brand', selectedBrand)  // Using ilike for case-insensitive matching
    .order('Year', { ascending: true });
    
  if (directMatchError) {
    console.error(`Error fetching direct match for ${selectedBrand}:`, directMatchError);
  }
  
  if (directMatchData && directMatchData.length > 0) {
    console.log(`Found ${directMatchData.length} direct matches for "${selectedBrand}" in ${country}`);
  }
  
  return directMatchData || [];
};

/**
 * Finds brands in a country that match the normalized name of the selected brand
 * Uses the new getPreferredBrandName function to select the best variant
 */
export const findNormalizedBrandMatches = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  const normalizedSelectedBrand = normalizeBrandName(selectedBrand);
  console.log(`Looking for matches for "${selectedBrand}" (normalized: "${normalizedSelectedBrand}") in ${country}`);
  
  // Get all brands in this country to find potential matches
  let { data: allBrandsInCountry, error: brandsError } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("Brand")
    .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
    .not('Brand', 'is', null)
    .order('Brand', { ascending: true });
  
  if (brandsError) {
    console.error("Error fetching brands for matching:", brandsError);
    return [];
  }
  
  // Extract all brand names for matching
  const brandNames = allBrandsInCountry
    ?.filter(item => item.Brand)
    .map(item => item.Brand as string) || [];
  
  // Find brands in this country that match the normalized selected brand
  const matchingBrands = brandNames.filter(brandName => 
    normalizeBrandName(brandName) === normalizedSelectedBrand
  );
  
  if (matchingBrands.length === 0) {
    console.log(`No matching brands found for ${selectedBrand} in ${country}`);
    
    // Try a more aggressive partial match approach for better hit rates
    const partialMatches = brandNames.filter(brandName => {
      const normalizedName = normalizeBrandName(brandName);
      // Look for partial matches in BOTH directions
      return normalizedName.includes(normalizedSelectedBrand) || 
             normalizedSelectedBrand.includes(normalizedName);
    });
    
    if (partialMatches.length > 0) {
      console.log(`Found ${partialMatches.length} partial matches for "${selectedBrand}" in ${country}: ${partialMatches.slice(0, 3).join(', ')}...`);
      // Get the preferred display name
      const preferredBrandName = getPreferredBrandName(partialMatches, normalizedSelectedBrand);
      
      // Query data for the preferred matching brand
      let { data: brandData, error: dataError } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select("*")
        .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
        .eq('Brand', preferredBrandName)
        .order('Year', { ascending: true });
      
      if (dataError) {
        console.error(`Error fetching data for partial brand matches in ${country}:`, dataError);
        return [];
      }
      
      // If we still have no data, try one last attempt with a broader search
      if (!brandData || brandData.length === 0) {
        console.log(`No data found for preferred brand "${preferredBrandName}". Trying broader search...`);
        
        // Try a very broad ILIKE search as a fallback
        const searchTerm = normalizedSelectedBrand.length > 3 
          ? normalizedSelectedBrand.substring(0, 4) // First 4 chars
          : normalizedSelectedBrand;
          
        let { data: broadMatchData, error: broadMatchError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
          .ilike('Brand', `%${searchTerm}%`)
          .order('Year', { ascending: true });
        
        if (broadMatchError) {
          console.error(`Error fetching broad match data in ${country}:`, broadMatchError);
          return [];
        }
        
        if (broadMatchData && broadMatchData.length > 0) {
          console.log(`Found ${broadMatchData.length} results with broad search for "${searchTerm}" in ${country}`);
          brandData = broadMatchData;
        }
      }
      
      // Tag these records with the selected brand name for consistency
      return (brandData || []).map(item => ({
        ...item,
        OriginalBrand: item.Brand, // Keep the original brand name
        Brand: selectedBrand, // Use the selected brand name for consistency
        NormalizedBrand: normalizedSelectedBrand // For debugging
      }));
    }
    
    return [];
  }
  
  // Get the preferred display name using the new utility function
  const preferredBrandName = getPreferredBrandName(matchingBrands, normalizedSelectedBrand);
  
  console.log(`Found ${matchingBrands.length} matching brands for "${selectedBrand}" in ${country}, using "${preferredBrandName}"`);
  
  // Query data for the preferred matching brand
  let { data: brandData, error: dataError } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("*")
    .or(`Country.ilike.${country},Country.ilike.${fullCountryName}`)
    .eq('Brand', preferredBrandName)
    .order('Year', { ascending: true });
  
  if (dataError) {
    console.error(`Error fetching data for brand matches in ${country}:`, dataError);
    return [];
  }
  
  // Tag these records with the selected brand name for consistency
  return (brandData || []).map(item => ({
    ...item,
    OriginalBrand: item.Brand, // Keep the original brand name
    Brand: selectedBrand, // Use the selected brand name for consistency
    NormalizedBrand: normalizedSelectedBrand // For debugging
  }));
};
