import { normalizeBrandName, getSpecialBrandName } from "@/utils/industry/brandNormalization";
import { getPreferredBrandName } from "@/utils/industry/brandSelection";

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
      
      // Otherwise use the preferred brand name
      const preferred = getPreferredBrandName(variations, normalizedName);
      return preferred;
    })
    .filter(Boolean)
    .sort();
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
