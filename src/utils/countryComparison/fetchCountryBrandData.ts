
import { getFullCountryName } from "@/components/CountrySelect";
import { BrandData } from "@/types/brand";
import { findDirectBrandMatch, findNormalizedBrandMatches } from "./brandMatching";
import { fetchAllBrandsData, createProjections } from "./marketDataUtils";

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
        selectedBrand.replace('&', 'and'),
        selectedBrand.replace('and', '&'),
        selectedBrand.replace(/-/g, ' '),
        selectedBrand.replace(/\s+/g, '-'),
        selectedBrand.replace(/\./g, ''),
        selectedBrand.replace(/\s+/g, '')
      ];
      
      // Try each variation
      for (const variation of variations) {
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
      
      // Otherwise try normalized matching
      return await findNormalizedBrandMatches(country, fullCountryName, selectedBrand);
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
