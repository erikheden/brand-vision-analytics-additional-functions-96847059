import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMaterialityFilters } from "@/hooks/useMaterialityFilters";
import CategorySelector from "./CategorySelector";
import FactorToggle from "./FactorToggle";
import MaterialityResultsDisplay from "./MaterialityResultsDisplay";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import { useSelectionData } from "@/hooks/useSelectionData";
const MaterialityAreasContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const {
    countries
  } = useSelectionData("", []);
  const {
    selectedCategory,
    selectedFactors,
    filteredData,
    isLoading,
    error,
    categories,
    setSelectedCategory,
    toggleFactor
  } = useMaterialityFilters(selectedCountries[0]); // Pass the first selected country for now

  const handleCountryChange = (country: string) => {
    const newSelectedCountries = selectedCountries.includes(country) ? selectedCountries.filter(c => c !== country) : [...selectedCountries, country];
    setSelectedCountries(newSelectedCountries);
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Areas</h1>
        
        {/* Country Selection Card */}
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-[#34502b] mb-3">Select Countries</h2>
          <CountryButtonSelect countries={countries || []} selectedCountries={selectedCountries} onCountryChange={handleCountryChange} />
        </Card>
        
        {selectedCountries.length > 0 && <div className="space-y-6">
            {/* Filters Section - Now placed above the chart */}
            <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  {isLoading ? <div className="text-sm text-gray-500">Loading categories...</div> : categories.length > 0 ? <CategorySelector categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} /> : <div className="text-sm text-gray-500">
                      No categories available for this country
                    </div>}
                </div>
                
                <div className="md:w-1/2">
                  <FactorToggle selectedFactors={selectedFactors} toggleFactor={toggleFactor} />
                </div>
              </div>
            </Card>
            
            {/* Results Display */}
            <MaterialityResultsDisplay isLoading={isLoading} error={error} selectedCountry={selectedCountries[0]} selectedCategory={selectedCategory} filteredData={filteredData} />
          </div>}
      </div>
    </div>;
};
export default MaterialityAreasContent;