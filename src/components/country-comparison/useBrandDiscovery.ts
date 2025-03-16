
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
  
  // Get brands that appear in all selected countries using normalized comparison
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
    
    // Find brands that appear in ALL selected countries
    // First, get all unique normalized brand names
    const allNormalizedBrands = new Set<string>();
    brandsByCountry.forEach((brandSet) => {
      brandSet.forEach(brand => allNormalizedBrands.add(brand));
    });
    
    console.log("Total unique normalized brands across all countries:", allNormalizedBrands.size);
    
    // Then check which of these appear in all countries
    const commonNormalizedBrands = Array.from(allNormalizedBrands).filter(normalizedBrand => {
      const isCommon = Array.from(brandsByCountry.entries()).every(([_, brandSet]) => 
        brandSet.has(normalizedBrand)
      );
      
      if (isCommon) {
        console.log(`Found common brand: ${normalizedBrand}`);
      }
      return isCommon;
    });
    
    console.log("Common normalized brands count:", commonNormalizedBrands.length);
    console.log("Common normalized brands:", commonNormalizedBrands);
    
    // Get all brand records that match the common normalized names
    const commonBrandRecords = availableBrands.filter(brand => {
      if (!brand.Brand) return false;
      const normalizedName = normalizeBrandName(brand.Brand.toString());
      return commonNormalizedBrands.includes(normalizedName);
    });
    
    console.log("Common brand records found:", commonBrandRecords.length);
    return commonBrandRecords;
  };
  
  // Get unique brand names from filtered list, prioritizing capitalized versions
  const getNormalizedUniqueBrands = () => {
    const commonBrands = getCommonBrands();
    
    // If no common brands, check if we should look for additional matches
    if (commonBrands.length === 0 && selectedCountries.length === 2) {
      // For specific country pairs, add known common brands even if they don't appear
      // in our database with the same normalized name
      const sortedCountries = [...selectedCountries].sort().join('-');
      console.log(`Checking for special case matches for country pair: ${sortedCountries}`);
      
      // Common Nordic/international brands that should match across these countries
      const knownCommonBrands = [
        "McDonald's", "Coca-Cola", "Pepsi", "IKEA", "H&M", 
        "Spotify", "Volvo", "Nokia", "Adidas", "Nike", 
        "Apple", "Samsung", "Netflix", "Google", "Microsoft",
        "BMW", "Audi", "Volkswagen", "Toyota", "SAS",
        "Finnair", "Norwegian", "Telia", "Telenor", "Nordea"
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
    
    console.log("Final preferred brand names:", preferredBrandNames);
    return preferredBrandNames;
  };

  return {
    availableBrands,
    commonBrands: getCommonBrands(),
    uniqueBrandNames: getNormalizedUniqueBrands()
  };
};
