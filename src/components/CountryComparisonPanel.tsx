import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSelectionData } from "@/hooks/useSelectionData";
import { getFullCountryName } from "@/components/CountrySelect";
import { X, Globe, CircleCheck } from "lucide-react";
import CountryMultiSelect from "./CountryMultiSelect";
import BrandSelection from "./BrandSelection";
import { normalizeIndustryName, normalizeBrandName } from "@/utils/industry/normalizeIndustry";

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
  
  // Get all brands from all selected countries
  const { brands: availableBrands } = useSelectionData(
    selectedCountries.length > 0 ? selectedCountries : "",
    selectedIndustries
  );
  
  // When countries change, reset selected brands
  useEffect(() => {
    setSelectedBrands([]);
  }, [selectedCountries, setSelectedBrands]);
  
  // Log detailed information about available brands for debugging
  console.log("Available brands:", availableBrands.map(b => ({
    original: b.Brand,
    normalized: b.Brand ? normalizeBrandName(b.Brand) : null,
    country: b.Country
  })));
  
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
    
    // For each brand, add its normalized name to the appropriate country set
    availableBrands.forEach(brand => {
      if (!brand.Brand || !brand.Country) return;
      
      const country = brand.Country;
      if (selectedCountries.includes(country)) {
        const normalizedName = normalizeBrandName(brand.Brand);
        brandsByCountry.get(country)?.add(normalizedName);
      }
    });
    
    // Create a debug log of brands by country
    console.log("Brands by country:", Array.from(brandsByCountry.entries()).map(([country, brands]) => ({
      country,
      brandCount: brands.size,
      sampleBrands: Array.from(brands).slice(0, 5)
    })));
    
    // Find brands that appear in all selected countries
    let commonNormalizedBrands: Set<string> | null = null;
    
    // Iterate through each country's brand set
    for (const [country, brandSet] of brandsByCountry.entries()) {
      if (!commonNormalizedBrands) {
        // First country - start with all its brands
        commonNormalizedBrands = new Set(brandSet);
      } else {
        // Subsequent countries - keep only brands that exist in both sets
        const intersection = new Set<string>();
        for (const brand of commonNormalizedBrands) {
          if (brandSet.has(brand)) {
            intersection.add(brand);
          }
        }
        commonNormalizedBrands = intersection;
      }
    }
    
    console.log("Normalized common brands:", Array.from(commonNormalizedBrands || []));
    
    // Get all brand records that match the common normalized names
    const commonBrandRecords = availableBrands.filter(brand => {
      if (!brand.Brand) return false;
      const normalizedName = normalizeBrandName(brand.Brand);
      return commonNormalizedBrands?.has(normalizedName);
    });
    
    console.log("Common brands found:", commonBrandRecords.length);
    return commonBrandRecords;
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
