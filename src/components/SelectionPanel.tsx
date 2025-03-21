
import { Card } from "@/components/ui/card";
import CountrySelect from "./CountrySelect";
import BrandSelection from "./BrandSelection";
import IndustryTags from "./IndustryTags";
import { useSelectionData } from "@/hooks/useSelectionData";
import { useSelectionState } from "@/hooks/useSelectionState";
import { ChevronUp } from "lucide-react";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { getPreferredBrandName } from "@/utils/industry/brandSelection";

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
    // Create a map to store normalized brand names
    const normalizedBrands = new Map<string, string[]>();
    
    // Group all brand variations by their normalized name
    brands
      .filter(item => item.Brand && typeof item.Brand === 'string')
      .forEach(item => {
        const brand = item.Brand as string;
        const normalizedBrand = normalizeBrandName(brand);
        
        if (!normalizedBrands.has(normalizedBrand)) {
          normalizedBrands.set(normalizedBrand, []);
        }
        
        // Add this variation if it's not already in the list
        const variations = normalizedBrands.get(normalizedBrand)!;
        if (!variations.includes(brand)) {
          variations.push(brand);
        }
      });
    
    // For each normalized name, get the preferred display version
    const preferredBrandNames = Array.from(normalizedBrands.entries())
      .map(([normalizedName, variations]) => 
        getPreferredBrandName(variations, normalizedName)
      )
      .filter(Boolean)
      .sort();
    
    return preferredBrandNames;
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
              selectedCountries={[selectedCountry]}
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
