
import { useState } from "react";
import SelectionPanel from "@/components/sustainability-shared/SelectionPanel";
import ChartSection from "@/components/ChartSection";
import { normalizeCountry } from "@/components/CountrySelect";
import { Card } from "@/components/ui/card";
import BrandSelection from "@/components/BrandSelection";

const SustainabilityPerception = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // Add a handler that normalizes country codes
  const handleCountrySelection = (countries: string[]) => {
    // Normalize all country codes to ensure consistent format
    const normalizedCountries = countries.map(country => normalizeCountry(country));
    setSelectedCountries(normalizedCountries);
    // Reset brand selection when changing countries
    setSelectedBrands([]);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b]">Sustainable Brand Index Dashboard</h1>
          
        <SelectionPanel 
          title="Select Countries"
          description="Select one or more countries to view sustainability perception."
          selectedCountries={selectedCountries}
          setSelectedCountries={handleCountrySelection}
        />
          
        {selectedCountries.length > 0 && (
          <>
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <BrandSelection 
                brands={[]} 
                selectedBrands={selectedBrands}
                selectedCountries={selectedCountries}
                onBrandToggle={(brand, checked) => {
                  if (checked) {
                    setSelectedBrands(prev => [...prev, brand]);
                  } else {
                    setSelectedBrands(prev => prev.filter(b => b !== brand));
                  }
                }}
                onBatchToggle={(brands, checked) => {
                  if (checked) {
                    setSelectedBrands(prev => [...prev, ...brands.filter(b => !prev.includes(b))]);
                  } else {
                    setSelectedBrands(prev => prev.filter(b => !brands.includes(b)));
                  }
                }}
                onClearBrands={() => setSelectedBrands([])}
              />
            </Card>

            <ChartSection 
              selectedCountry={selectedCountries[0]} 
              selectedBrands={selectedBrands} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SustainabilityPerception;
