
import { normalizeBrandName, getPreferredBrandName } from "@/utils/industry/normalizeIndustry";

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
      const preferred = getPreferredBrandName(variations, normalizedName);
      console.log(`Brand normalization: ${normalizedName} -> ${preferred} (from options: ${variations.join(', ')})`);
      return preferred;
    })
    .filter(Boolean)
    .sort();
};

/**
 * Ensures important brands are included in the brand list if they exist in the data
 */
export const ensureImportantBrands = (brandNames: string[], availableBrands: any[], selectedCountries: string[]) => {
  const importantBrands = [
    "Zara", "IKEA", "H&M", "McDonald's", "Coca-Cola", 
    "Lidl", "Burger King", "Starbucks", "Adidas", "Nike"
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
      
      // If it's in multiple countries but not in our list, add it
      if (countryCount >= 2 && !brandNames.some(b => normalizeBrandName(b) === normalizedBrand)) {
        console.log(`Ensuring ${brand} is included (found in ${countryCount} countries)`);
        brandNames.push(brand);
      }
    }
  });
  
  return brandNames;
};
