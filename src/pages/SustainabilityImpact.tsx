
import React from "react";
import ImpactCategoriesContent from "@/components/materiality-areas/ImpactCategoriesContent";
import { Card } from "@/components/ui/card";
import { useSelectionData } from "@/hooks/useSelectionData";
import { normalizeCountry } from "@/components/CountrySelect";
import CountryButtonSelect from "@/components/CountryButtonSelect";

const SustainabilityImpact = () => {
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const { countries } = useSelectionData("", []);
  
  const handleCountryChange = (country: string) => {
    const normalizedCountry = normalizeCountry(country);
    
    setSelectedCountries(current => 
      current.includes(normalizedCountry)
        ? current.filter(c => c !== normalizedCountry)
        : [...current, normalizedCountry]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-[#34502b] mb-6">Sustainability Impact Categories</h1>
        
        <div className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-6">
          <p className="text-gray-600">
            Compare sustainability impacts across different categories and years. Select multiple categories to see how they compare, and filter by impact level to focus on specific aspects.
          </p>
        </div>
        
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <p className="text-gray-600 text-sm">
              Select one or more countries to view sustainability impact data.
            </p>
            <CountryButtonSelect
              countries={countries ? countries.map(normalizeCountry) : []}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
            />
          </div>
        </Card>
        
        {selectedCountries.length > 0 && (
          <ImpactCategoriesContent selectedCountries={selectedCountries} />
        )}
      </div>
    </div>
  );
};

export default SustainabilityImpact;
