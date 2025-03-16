
/**
 * Common global/Nordic brands for fallback when not enough common brands are found
 */
export const knownCommonBrands = [
  "McDonald's", "Coca-Cola", "Pepsi", "IKEA", "H&M", 
  "Spotify", "Volvo", "Nokia", "Adidas", "Nike", 
  "Apple", "Samsung", "Netflix", "Google", "Microsoft",
  "BMW", "Audi", "Volkswagen", "Toyota", "SAS",
  "Finnair", "Norwegian", "Telia", "Telenor", "Nordea",
  "Zara", "Mango", "Lidl", "Burger King", "Subway", 
  "Starbucks", "Amazon", "LEGO"
];

/**
 * List of brands known to have data issues in some countries
 */
export const knownProblematicBrands = ["Bershka", "Pull & Bear"];

/**
 * List of brands known to be present across most Nordic countries 
 * These will be assumed to have data even if our initial check fails
 */
export const knownGlobalBrands = [
  "Coca-Cola", "H&M", "IKEA", "Volvo", "Nike", "Adidas", 
  "McDonald's", "Apple", "Samsung", "Google", "Microsoft"
];

/**
 * Provides a fallback list of common brands when not enough naturally common brands
 * are found across the selected countries
 */
export const getFallbackBrands = (commonBrandsCount: number, selectedCountriesCount: number) => {
  // Lower the threshold for fallback brands to ensure we always have options
  // If fewer than 10 common brands found, use the fallback list
  if ((commonBrandsCount < 10) && selectedCountriesCount >= 2) {
    console.log(`Few common brands found naturally (${commonBrandsCount}) across ${selectedCountriesCount} countries, adding known common brands as fallback`);
    console.log(`Adding ${knownCommonBrands.length} known common brands as fallback`);
    
    // Filter out problematic brands
    return knownCommonBrands.filter(brand => !knownProblematicBrands.includes(brand));
  }
  
  return null; // No fallback needed
};
