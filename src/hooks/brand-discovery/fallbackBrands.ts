
/**
 * Provides fallback brands for when no common brands are found
 */

// Known brands that are problematic or should be excluded
export const knownProblematicBrands = [
  "Industry average",
  "Unknown",
  "Not specified",
  "Not Available",
  "N/A"
];

// List of well-known global brands that exist in many countries
export const knownGlobalBrands = [
  "McDonald's",
  "Coca-Cola",
  "Nike",
  "Adidas",
  "IKEA",
  "H&M",
  "Apple",
  "Samsung",
  "Amazon",
  "Google",
  "Microsoft",
  "Zara",
  "Netflix",
  "Spotify",
  "Tesla",
  "BMW",
  "Audi",
  "Toyota",
  "Volvo",
  "Lidl",
  "Burger King",
  "KFC",
  "Subway",
  "Starbucks",
  "Shell",
  "Visa",
  "Mastercard",
  "Clarion Hotel",
  "Scandic",
  "Strawberry",
  "Nordic Choice",
  "Finnair",
  "SAS",
  "Norwegian",
  "Telia",
  "Telenor",
  "Ericsson",
  "Nokia",
  "Siemens",
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "Philips",
  "LG",
  "Sony",
  "Panasonic",
  "Canon",
  "Nikon",
  "Bosch",
  "Electrolux",
  "Miele"
];

/**
 * Get fallback brands to use when no common brands are found
 * Ensures that we always have some brands to show
 */
export const getFallbackBrands = (commonBrandsCount: number, countryCount: number): string[] | null => {
  // If we have fewer than 20 common brands and at least 2 countries, use fallback list
  if (commonBrandsCount < 20 && countryCount >= 2) {
    console.log("Using fallback brands due to insufficient common brands");
    return knownGlobalBrands;
  }
  
  return null;
};
