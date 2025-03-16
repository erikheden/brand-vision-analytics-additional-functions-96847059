
import { supabase } from "@/integrations/supabase/client";
import { normalizeBrandName, getPreferredBrandName } from "@/utils/industry/normalizeIndustry";
import { BrandData } from "@/types/brand";

/**
 * Attempts to find a direct match for the brand in the given country
 */
export const findDirectBrandMatch = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  // Try with country code first (direct match with the selected brand)
  let { data: directMatchData, error: directMatchError } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("Brand, industry, Country, Year, Score, \"Row ID\"")
    .or(`Country.eq.${country},Country.eq.${fullCountryName}`)
    .eq('Brand', selectedBrand)
    .order('Year', { ascending: true });
    
  if (directMatchError) {
    console.error(`Error fetching direct match for ${selectedBrand}:`, directMatchError);
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
    .or(`Country.eq.${country},Country.eq.${fullCountryName}`)
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
    return [];
  }
  
  // Get the preferred display name using the new utility function
  const preferredBrandName = getPreferredBrandName(matchingBrands, normalizedSelectedBrand);
  
  console.log(`Found ${matchingBrands.length} matching brands for "${selectedBrand}" in ${country}, using "${preferredBrandName}"`);
  
  // Query data for the preferred matching brand
  let { data: brandData, error: dataError } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("*")
    .or(`Country.eq.${country},Country.eq.${fullCountryName}`)
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
