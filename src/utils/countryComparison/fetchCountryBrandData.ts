import { getFullCountryName } from "@/components/CountrySelect";
import { BrandData } from "@/types/brand";
import { findDirectBrandMatch, findNormalizedBrandMatches } from "./brandMatching";
import { fetchAllBrandsData, createProjections } from "./marketDataUtils";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

/**
 * Fetches brand data for a specific country
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
    
    // For each selected brand, we need to find potential matches in the current country
    const brandQueries = selectedBrands.map(async (selectedBrand) => {
      console.log(`Trying to match "${selectedBrand}" in ${country}`);
      
      // Try direct match first
      const directMatches = await findDirectBrandMatch(country, fullCountryName, selectedBrand);
      
      // If we found a direct match, use it
      if (directMatches.length > 0) {
        console.log(`Found direct match for "${selectedBrand}" in ${country}: ${directMatches.length} records`);
        return directMatches;
      }
      
      // Try case variations first - these are the most likely to succeed
      const caseVariations = [
        selectedBrand.toLowerCase(),
        selectedBrand.toUpperCase(),
        selectedBrand.charAt(0).toUpperCase() + selectedBrand.slice(1).toLowerCase(), // Title Case
      ];
      
      for (const variation of caseVariations) {
        if (variation !== selectedBrand) { // Skip if same as original
          const variationMatches = await findDirectBrandMatch(country, fullCountryName, variation);
          if (variationMatches.length > 0) {
            console.log(`Found match for "${selectedBrand}" using case variation "${variation}" in ${country}: ${variationMatches.length} records`);
            return variationMatches.map(match => ({
              ...match,
              Brand: selectedBrand // Update brand name to original selected brand for consistency
            }));
          }
        }
      }
      
      // Try more aggressive brand name variations for better matching
      // For example: "LEGO" could be "Lego", "LEGO Group", etc.
      const variations = [
        // Company name variations
        selectedBrand + " Group",
        selectedBrand + " Inc",
        selectedBrand + " Corporation",
        selectedBrand + " AB",
        selectedBrand + " Co",
        selectedBrand + " & Co",
        selectedBrand + " AS",
        selectedBrand + " A/S",
        selectedBrand + " GmbH",
        selectedBrand + " International",
        selectedBrand + " Stores",
        selectedBrand + " Retail",
        // Brand name variants
        selectedBrand.replace('&', 'and'),
        selectedBrand.replace('and', '&'),
        selectedBrand.replace(/-/g, ' '),
        selectedBrand.replace(/\s+/g, '-'),
        selectedBrand.replace(/\./g, ''),
        selectedBrand.replace(/\s+/g, '')
      ];
      
      // Add normalized version that removes common phrases
      const baseNameVariations = [
        selectedBrand.replace(/ Group$/, ''),
        selectedBrand.replace(/ Inc$/, ''),
        selectedBrand.replace(/ Corporation$/, ''),
        selectedBrand.replace(/ AB$/, ''),
        selectedBrand.replace(/ Co$/, ''),
        selectedBrand.replace(/ & Co$/, ''),
        selectedBrand.replace(/ AS$/, ''),
        selectedBrand.replace(/ A\/S$/, ''),
        selectedBrand.replace(/ GmbH$/, ''),
        selectedBrand.replace(/ International$/, ''),
        selectedBrand.replace(/ Stores$/, ''),
        selectedBrand.replace(/ Retail$/, '')
      ];
      
      // Combine all variations
      const allVariations = [...variations, ...baseNameVariations];
      
      // Try each variation
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
      
      // If all direct attempts failed, try normalized matching
      const normalizedMatches = await findNormalizedBrandMatches(country, fullCountryName, selectedBrand);
      
      if (normalizedMatches.length > 0) {
        console.log(`Found normalized match for "${selectedBrand}" in ${country}: ${normalizedMatches.length} records`);
        return normalizedMatches.map(match => ({
          ...match,
          Brand: selectedBrand // Update to selected brand name for consistency
        }));
      }
      
      // Special handling for known brands with different names in different countries
      const specialBrandMappings: Record<string, string[]> = {
        'LEGO': ['LEGO', 'Lego', 'LEGO Group', 'The LEGO Group'],
        'H&M': ['H&M', 'H & M', 'Hennes & Mauritz'],
        'McDonald\'s': ['McDonald\'s', 'McDonalds', 'McDonald'],
        'Coca-Cola': ['Coca-Cola', 'Coca Cola', 'Coke'],
        'IKEA': ['IKEA', 'Ikea', 'IKEA Group'],
        'BMW': ['BMW', 'Bayerische Motoren Werke', 'BMV'],
        'Volkswagen': ['Volkswagen', 'VW', 'Volks Wagen'],
        'Nike': ['Nike', 'NIKE'],
        'Adidas': ['Adidas', 'ADIDAS', 'adidas'],
        'Zara': ['Zara', 'ZARA'],
        'SAS': ['SAS', 'Scandinavian Airlines', 'Scandinavian Airlines System'],
        'Finnair': ['Finnair', 'FINNAIR']
      };
      
      // Check if we have special mappings for this brand
      const normalizedSelectedBrand = normalizeBrandName(selectedBrand);
      
      for (const [brandKey, alternateNames] of Object.entries(specialBrandMappings)) {
        const normalizedKey = normalizeBrandName(brandKey);
        
        if (normalizedKey === normalizedSelectedBrand) {
          // Try each alternate name
          for (const alternateName of alternateNames) {
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
      }
      
      console.log(`No matches found for "${selectedBrand}" in ${country}`);
      return [];
    });
    
    // Wait for all brand queries to complete
    const brandDataArrays = await Promise.all(brandQueries);
    
    // Flatten the array of arrays
    const combinedData = brandDataArrays.flat();
    
    console.log(`Final combined data for ${country}: ${combinedData.length} records`);
    
    // Get market data for standardization purposes
    const allBrandsData = await fetchAllBrandsData(country, fullCountryName);
    
    // Remove duplicates (same Brand and Year)
    const uniqueEntries = new Map();
    combinedData.forEach(entry => {
      const key = `${entry.Brand}-${entry.Year}`;
      if (!uniqueEntries.has(key) || entry.Score > uniqueEntries.get(key).Score) {
        uniqueEntries.set(key, entry);
      }
    });
    
    const finalData = Array.from(uniqueEntries.values());
    
    // Store market data for standardization
    Object.defineProperty(finalData, 'marketData', {
      value: allBrandsData,
      enumerable: false
    });
    
    // Create projected data for 2025 if needed
    const projectedData = createProjections(finalData, selectedBrands);
    
    return [...finalData, ...projectedData];
  } catch (err) {
    console.error("Exception in chart data query:", err);
    return [];
  }
};
