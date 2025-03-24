
import { normalizeBrandName } from "./brandNormalization";

/**
 * Selects the preferred display name for a brand from multiple variants
 */
export const getPreferredBrandName = (
  brandVariants: string[],
  normalizedName: string
): string => {
  if (!brandVariants || brandVariants.length === 0) return "";
  
  // If only one variant, use it
  if (brandVariants.length === 1) return brandVariants[0];
  
  // Create a scoring system for brand name variants
  const scoredVariants = brandVariants.map(variant => {
    let score = 0;
    
    // Prefer capitalized first letter
    if (variant.charAt(0) === variant.charAt(0).toUpperCase()) {
      score += 2;
    }
    
    // Prefer variants with proper spacing
    if (variant.includes(" ") && !variant.includes("  ")) {
      score += 1;
    }
    
    // Prefer variants with proper apostrophes
    if (variant.includes("'")) {
      score += 1;
    }
    
    // Penalize variants with lowercase throughout
    if (variant === variant.toLowerCase()) {
      score -= 1;
    }
    
    // Prefer variants with company indicators
    const companyIndicators = [" AB", " AS", " Inc", " GmbH", " Ltd", " LLC", " Co"];
    if (companyIndicators.some(indicator => variant.endsWith(indicator))) {
      score += 1;
    }
    
    // Penalize variants that are excessively long
    if (variant.length > 20) {
      score -= 1;
    }
    
    return { variant, score };
  });
  
  // Sort by score (descending) and return the best variant
  scoredVariants.sort((a, b) => b.score - a.score);
  return scoredVariants[0].variant;
};

/**
 * Special brand mappings that should be consistent across the application
 */
export const getSpecialBrandName = (normalizedName: string): string | null => {
  const specialBrandMappings: Record<string, string> = {
    'mcdonalds': 'McDonald\'s',
    'cocacola': 'Coca-Cola',
    'handm': 'H&M',
    'sas': 'SAS',
    'ikea': 'IKEA',
    'bmw': 'BMW',
    'volvo': 'Volvo',
    'tesla': 'Tesla',
    'clarionhotel': 'Clarion Hotel',
    'scandic': 'Scandic',
    'strawberry': 'Strawberry',
    'nordicchoice': 'Nordic Choice',
    'spotify': 'Spotify',
    'netflix': 'Netflix',
    'apple': 'Apple',
    'microsoft': 'Microsoft',
    'google': 'Google',
    'samsung': 'Samsung',
    'amazon': 'Amazon'
  };
  
  return specialBrandMappings[normalizedName] || null;
};
