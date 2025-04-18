
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useSelectionData } from "@/hooks/useSelectionData";
import CountrySelectionSection from "./country-comparison/CountrySelectionSection";
import BrandSelectionSection from "./country-comparison/BrandSelectionSection";
import { useBrandDiscovery } from "@/hooks/brand-discovery";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import CountryButtonSelect from "@/components/CountryButtonSelect";

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
  
  // Use the hook for brand discovery
  const { uniqueBrandNames: discoveredBrandNames, brandsWithDataInfo } = useBrandDiscovery(selectedCountries, selectedIndustries);
  
  // When countries change, reset selected brands
  useEffect(() => {
    setSelectedBrands([]);
  }, [selectedCountries, setSelectedBrands]);
  
  const handleBrandToggle = (brand: string, checked: boolean) => {
    if (checked) {
      // Check if this brand is already selected with a different capitalization
      const normalizedNewBrand = normalizeBrandName(brand);
      const alreadyExists = selectedBrands.some(
        existingBrand => normalizeBrandName(existingBrand) === normalizedNewBrand
      );
      
      if (!alreadyExists) {
        setSelectedBrands([...selectedBrands, brand]);
      }
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleBatchToggle = (brands: string[], checked: boolean) => {
    if (checked) {
      // Add all the brands that aren't already selected
      const brandsToAdd = brands.filter(brand => {
        const normalizedNewBrand = normalizeBrandName(brand);
        const alreadyExists = selectedBrands.some(
          existingBrand => normalizeBrandName(existingBrand) === normalizedNewBrand
        );
        return !alreadyExists;
      });
      
      if (brandsToAdd.length > 0) {
        setSelectedBrands([...selectedBrands, ...brandsToAdd]);
      }
    } else {
      // Remove all the specified brands
      setSelectedBrands(selectedBrands.filter(brand => 
        !brands.includes(brand)
      ));
    }
  };

  const handleClearBrands = () => {
    setSelectedBrands([]);
  };
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <CountryButtonSelect
          countries={countries || []}
          selectedCountries={selectedCountries}
          onCountryChange={(country) => {
            if (selectedCountries.includes(country)) {
              setSelectedCountries(selectedCountries.filter(c => c !== country));
            } else {
              setSelectedCountries([...selectedCountries, country]);
            }
          }}
        />
        
        {selectedCountries.length > 0 && (
          <BrandSelectionSection
            uniqueBrandNames={discoveredBrandNames}
            selectedBrands={selectedBrands}
            selectedCountries={selectedCountries}
            brandsWithDataInfo={brandsWithDataInfo}
            onBrandToggle={handleBrandToggle}
            onBatchToggle={handleBatchToggle}
            onClearBrands={handleClearBrands}
          />
        )}
      </div>
    </Card>
  );
};

export default CountryComparisonPanel;
