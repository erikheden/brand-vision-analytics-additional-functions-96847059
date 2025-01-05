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
    useSelectionData(selectedCountry, [selectedIndustry]);

  const handleClearBrands = () => {
    setSelectedBrands([]);
  };

  const handleBrandToggle = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  // Get unique brand names from the brands data
  const uniqueBrandNames = [...new Set(brands.map(item => item.Brand))].sort();

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <CountrySelect
          selectedCountry={selectedCountry}
          countries={countries}
          onCountryChange={(country) => {
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
              onIndustryToggle={(industry) => handleIndustryToggle(industry, brands)}
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