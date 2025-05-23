
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
    const knownAcronyms = ['KLM', 'SAS', 'TUI', 'ICA', 'BYD', 'BMW', 'IBM', 'H&M', 'VW'];
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

// Need to import for the function to work
import { normalizeBrandName } from './brandNormalization';
