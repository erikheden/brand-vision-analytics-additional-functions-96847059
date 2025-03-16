
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
  let normalized = brandName
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
  
  // Add special case handling for specific brands known to be the same across countries
  const specialCases: Record<string, string> = {
    'klm': 'klm',
    'klm royal dutch airlines': 'klm',
    'mcdonalds': 'mcdonalds',
    'mc donalds': 'mcdonalds',
    'ikea': 'ikea',
    'h and m': 'handm',
    'hm': 'handm',
    'h m': 'handm',
    'handm': 'handm',
    'coca cola': 'cocacola',
    'cocacola': 'cocacola',
    'coke': 'cocacola',
    'coca cola zero': 'cocacolazero',
    'coca cola zero sugar': 'cocacolazero',
    'pepsi': 'pepsi',
    'pepsi max': 'pepsimax',
    'pepsimax': 'pepsimax',
    'mcdonald': 'mcdonalds'
    // Removed duplicate 'mcdonalds' entry
  };
  
  // Check if this normalized brand name has a special case mapping
  return specialCases[normalized] || normalized;
};

/**
 * Get preferred brand display name 
 * Selects the best version of a brand name from multiple variants,
 * now with improved prioritization for acronyms and capitalization patterns.
 */
export const getPreferredBrandName = (
  brands: string[], 
  normalizedName: string
): string => {
  const candidates = brands.filter(
    brand => normalizeBrandName(brand) === normalizedName
  );
  
  if (candidates.length === 0) return '';
  
  // Define a helper function to check if a string is a likely acronym
  // Better detection for acronyms like KLM, SAS that should remain uppercase
  const isLikelyAcronym = (str: string): boolean => {
    // Must be all uppercase
    if (str !== str.toUpperCase()) return false;
    
    // Must be at least 2 characters
    if (str.length < 2) return false;
    
    // Common airline and brand acronyms
    const knownAcronyms = ['KLM', 'SAS', 'TUI', 'ICA', 'BYD', 'BMW', 'IBM'];
    if (knownAcronyms.includes(str)) return true;
    
    // Check if it has no lowercase letters and no spaces
    // This helps identify acronyms like "KLM" versus "Klm"
    return /^[A-Z0-9]+$/.test(str) && !str.includes(' ');
  };
  
  // Sort to prioritize (in order):
  // 1. Known acronyms or all uppercase short names (like KLM, SAS)
  // 2. Capitalized first letter (Title case)
  // 3. Other cases
  return candidates.sort((a, b) => {
    // First check for known acronyms or ALL CAPS short names
    const aIsAcronym = isLikelyAcronym(a);
    const bIsAcronym = isLikelyAcronym(b);
    
    if (aIsAcronym && !bIsAcronym) return -1;
    if (!aIsAcronym && bIsAcronym) return 1;
    
    // If neither or both are acronyms, check for first letter capitalized
    const aFirstCap = a.charAt(0) === a.charAt(0).toUpperCase();
    const bFirstCap = b.charAt(0) === b.charAt(0).toUpperCase();
    
    if (aFirstCap && !bFirstCap) return -1;
    if (!aFirstCap && bFirstCap) return 1;
    
    // Check for all caps as a fallback
    const aAllCaps = a === a.toUpperCase() && a.length >= 2;
    const bAllCaps = b === b.toUpperCase() && b.length >= 2;
    
    if (aAllCaps && !bAllCaps) return -1;
    if (!aAllCaps && bAllCaps) return 1;
    
    // If still tied, prefer the longer name (often more complete)
    if (a.length !== b.length) return b.length - a.length;
    
    // Last resort: alphabetical sorting
    return a.localeCompare(b);
  })[0];
};
