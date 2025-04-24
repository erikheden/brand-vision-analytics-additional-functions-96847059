
import { useState } from "react";
import SelectionPanel from "@/components/sustainability-shared/SelectionPanel";
import ChartSection from "@/components/ChartSection";
import { normalizeCountry } from "@/components/CountrySelect";
import { Card } from "@/components/ui/card";
import BrandSelection from "@/components/BrandSelection";

const SustainabilityPerception = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // Update handler to only accept a single country
  const handleCountrySelection = (country: string) => {
    // Normalize country code to ensure consistent format
    const normalizedCountry = normalizeCountry(country);
    setSelectedCountry(normalizedCountry);
    // Reset brand selection when changing countries
    setSelectedBrands([]);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b]">Sustainable Brand Index Dashboard</h1>
          
        <SelectionPanel 
          title="Select Country"
          description="Select a country to view sustainability perception."
          selectedCountry={selectedCountry}
          setSelectedCountry={handleCountrySelection}
        />
          
        {selectedCountry && (
          <>
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <BrandSelection 
                brands={[]} 
                selectedBrands={selectedBrands}
                selectedCountries={[selectedCountry]}
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
              selectedCountry={selectedCountry} 
              selectedBrands={selectedBrands} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SustainabilityPerception;
