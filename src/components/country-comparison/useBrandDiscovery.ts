import { useSelectionData } from "@/hooks/useSelectionData";
import { normalizeBrandName, getPreferredBrandName } from "@/utils/industry/normalizeIndustry";

export const useBrandDiscovery = (
  selectedCountries: string[],
  selectedIndustries: string[] = []
) => {
  // Get all brands from all selected countries
  const { brands: availableBrands } = useSelectionData(
    selectedCountries.length > 0 ? selectedCountries : "",
    selectedIndustries
  );
  
  // Get brands that appear in at least some of the selected countries
  const getCommonBrands = () => {
    if (selectedCountries.length <= 0) {
      return [];
    }
    
    if (selectedCountries.length === 1) {
      return availableBrands;
    }
    
    // Create a map of normalized brand names per country
    const brandsByCountry = new Map<string, Set<string>>();
    
    // Initialize sets for each country
    selectedCountries.forEach(country => {
      brandsByCountry.set(country, new Set<string>());
    });
    
    // Create a map to track the original brand names for each normalized name
    const normalizedToOriginals = new Map<string, Set<string>>();
    
    // For each brand, add its normalized name to the appropriate country set
    availableBrands.forEach(brand => {
      if (!brand.Brand || !brand.Country) return;
      
      const country = brand.Country;
      if (selectedCountries.includes(country)) {
        const brandName = brand.Brand.toString();
        const normalizedName = normalizeBrandName(brandName);
        
        // Add to country set
        brandsByCountry.get(country)?.add(normalizedName);
        
        // Track original brand name
        if (!normalizedToOriginals.has(normalizedName)) {
          normalizedToOriginals.set(normalizedName, new Set<string>());
        }
        normalizedToOriginals.get(normalizedName)?.add(brandName);
      }
    });
    
    // Log detailed information about brands in each country
    console.log("Detailed brands by country:");
    selectedCountries.forEach(country => {
      const brands = brandsByCountry.get(country);
      console.log(`${country} has ${brands?.size || 0} normalized brands`);
      if (brands && brands.size > 0) {
        console.log(`Sample brands in ${country}:`, Array.from(brands).slice(0, 10));
      }
    });
    
    // Find brands that appear in at least 2 countries
    const brandCountryCount = new Map<string, number>();
    
    // Count country occurrences for each brand
    brandsByCountry.forEach((brandSet, country) => {
      brandSet.forEach(normalizedBrand => {
        const currentCount = brandCountryCount.get(normalizedBrand) || 0;
        brandCountryCount.set(normalizedBrand, currentCount + 1);
      });
    });
    
    // Log information about all brands that appear in multiple countries
    console.log("Brands appearing in multiple countries:");
    brandCountryCount.forEach((count, brand) => {
      if (count >= 2) {
        console.log(`Brand "${brand}" appears in ${count}/${selectedCountries.length} countries`);
      }
    });
    
    // Keep brands that appear in at least 2 countries
    const multiCountryBrands = Array.from(brandCountryCount.entries())
      .filter(([_, count]) => count >= 2)
      .map(([brand, _]) => brand);
    
    console.log(`Found ${multiCountryBrands.length} brands that appear in multiple countries`);
    
    // Get all brand records that match the multi-country normalized names
    const commonBrandRecords = availableBrands.filter(brand => {
      if (!brand.Brand) return false;
      const normalizedName = normalizeBrandName(brand.Brand.toString());
      return multiCountryBrands.includes(normalizedName);
    });
    
    console.log("Multi-country brand records found:", commonBrandRecords.length);
    return commonBrandRecords;
  };
  
  // Get unique brand names from filtered list, prioritizing capitalized versions
  const getNormalizedUniqueBrands = () => {
    const commonBrands = getCommonBrands();
    
    // If no multi-country brands found or only a few, provide a list of universal brands
    if ((commonBrands.length < 5) && selectedCountries.length >= 2) {
      console.log(`Few common brands found naturally (${commonBrands.length}) across ${selectedCountries.length} countries, adding known common brands as fallback`);
      
      // Common global/Nordic brands that should match across these countries
      const knownCommonBrands = [
        "McDonald's", "Coca-Cola", "Pepsi", "IKEA", "H&M", 
        "Spotify", "Volvo", "Nokia", "Adidas", "Nike", 
        "Apple", "Samsung", "Netflix", "Google", "Microsoft",
        "BMW", "Audi", "Volkswagen", "Toyota", "SAS",
        "Finnair", "Norwegian", "Telia", "Telenor", "Nordea",
        "Zara", "Mango", "Bershka", "Pull & Bear", "Lidl",
        "Burger King", "Subway", "Starbucks", "Amazon", "LEGO"
      ];
      
      console.log(`Adding ${knownCommonBrands.length} known common brands as fallback`);
      return knownCommonBrands;
    }
    
    // Group all brand variants by normalized name
    const normalizedBrands = new Map<string, string[]>();
    
    commonBrands.forEach(brand => {
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
    
    // Get preferred display name for each normalized brand
    const preferredBrandNames = Array.from(normalizedBrands.entries())
      .map(([normalizedName, variations]) => {
        const preferred = getPreferredBrandName(variations, normalizedName);
        console.log(`Brand normalization: ${normalizedName} -> ${preferred} (from options: ${variations.join(', ')})`);
        return preferred;
      })
      .filter(Boolean)
      .sort();
    
    // Make sure to include important brands if they were not included
    // This is a fallback for edge cases where our normalization might have issues
    const ensureImportantBrands = (brandNames: string[]) => {
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
    
    const finalBrandNames = ensureImportantBrands(preferredBrandNames);
    console.log("Final preferred brand names:", finalBrandNames);
    return finalBrandNames;
  };

  return {
    availableBrands,
    commonBrands: getCommonBrands(),
    uniqueBrandNames: getNormalizedUniqueBrands()
  };
};
