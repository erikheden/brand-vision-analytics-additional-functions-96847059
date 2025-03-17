
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
    'mcdonald': 'mcdonalds',
    // Adding more Nordic brands that appear in multiple countries
    'finnair': 'finnair',
    'norwegian': 'norwegian', 
    'norwegian air shuttle': 'norwegian',
    'sas': 'sas',
    'scandinavian airlines': 'sas',
    'scandinavian airlines system': 'sas',
    'volvo': 'volvo',
    'nokia': 'nokia',
    'nordea': 'nordea',
    'telia': 'telia',
    'telenor': 'telenor',
    'spotify': 'spotify',
    'lidl': 'lidl',
    'burger king': 'burgerking',
    'burgerking': 'burgerking',
    'adidas': 'adidas',
    'nike': 'nike',
    'subway': 'subway',
    'starbucks': 'starbucks',
    'shell': 'shell',
    'circle k': 'circlek',
    'circlek': 'circlek',
    'apple': 'apple',
    'samsung': 'samsung',
    'google': 'google',
    'microsoft': 'microsoft',
    'amazon': 'amazon',
    'audi': 'audi',
    'bmw': 'bmw',
    'volkswagen': 'volkswagen',
    'vw': 'volkswagen',
    'toyota': 'toyota',
    'netflix': 'netflix',
    'xbox': 'xbox',
    'playstation': 'playstation',
    // Add Zara and similar fashion retailers that might be missing
    'zara': 'zara',
    'zarahome': 'zarahome',
    'zara home': 'zarahome',
    'mango': 'mango',
    'bershka': 'bershka',
    'pull and bear': 'pullandbear',
    'pull & bear': 'pullandbear',
    'pullandbear': 'pullandbear',
    'massimo dutti': 'massimodutti',
    'massimodutti': 'massimodutti',
    'uniqlo': 'uniqlo',
    'cos': 'cos',
    'monki': 'monki',
    'weekday': 'weekday',
    'arket': 'arket',
    'primark': 'primark',
    'gap': 'gap',
    'levis': 'levis',
    'levi strauss': 'levis',
    // Add more banking/financial services
    'dnb': 'dnb',
    'den norske bank': 'dnb',
    'danske bank': 'danskebank',
    'seb': 'seb',
    'skandinaviska enskilda banken': 'seb',
    'handelsbanken': 'handelsbanken',
    'swedbank': 'swedbank',
    'nordea bank': 'nordea',
    // Add more telecom providers
    'telia company': 'telia',
    'telenor group': 'telenor',
    'tele2': 'tele2',
    'three': 'three',
    '3': 'three',
    // Add more retail chains
    'coop': 'coop',
    'ica': 'ica',
    'rema 1000': 'rema1000',
    'rema': 'rema1000',
    'kiwi': 'kiwi',
    'meny': 'meny',
    'spar': 'spar',
    'willys': 'willys',
    'hemköp': 'hemkop',
    'hemkop': 'hemkop',
    'netto': 'netto',
    'aldi': 'aldi',
    'systembolaget': 'systembolaget',
    'vinmonopolet': 'vinmonopolet',
    'alko': 'alko'
  };
  
  // Check if this normalized brand name has a special case mapping
  return specialCases[normalized] || normalized;
};

/**
 * Checks if two brand names likely refer to the same brand
 * Uses multiple strategies including direct match, normalized match, and substring checks
 */
export const areSimilarBrands = (brand1: string, brand2: string): boolean => {
  if (!brand1 || !brand2) return false;
  
  // Direct match (case insensitive)
  if (brand1.toLowerCase() === brand2.toLowerCase()) return true;
  
  // Normalized match
  const normalized1 = normalizeBrandName(brand1);
  const normalized2 = normalizeBrandName(brand2);
  
  if (normalized1 === normalized2) return true;
  
  // One is a substring of the other (helps with "Coca Cola" vs "Coca-Cola Zero")
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    // Additional check: the shorter string should be at least 3 characters 
    // to avoid false positives with very short strings
    const shorterLength = Math.min(normalized1.length, normalized2.length);
    if (shorterLength >= 3) return true;
  }
  
  // Check for common abbreviations and full names
  const abbreviationPairs = [
    ['kfc', 'kentucky fried chicken'],
    ['bmw', 'bayerische motoren werke'],
    ['vw', 'volkswagen'],
    ['h&m', 'hennes and mauritz'],
    ['h and m', 'hennes and mauritz'],
    ['sas', 'scandinavian airlines system'],
    ['sas', 'scandinavian airlines'],
    ['ibm', 'international business machines']
  ];
  
  const lowerBrand1 = brand1.toLowerCase();
  const lowerBrand2 = brand2.toLowerCase();
  
  return abbreviationPairs.some(([abbr, full]) => 
    (lowerBrand1.includes(abbr) && lowerBrand2.includes(full)) || 
    (lowerBrand2.includes(abbr) && lowerBrand1.includes(full))
  );
};

/**
 * Categorizes brand by industry based on common patterns in the name
 * Useful when explicit industry data is missing
 */
export const guessBrandIndustry = (brandName: string): string | null => {
  if (!brandName) return null;
  
  const normalized = brandName.toLowerCase();
  
  // Industry patterns with keywords that strongly indicate an industry
  const industryPatterns = [
    { industry: 'Airlines', keywords: ['airline', 'airways', 'air ', 'flying', 'flight'] },
    { industry: 'Automotive', keywords: ['auto', 'car', 'motors', 'automotive'] },
    { industry: 'Banking & Finance', keywords: ['bank', 'finance', 'financial', 'credit', 'insurance'] },
    { industry: 'Fast Food', keywords: ['burger', 'pizza', 'chicken', 'fries', 'taco', 'fast food'] },
    { industry: 'Retail', keywords: ['store', 'retail', 'mart', 'shop', 'supermarket'] },
    { industry: 'Technology', keywords: ['tech', 'software', 'computer', 'digital', 'electronics'] },
    { industry: 'Telecom', keywords: ['telecom', 'mobile', 'phone', 'wireless', 'network'] },
    { industry: 'Fashion', keywords: ['apparel', 'clothing', 'fashion', 'wear', 'shoes'] }
  ];
  
  // Check for matches against each pattern
  for (const { industry, keywords } of industryPatterns) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return industry;
    }
  }
  
  // Known specific brand mappings
  const brandIndustryMap: Record<string, string> = {
    'ikea': 'Furniture',
    'h&m': 'Fashion',
    'zara': 'Fashion',
    'adidas': 'Sportswear',
    'nike': 'Sportswear',
    'puma': 'Sportswear',
    'coca cola': 'Beverages',
    'pepsi': 'Beverages',
    'mcdonalds': 'Fast Food',
    'burger king': 'Fast Food',
    'kfc': 'Fast Food',
    'apple': 'Technology',
    'microsoft': 'Technology',
    'google': 'Technology',
    'amazon': 'E-commerce',
    'netflix': 'Entertainment',
    'spotify': 'Entertainment',
    'samsung': 'Technology',
    'nokia': 'Technology',
    'volvo': 'Automotive',
    'bmw': 'Automotive',
    'mercedes': 'Automotive',
    'audi': 'Automotive',
    'toyota': 'Automotive',
    'tesla': 'Automotive',
    'shell': 'Energy',
    'bp': 'Energy',
    'hsbc': 'Banking & Finance',
    'barclays': 'Banking & Finance',
    'nordea': 'Banking & Finance',
    'danske bank': 'Banking & Finance',
    'telia': 'Telecom',
    'telenor': 'Telecom',
    'vodafone': 'Telecom',
    'lufthansa': 'Airlines',
    'sas': 'Airlines',
    'finnair': 'Airlines',
    'norwegian': 'Airlines',
    'klm': 'Airlines'
  };
  
  // Check for direct match in our map
  const normalizedForMap = normalizeBrandName(brandName);
  return brandIndustryMap[normalizedForMap] || null;
};

/**
 * Returns common abbreviations and alternate names for a brand
 */
export const getBrandNameVariations = (brandName: string): string[] => {
  if (!brandName) return [];
  
  const normalized = normalizeBrandName(brandName);
  const variations: string[] = [brandName];
  
  // Brand-specific variations based on common alternatives
  const knownVariations: Record<string, string[]> = {
    'cocacola': ['Coca-Cola', 'Coca Cola', 'Coke'],
    'mcdonalds': ['McDonald\'s', 'McDonalds', 'McDonald'],
    'volkswagen': ['Volkswagen', 'VW'],
    'handm': ['H&M', 'H & M', 'Hennes & Mauritz', 'Hennes and Mauritz'],
    'sas': ['SAS', 'Scandinavian Airlines', 'Scandinavian Airlines System'],
    'kentuckyfriedchicken': ['KFC', 'Kentucky Fried Chicken'],
    'kfc': ['KFC', 'Kentucky Fried Chicken'],
    'bmw': ['BMW', 'Bayerische Motoren Werke'],
    'internationalbuisnessmachines': ['IBM', 'International Business Machines'],
    'burgerking': ['Burger King', 'BK']
  };
  
  // Add known variations if they exist
  if (knownVariations[normalized]) {
    variations.push(...knownVariations[normalized]);
  }
  
  // Add common pattern variations
  const trimmed = brandName.trim();
  
  // Add version with "The" prefix if it doesn't already have it
  if (!trimmed.toLowerCase().startsWith('the ')) {
    variations.push(`The ${trimmed}`);
  }
  
  // Remove "The" prefix if it has it
  if (trimmed.toLowerCase().startsWith('the ')) {
    variations.push(trimmed.substring(4));
  }
  
  // Add version with "Group" suffix if it doesn't already have it
  if (!trimmed.toLowerCase().endsWith(' group')) {
    variations.push(`${trimmed} Group`);
  }
  
  // Remove "Group" suffix if it has it
  if (trimmed.toLowerCase().endsWith(' group')) {
    variations.push(trimmed.substring(0, trimmed.length - 6).trim());
  }
  
  // Add versions with common corporate suffixes
  const commonSuffixes = [' Inc', ' Corp', ' Corporation', ' AB', ' AS', ' A/S', ' GmbH', ' Ltd', ' LLC'];
  commonSuffixes.forEach(suffix => {
    variations.push(`${trimmed}${suffix}`);
  });
  
  // Handle ampersand variations
  if (trimmed.includes('&')) {
    variations.push(trimmed.replace(/&/g, 'and'));
  }
  if (trimmed.includes(' and ')) {
    variations.push(trimmed.replace(/ and /g, ' & '));
  }
  
  // Return unique variations only
  return [...new Set(variations)];
};

