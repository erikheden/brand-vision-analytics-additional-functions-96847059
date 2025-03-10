
import { Card } from "@/components/ui/card";
import CountrySelect from "./CountrySelect";
import BrandSelection from "./BrandSelection";
import IndustryTags from "./IndustryTags";
import { useSelectionData } from "@/hooks/useSelectionData";
import { useSelectionState } from "@/hooks/useSelectionState";

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

  // Get unique brand names from the brands data and ensure they are strings
  const uniqueBrandNames = [...new Set(brands
    .map(item => item.Brand)
    .filter((brand): brand is string => typeof brand === 'string' && brand !== null)
  )].sort();

  return (
    <Card className="p-6 bg-gray-50">
      <div className="space-y-6">
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
