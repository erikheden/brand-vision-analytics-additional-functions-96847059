
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSelectionData } from "@/hooks/useSelectionData";
import { getFullCountryName } from "@/components/CountrySelect";
import { X, Globe, CircleCheck } from "lucide-react";
import CountryMultiSelect from "./CountryMultiSelect";
import BrandSelection from "./BrandSelection";

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
  
  // Get brands that appear in all selected countries
  const commonBrands = selectedCountries.length > 1 
    ? availableBrands.filter(brand => 
        selectedCountries.every(country => 
          availableBrands.some(b => 
            b.Brand === brand.Brand && b.Country === country
          )
        )
      )
    : availableBrands;
  
  // Get unique brand names from the filtered list - fix the type error
  const uniqueBrandNames = [...new Set(commonBrands.map(brand => brand.Brand))]
    .filter(Boolean) as string[];
  
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
                brands={commonBrands}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedIndustries={selectedIndustries}
                setSelectedIndustries={setSelectedIndustries}
                uniqueBrandNames={uniqueBrandNames}
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
