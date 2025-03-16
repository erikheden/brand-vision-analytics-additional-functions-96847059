
import { Card } from "@/components/ui/card";
import CountrySelect from "./CountrySelect";
import BrandSelection from "./BrandSelection";
import IndustryTags from "./IndustryTags";
import { useSelectionData } from "@/hooks/useSelectionData";
import { useSelectionState } from "@/hooks/useSelectionState";
import { ChevronUp } from "lucide-react";

interface SelectionPanelProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

const SelectionPanel = ({
  selectedCountry,
  setSelectedCountry,
  selectedBrands,
  setSelectedBrands,
}: SelectionPanelProps) => {
  const { selectedIndustry, setSelectedIndustry, handleIndustryToggle } = 
    useSelectionState(setSelectedBrands);
  
  const { countries, industries, brands } = 
    useSelectionData(selectedCountry, [selectedIndustry].filter(Boolean));

  const handleClearBrands = () => {
    setSelectedBrands([]);
    setSelectedIndustry("");
  };

  const handleBrandToggle = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  // Deduplicate brand names with preference for capitalized versions
  const getUniquePreferredBrands = () => {
    // Create a map to store best version of each brand by normalized name
    const brandMap = new Map<string, string>();
    
    brands
      .filter(item => item.Brand && typeof item.Brand === 'string')
      .forEach(item => {
        const brand = item.Brand as string;
        const normalizedBrand = brand.toLowerCase();
        
        // If we haven't seen this brand before, or the current version has uppercase first letter 
        // while the stored one doesn't, update the map
        if (!brandMap.has(normalizedBrand) || 
            (brand.charAt(0) === brand.charAt(0).toUpperCase() && 
             brandMap.get(normalizedBrand)?.charAt(0) !== brandMap.get(normalizedBrand)?.charAt(0)?.toUpperCase())) {
          brandMap.set(normalizedBrand, brand);
        }
      });
    
    // Return the array of preferred brand names
    return Array.from(brandMap.values()).sort();
  };

  const uniqueBrandNames = getUniquePreferredBrands();

  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <CountrySelect
            selectedCountry={selectedCountry}
            countries={countries}
            onCountryChange={(country) => {
              console.log("Country changed to:", country);
              setSelectedCountry(country);
              setSelectedBrands([]);
              setSelectedIndustry("");
            }}
          />
          {!selectedCountry && (
            <div className="flex items-center justify-center mt-2 text-[#34502b] animate-bounce">
              <ChevronUp className="h-5 w-5" />
              <span className="ml-2 font-medium">Start by selecting a country</span>
            </div>
          )}
        </div>

        {selectedCountry && (
          <>
            <IndustryTags
              industries={industries}
              selectedIndustry={selectedIndustry}
              onIndustryToggle={(industry) => {
                console.log("Industry toggled:", industry);
                handleIndustryToggle(industry, brands);
              }}
            />
            <BrandSelection
              brands={uniqueBrandNames}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              onClearBrands={handleClearBrands}
            />
          </>
        )}
      </div>
    </Card>
  );
};

export default SelectionPanel;
