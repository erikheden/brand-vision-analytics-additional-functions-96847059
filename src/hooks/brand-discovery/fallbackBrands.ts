
/**
 * Common global/Nordic brands for fallback when not enough common brands are found
 */
export const knownCommonBrands = [
  "McDonald's", "Coca-Cola", "Pepsi", "IKEA", "H&M", 
  "Spotify", "Volvo", "Nokia", "Adidas", "Nike", 
  "Apple", "Samsung", "Netflix", "Google", "Microsoft",
  "BMW", "Audi", "Volkswagen", "Toyota", "SAS",
  "Finnair", "Norwegian", "Telia", "Telenor", "Nordea",
  "Zara", "Mango", "Bershka", "Pull & Bear", "Lidl",
  "Burger King", "Subway", "Starbucks", "Amazon", "LEGO"
];

/**
 * Provides a fallback list of common brands when not enough naturally common brands
 * are found across the selected countries
 */
export const getFallbackBrands = (commonBrandsCount: number, selectedCountriesCount: number) => {
  // Lower the threshold for fallback brands to ensure we always have options
  // If fewer than 5 common brands found, use the fallback list
  if ((commonBrandsCount < 5) && selectedCountriesCount >= 2) {
    console.log(`Few common brands found naturally (${commonBrandsCount}) across ${selectedCountriesCount} countries, adding known common brands as fallback`);
    console.log(`Adding ${knownCommonBrands.length} known common brands as fallback`);
    return knownCommonBrands;
  }
  
  return null; // No fallback needed
};
