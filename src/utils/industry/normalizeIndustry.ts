
/**
 * Normalizes industry names to handle minor formatting differences
 */
export const normalizeIndustryName = (industry: string): string => {
  if (!industry) return '';
  
  // Standardize common variations
  return industry
    .trim()
    .replace(/&/g, '&')  // Standardize ampersands
    .replace(/,\s+/g, ', ') // Standardize commas
    .replace(/\s+/g, ' ') // Remove extra spaces
    .replace(/cafes/i, 'Cafés') // Standardize "Cafes" to "Cafés"
    .replace(/take-?away/i, 'Take-away') // Standardize takeaway variations
    .toLowerCase(); // Make case-insensitive
};

/**
 * Aggressively normalizes brand names to handle different country variants
 * This is vital for cross-country brand comparison
 */
export const normalizeBrandName = (brandName: string): string => {
  if (!brandName) return '';
  
  // Aggressively normalize the brand name to identify the same brand across countries
  return brandName
    .trim()
    .replace(/\s*\([A-Z]{1,3}\)\s*$/i, '') // Remove country codes in parentheses at the end: "Brand (SE)"
    .replace(/\s+-\s+[A-Z]{1,3}\s*$/i, '') // Remove formats like "- SE" at the end
    .replace(/\s+[A-Z]{1,3}\s*$/i, '') // Remove space followed by country code: "Brand SE"
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .replace(/[&+]/g, 'and') // Replace & and + with "and"
    .replace(/'/g, '') // Remove apostrophes
    .replace(/\./g, '') // Remove periods
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .toLowerCase() // Convert to lowercase for case-insensitive comparison
    .trim(); // Final trim to remove any leading/trailing spaces
};

/**
 * Get preferred brand display name 
 * Selects the best version of a brand name from multiple variants,
 * preferring capitalized versions.
 */
export const getPreferredBrandName = (
  brands: string[], 
  normalizedName: string
): string => {
  const candidates = brands.filter(
    brand => normalizeBrandName(brand) === normalizedName
  );
  
  if (candidates.length === 0) return '';
  
  // Sort to prioritize:
  // 1. Capitalized first letter (Title case)
  // 2. All uppercase
  // 3. Other cases
  return candidates.sort((a, b) => {
    const aFirstCap = a.charAt(0) === a.charAt(0).toUpperCase();
    const bFirstCap = b.charAt(0) === b.charAt(0).toUpperCase();
    
    // If one has first letter capitalized and the other doesn't, prioritize the capitalized one
    if (aFirstCap && !bFirstCap) return -1;
    if (!aFirstCap && bFirstCap) return 1;
    
    // If both/neither have first letter capitalized, check for ALL CAPS
    const aAllCaps = a === a.toUpperCase();
    const bAllCaps = b === b.toUpperCase();
    if (aAllCaps && !bAllCaps) return -1;
    if (!aAllCaps && bAllCaps) return 1;
    
    // If still tied, sort alphabetically
    return a.localeCompare(b);
  })[0];
};
