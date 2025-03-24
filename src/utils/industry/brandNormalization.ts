
/**
 * Normalizes a brand name by removing special characters, converting to lowercase, etc.
 */
export const normalizeBrandName = (name: string): string => {
  if (!name) return '';
  
  // Standardize the input first
  let normalized = name.toString().trim().toLowerCase();
  
  // Special case replacements - direct mapping table for known variants
  const specialCases: Record<string, string> = {
    'mcdonalds': 'mcdonalds',
    'mcdonald\'s': 'mcdonalds',
    'coca cola': 'cocacola',
    'coca-cola': 'cocacola',
    'h&m': 'hm',
    'h & m': 'hm',
    'the body shop': 'bodyshop',
    'nordic choice': 'nordicchoice',
    'scandic hotel': 'scandic',
    'scandic hotels': 'scandic',
    'clarion': 'clarionhotel',
    'clarion hotel': 'clarionhotel',
    'strawberry': 'strawberry', 
    'strawberry hotels': 'strawberry',
    'strawberry hotels & resorts': 'strawberry',
    'strawberry hospitality': 'strawberry',
    'strawberry group': 'strawberry',
    'ikea': 'ikea',
    'volvo': 'volvo',
    'volvo cars': 'volvo',
    'volkswagen': 'volkswagen',
    'vw': 'volkswagen',
    'bmw': 'bmw',
    'mercedes': 'mercedes',
    'mercedes-benz': 'mercedes',
    'tesla': 'tesla',
    'tesla motors': 'tesla',
    'apple': 'apple'
  };
  
  // Check for direct matches in our special cases map
  if (specialCases[normalized]) {
    return specialCases[normalized];
  }
  
  // Handle partial matches for some tricky names
  if (normalized.includes('mcdonald')) return 'mcdonalds';
  if (normalized.includes('coca') && normalized.includes('cola')) return 'cocacola';
  if (normalized.includes('strawberry')) return 'strawberry';
  if (normalized.includes('clarion')) return 'clarionhotel';
  if (normalized.includes('nordic') && normalized.includes('choice')) return 'nordicchoice';
  
  // Remove special characters except apostrophes and spaces for now
  normalized = normalized.replace(/[^\w\s']/g, '');
  
  // Remove spaces and multiple consecutive spaces
  normalized = normalized.replace(/\s+/g, '');
  
  return normalized;
};

/**
 * Gets a standardized brand name for display purposes
 */
export const getSpecialBrandName = (normalizedName: string): string | null => {
  const specialBrandMappings: Record<string, string> = {
    'mcdonalds': 'McDonald\'s',
    'cocacola': 'Coca-Cola',
    'hm': 'H&M',
    'bodyshop': 'The Body Shop',
    'nordicchoice': 'Nordic Choice',
    'clarionhotel': 'Clarion Hotel',
    'strawberry': 'Strawberry',
    'ikea': 'IKEA',
    'volvo': 'Volvo',
    'volkswagen': 'Volkswagen',
    'bmw': 'BMW',
    'mercedes': 'Mercedes-Benz',
    'tesla': 'Tesla',
    'apple': 'Apple'
  };
  
  return specialBrandMappings[normalizedName] || null;
};
