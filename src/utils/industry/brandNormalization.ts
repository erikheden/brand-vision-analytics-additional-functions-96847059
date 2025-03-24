
// Add this file if it doesn't exist already.
// This file should contain functions for normalizing brand names.

/**
 * Normalizes a brand name by removing special characters, converting to lowercase, etc.
 */
export const normalizeBrandName = (name: string): string => {
  if (!name) return '';
  
  let normalized = name.toString().trim().toLowerCase();
  
  // Remove special characters except for apostrophes in names like "McDonald's"
  normalized = normalized.replace(/[^\w\s'&-]/g, '');
  
  // Special case replacements
  const specialReplacements: Record<string, string> = {
    'mcdonalds': 'mcdonalds',
    'mcdonald\'s': 'mcdonalds',
    'coca cola': 'cocacola',
    'coca-cola': 'cocacola',
    'h&m': 'hm',
    'h & m': 'hm',
    'the body shop': 'bodyshop',
    'nordic choice': 'nordicchoice',
    'nordisk_choice': 'nordicchoice',
    'nordic-choice': 'nordicchoice',
    'clarion': 'clarionhotel',
    'clarion hotel': 'clarionhotel',
    'strawberry': 'strawberry', // Special handling for Strawberry
    'strawberry hotels': 'strawberry' // Variation of Strawberry
  };
  
  // Check for special replacements
  for (const [key, value] of Object.entries(specialReplacements)) {
    if (normalized === key) {
      return value;
    }
  }
  
  // Remove spaces and multiple consecutive spaces
  normalized = normalized.replace(/\s+/g, '');
  
  return normalized;
};

/**
 * Gets a special brand name for a normalized name if it exists
 */
export const getSpecialBrandName = (normalizedName: string): string | null => {
  const specialBrandMappings: Record<string, string> = {
    'mcdonalds': 'McDonald\'s',
    'cocacola': 'Coca-Cola',
    'hm': 'H&M',
    'bodyshop': 'The Body Shop',
    'nordicchoice': 'Nordic Choice',
    'clarionhotel': 'Clarion Hotel',
    'strawberry': 'Strawberry' // Added special mapping for Strawberry
  };
  
  return specialBrandMappings[normalizedName] || null;
};
