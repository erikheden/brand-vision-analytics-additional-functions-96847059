import { normalizeBrandName, getSpecialBrandName } from "@/utils/industry/brandNormalization";

/**
 * Groups all brand variants by normalized name
 */
export const groupBrandsByNormalizedName = (brands: any[]) => {
  // Group all brand variants by normalized name
  const normalizedBrands = new Map<string, string[]>();
  
  brands.forEach(brand => {
    if (!brand.Brand) return;
    
    const normalizedName = normalizeBrandName(brand.Brand.toString());
    
    if (!normalizedBrands.has(normalizedName)) {
      normalizedBrands.set(normalizedName, []);
    }
    
    const variations = normalizedBrands.get(normalizedName)!;
    const brandName = brand.Brand.toString();
    
    if (!variations.includes(brandName)) {
      variations.push(brandName);
    }
  });
  
  return normalizedBrands;
};

/**
 * Get preferred display names for a set of normalized brands
 */
export const getPreferredBrandNames = (normalizedBrands: Map<string, string[]>) => {
  return Array.from(normalizedBrands.entries())
    .map(([normalizedName, variations]) => {
      // First check if there's a special brand name mapping
      const specialBrand = getSpecialBrandName(normalizedName);
      if (specialBrand) {
        return specialBrand;
      }
      
      // Otherwise use our own logic to determine the best name
      const bestName = selectBestBrandName(variations);
      return bestName;
    })
    .filter(Boolean)
    .sort();
};

/**
 * Selects the best brand name from a list of variations
 */
const selectBestBrandName = (variations: string[]): string => {
  if (variations.length === 0) return '';
  if (variations.length === 1) return variations[0];
  
  // Score each variation based on capitalization, etc.
  const scoredVariations = variations.map(name => {
    let score = 0;
    
    // Prefer capitalized first letters
    if (name.charAt(0) === name.charAt(0).toUpperCase()) {
      score += 2;
    }
    
    // Prefer names with spaces over no spaces
    if (name.includes(' ')) {
      score += 1;
    }
    
    // Prefer names with apostrophes (e.g., "McDonald's" over "McDonalds")
    if (name.includes("'")) {
      score += 1;
    }
    
    // Penalize all uppercase or all lowercase
    if (name === name.toUpperCase() || name === name.toLowerCase()) {
      score -= 1;
    }
    
    return { name, score };
  });
  
  // Sort by score (highest first)
  scoredVariations.sort((a, b) => b.score - a.score);
  
  // Return the best scoring name
  return scoredVariations[0].name;
};

/**
 * Ensures important brands are included in the brand list if they exist in the data
 */
export const ensureImportantBrands = (brandNames: string[], availableBrands: any[], selectedCountries: string[]) => {
  // Important brands to ensure are included
  const importantBrands = [
    "Tesla", "Clarion Hotel", "Strawberry", "Nordic Choice", "Scandic",
    "Zara", "IKEA", "H&M", "McDonald's", "Coca-Cola", 
    "Lidl", "Burger King", "Starbucks", "Adidas", "Nike",
    "SAS", "Finnair", "Norwegian", "Telia", "Telenor",
    "BMW", "Audi", "Toyota", "Volvo"
  ];
  
  importantBrands.forEach(brand => {
    const normalizedBrand = normalizeBrandName(brand);
    
    // Check if the brand exists in our data for any of the selected countries
    const brandExists = availableBrands.some(
      item => item.Brand && normalizeBrandName(item.Brand.toString()) === normalizedBrand
    );
    
    // Check if it appears in multiple countries
    if (brandExists) {
      const countryCount = selectedCountries.reduce((count, country) => {
        const hasInCountry = availableBrands.some(
          item => item.Country === country && 
                 item.Brand && 
                 normalizeBrandName(item.Brand.toString()) === normalizedBrand
        );
        return hasInCountry ? count + 1 : count;
      }, 0);
      
      // If it's in at least one country but not in our list, add it
      if (countryCount >= 1 && !brandNames.some(b => normalizeBrandName(b) === normalizedBrand)) {
        console.log(`Ensuring ${brand} is included (found in ${countryCount} countries)`);
        brandNames.push(brand);
      }
    }
  });
  
  return brandNames;
};
