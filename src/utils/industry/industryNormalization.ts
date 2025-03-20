
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
    .toLowerCase(); // Make case-insensitive - ensure this is the last operation
};
