
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

/**
 * Generates case variations of a brand name
 */
export const generateCaseVariations = (brandName: string): string[] => {
  return [
    brandName.toLowerCase(),
    brandName.toUpperCase(),
    brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase(), // Title Case
  ].filter(variation => variation !== brandName); // Skip if same as original
};

/**
 * Generates naming variations for a brand (Company name variations)
 */
export const generateNameVariations = (brandName: string): string[] => {
  const variations = [
    // Company name variations
    brandName + " Group",
    brandName + " Inc",
    brandName + " Corporation",
    brandName + " AB",
    brandName + " Co",
    brandName + " & Co",
    brandName + " AS",
    brandName + " A/S",
    brandName + " GmbH",
    brandName + " International",
    brandName + " Stores",
    brandName + " Retail",
    // Brand name variants
    brandName.replace('&', 'and'),
    brandName.replace('and', '&'),
    brandName.replace(/-/g, ' '),
    brandName.replace(/\s+/g, '-'),
    brandName.replace(/\./g, ''),
    brandName.replace(/\s+/g, '')
  ];
  
  return variations;
};

/**
 * Generates variations without common company suffixes
 */
export const generateBaseNameVariations = (brandName: string): string[] => {
  return [
    brandName.replace(/ Group$/, ''),
    brandName.replace(/ Inc$/, ''),
    brandName.replace(/ Corporation$/, ''),
    brandName.replace(/ AB$/, ''),
    brandName.replace(/ Co$/, ''),
    brandName.replace(/ & Co$/, ''),
    brandName.replace(/ AS$/, ''),
    brandName.replace(/ A\/S$/, ''),
    brandName.replace(/ GmbH$/, ''),
    brandName.replace(/ International$/, ''),
    brandName.replace(/ Stores$/, ''),
    brandName.replace(/ Retail$/, '')
  ].filter(variation => variation !== brandName);
};

/**
 * Known brand mappings for special cases
 */
export const specialBrandMappings: Record<string, string[]> = {
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

/**
 * Get special brand mappings for a specific brand
 */
export const getSpecialBrandMappings = (selectedBrand: string): string[] => {
  const normalizedSelectedBrand = normalizeBrandName(selectedBrand);
  
  for (const [brandKey, alternateNames] of Object.entries(specialBrandMappings)) {
    const normalizedKey = normalizeBrandName(brandKey);
    
    if (normalizedKey === normalizedSelectedBrand) {
      return alternateNames;
    }
  }
  
  return [];
};
