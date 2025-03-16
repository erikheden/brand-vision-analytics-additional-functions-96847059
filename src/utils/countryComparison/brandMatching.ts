import { supabase } from "@/integrations/supabase/client";
import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";
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
 * Prioritizes capitalized brands over lowercase ones
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
  
  // Find brands in this country that match the normalized selected brand
  const matchingBrands = allBrandsInCountry
    ?.filter(item => item.Brand)
    .map(item => ({
      original: item.Brand as string,
      normalized: normalizeBrandName(item.Brand as string)
    }))
    .filter(item => item.normalized === normalizedSelectedBrand) || [];
  
  // Sort matches to prioritize capitalized versions over lowercase
  const sortedMatchingBrands = matchingBrands.sort((a, b) => {
    // If first letter is uppercase in one but not the other, prioritize uppercase
    const aIsCapitalized = a.original.charAt(0) === a.original.charAt(0).toUpperCase();
    const bIsCapitalized = b.original.charAt(0) === b.original.charAt(0).toUpperCase();
    
    if (aIsCapitalized && !bIsCapitalized) return -1;
    if (!aIsCapitalized && bIsCapitalized) return 1;
    
    // Otherwise, sort by original brand name
    return a.original.localeCompare(b.original);
  });
  
  // Take only the first match (prioritized by capitalization)
  const matchingBrandNames = sortedMatchingBrands.length > 0 
    ? [sortedMatchingBrands[0].original] 
    : [];
  
  console.log(`Found ${matchingBrandNames.length} matching brands for "${selectedBrand}" in ${country}:`, matchingBrandNames);
  
  if (matchingBrandNames.length === 0) {
    console.log(`No matching brands found for ${selectedBrand} in ${country}`);
    return [];
  }
  
  // Query data for the best matching brand
  let { data: brandData, error: dataError } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("*")
    .or(`Country.eq.${country},Country.eq.${fullCountryName}`)
    .in('Brand', matchingBrandNames)
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
