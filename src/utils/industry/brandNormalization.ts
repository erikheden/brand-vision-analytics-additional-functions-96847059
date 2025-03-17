
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
