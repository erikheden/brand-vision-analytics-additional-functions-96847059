
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSelectionData } from "@/hooks/useSelectionData";
import { getFullCountryName } from "@/components/CountrySelect";
import { X, Globe, CircleCheck } from "lucide-react";
import CountryMultiSelect from "./CountryMultiSelect";
import BrandSelection from "./BrandSelection";
import { normalizeIndustryName } from "@/utils/industry/normalizeIndustry";

interface CountryComparisonPanelProps {
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

const CountryComparisonPanel = ({
  selectedCountries,
  setSelectedCountries,
  selectedBrands,
  setSelectedBrands
}: CountryComparisonPanelProps) => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  
  // Get all available countries
  const { countries } = useSelectionData("", []);
  
  // Get common brands that appear in all selected countries
  const { brands: availableBrands } = useSelectionData(
    selectedCountries.length === 1 ? selectedCountries[0] : "",
    selectedIndustries
  );
  
  // When countries change, reset selected brands
  useEffect(() => {
    setSelectedBrands([]);
  }, [selectedCountries, setSelectedBrands]);
  
  // Improved brand name normalization for comparison
  const normalizeBrandName = (brandName: string): string => {
    if (!brandName) return '';
    
    // More aggressive normalization
    return brandName
      .trim()
      .replace(/\s*\([A-Z]{1,3}\)\s*$/i, '') // Remove country codes in parentheses at the end
      .replace(/\s+-\s+[A-Z]{1,3}\s*$/i, '') // Remove formats like "- SE" at the end
      .replace(/\s+/g, ' ') // Normalize whitespace
      .toLowerCase(); // Case insensitive comparison
  };
  
  console.log("Available brands:", availableBrands.map(b => ({
    original: b.Brand,
    normalized: b.Brand ? normalizeBrandName(b.Brand) : null
  })));
  
  // Get brands that appear in all selected countries using normalized comparison
  const getCommonBrands = () => {
    if (selectedCountries.length <= 1) {
      return availableBrands;
    }
    
    // First, create a map of normalized brand names to their original forms for each country
    const brandsByCountry = new Map<string, Map<string, string[]>>();
    
    // Initialize maps for each country
    selectedCountries.forEach(country => {
      brandsByCountry.set(country, new Map<string, string[]>());
    });
    
    // Populate the maps with normalized brand names
    availableBrands.forEach(brand => {
      if (!brand.Brand || !brand.Country) return;
      
      const normalizedName = normalizeBrandName(brand.Brand);
      const country = brand.Country;
      
      if (selectedCountries.includes(country)) {
        const countryBrands = brandsByCountry.get(country);
        if (countryBrands) {
          if (!countryBrands.has(normalizedName)) {
            countryBrands.set(normalizedName, []);
          }
          countryBrands.get(normalizedName)?.push(brand.Brand);
        }
      }
    });
    
    console.log("Brands by country:", Array.from(brandsByCountry.entries()).map(([country, brands]) => ({
      country,
      brandCount: brands.size,
      sampleBrands: Array.from(brands.keys()).slice(0, 5)
    })));
    
    // Find normalized brand names that exist in all countries
    const normalizedCommonBrands = new Set<string>();
    
    // Start with brands from the first country
    const firstCountry = selectedCountries[0];
    const firstCountryBrands = brandsByCountry.get(firstCountry);
    
    if (firstCountryBrands) {
      // For each brand in the first country
      firstCountryBrands.forEach((originalNames, normalizedName) => {
        // Check if this normalized brand exists in all other countries
        const existsInAllCountries = selectedCountries.every(country => {
          const countryBrands = brandsByCountry.get(country);
          return countryBrands?.has(normalizedName);
        });
        
        if (existsInAllCountries) {
          normalizedCommonBrands.add(normalizedName);
        }
      });
    }
    
    console.log("Normalized common brands:", Array.from(normalizedCommonBrands));
    
    // Now, for each common normalized brand, find all matching brands
    const result = availableBrands.filter(brand => {
      if (!brand.Brand) return false;
      
      const normalizedName = normalizeBrandName(brand.Brand);
      return normalizedCommonBrands.has(normalizedName);
    });
    
    console.log("Common brands found:", result.length);
    return result;
  };
  
  // Get common brands across countries
  const commonBrands = getCommonBrands();
  
  // Get unique brand names from the filtered list
  // For each normalized brand, pick one representative brand name to display
  const getNormalizedUniqueBrands = () => {
    const brandMap = new Map<string, string>();
    
    commonBrands.forEach(brand => {
      if (!brand.Brand) return;
      
      const normalizedName = normalizeBrandName(brand.Brand);
      
      // If we haven't seen this normalized brand yet, or the current name is shorter
      // (preference for simpler names without country codes)
      if (!brandMap.has(normalizedName) || brand.Brand.length < brandMap.get(normalizedName)!.length) {
        brandMap.set(normalizedName, brand.Brand);
      }
    });
    
    return Array.from(brandMap.values()).sort();
  };
  
  const uniqueBrandNames = getNormalizedUniqueBrands();
  
  const handleBrandToggle = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleClearBrands = () => {
    setSelectedBrands([]);
  };
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2 text-[#34502b]">
            <Globe className="h-5 w-5" />
            Select Countries to Compare
          </h3>
          
          <CountryMultiSelect
            countries={countries}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
          />
          
          {selectedCountries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCountries.map((country) => (
                <Badge 
                  key={country} 
                  className="bg-[#34502b]/10 text-[#34502b] hover:bg-[#34502b]/20 px-3 py-1"
                >
                  {getFullCountryName(country)}
                  <button 
                    className="ml-2 hover:text-[#34502b]"
                    onClick={() => setSelectedCountries(selectedCountries.filter(c => c !== country))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedCountries.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-[#34502b]/70 hover:text-[#34502b]"
                  onClick={() => setSelectedCountries([])}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
        
        {selectedCountries.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2 text-[#34502b]">
              <CircleCheck className="h-5 w-5" />
              Select Brands to Compare
            </h3>
            <div className="mt-2">
              <BrandSelection
                brands={uniqueBrandNames}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                onClearBrands={handleClearBrands}
              />
            </div>
            {selectedCountries.length > 1 && uniqueBrandNames.length === 0 && (
              <div className="text-amber-600 bg-amber-50 p-3 rounded-md text-sm mt-2">
                No common brands found across the selected countries. Try different country combinations.
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CountryComparisonPanel;
