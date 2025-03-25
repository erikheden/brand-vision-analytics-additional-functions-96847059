
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { findDirectBrandMatch, findNormalizedBrandMatches } from "./brandMatching";
import { 
  generateCaseVariations, 
  generateNameVariations, 
  generateBaseNameVariations,
  getSpecialBrandMappings
} from "./brandVariationUtils";

/**
 * Tries to find a direct match for the brand
 */
export const findExactBrandMatch = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  // Try direct match
  const directMatches = await findDirectBrandMatch(country, fullCountryName, selectedBrand);
  
  if (directMatches.length > 0) {
    console.log(`Found direct match for "${selectedBrand}" in ${country}: ${directMatches.length} records`);
    return directMatches;
  }
  
  return [];
};

/**
 * Tries to match a brand using case variations (upper/lower/title case)
 */
export const findBrandByCaseVariations = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  // Try case variations
  const caseVariations = generateCaseVariations(selectedBrand);
  
  for (const variation of caseVariations) {
    const variationMatches = await findDirectBrandMatch(country, fullCountryName, variation);
    if (variationMatches.length > 0) {
      console.log(`Found match for "${selectedBrand}" using case variation "${variation}" in ${country}: ${variationMatches.length} records`);
      return variationMatches.map(match => ({
        ...match,
        Brand: selectedBrand // Update brand name to original selected brand for consistency
      }));
    }
  }
  
  return [];
};

/**
 * Tries to match a brand using common naming variations
 */
export const findBrandByNameVariations = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  // Try name variations and base name variations
  const nameVariations = generateNameVariations(selectedBrand);
  const baseNameVariations = generateBaseNameVariations(selectedBrand);
  const allVariations = [...nameVariations, ...baseNameVariations];
  
  for (const variation of allVariations) {
    if (variation !== selectedBrand) { // Skip if same as original
      const variationMatches = await findDirectBrandMatch(country, fullCountryName, variation);
      if (variationMatches.length > 0) {
        console.log(`Found match for "${selectedBrand}" using variation "${variation}" in ${country}: ${variationMatches.length} records`);
        // Update the brand name to the original selected brand for consistency
        return variationMatches.map(match => ({
          ...match,
          Brand: selectedBrand
        }));
      }
    }
  }
  
  return [];
};

/**
 * Try to find brand using normalized matching approach
 */
export const findBrandByNormalizedMatch = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  const normalizedMatches = await findNormalizedBrandMatches(country, fullCountryName, selectedBrand);
  
  if (normalizedMatches.length > 0) {
    console.log(`Found normalized match for "${selectedBrand}" in ${country}: ${normalizedMatches.length} records`);
    return normalizedMatches.map(match => ({
      ...match,
      Brand: selectedBrand // Update to selected brand name for consistency
    }));
  }
  
  return [];
};

/**
 * Try to match using known special brand mappings
 */
export const findBrandBySpecialMappings = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  // Get special mappings for this brand
  const specialMappings = getSpecialBrandMappings(selectedBrand);
  
  if (specialMappings.length > 0) {
    // Try each alternate name
    for (const alternateName of specialMappings) {
      const specialMatches = await findDirectBrandMatch(country, fullCountryName, alternateName);
      if (specialMatches.length > 0) {
        console.log(`Found special mapping match for "${selectedBrand}" using "${alternateName}" in ${country}: ${specialMatches.length} records`);
        return specialMatches.map(match => ({
          ...match,
          Brand: selectedBrand // Update to selected brand name for consistency
        }));
      }
    }
  }
  
  return [];
};

/**
 * Try one last attempt with a broader search
 */
export const findBrandByBroadSearch = async (
  country: string, 
  fullCountryName: string, 
  selectedBrand: string
): Promise<BrandData[]> => {
  // Get first few chars for broad search
  const searchTerm = selectedBrand.length > 3 
    ? selectedBrand.substring(0, 4) // First 4 chars
    : selectedBrand;
    
  let { data: broadMatchData, error: broadMatchError } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("*")
    .or(`Country.eq.${country},Country.eq.${fullCountryName}`)
    .ilike('Brand', `%${searchTerm}%`)
    .order('Year', { ascending: true });
  
  if (broadMatchError) {
    console.error(`Error fetching broad match data in ${country}:`, broadMatchError);
    return [];
  }
  
  if (broadMatchData && broadMatchData.length > 0) {
    console.log(`Found ${broadMatchData.length} results with broad search for "${searchTerm}" in ${country}`);
    return broadMatchData.map(item => ({
      ...item,
      Brand: selectedBrand // Use selected brand for consistency
    }));
  }
  
  return [];
};
