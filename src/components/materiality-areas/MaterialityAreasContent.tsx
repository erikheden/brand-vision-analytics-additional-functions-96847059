
import React from "react";
import { Card } from "@/components/ui/card";
import CountrySelect from "@/components/CountrySelect";
import { useMaterialityFilters } from "@/hooks/useMaterialityFilters";
import CategorySelector from "./CategorySelector";
import FactorToggle from "./FactorToggle";
import MaterialityResultsDisplay from "./MaterialityResultsDisplay";

const MaterialityAreasContent = () => {
  const {
    selectedCountry,
    selectedCategory,
    selectedFactors,
    filteredData,
    isLoading,
    error,
    categories,
    setSelectedCategory,
    handleCountryChange,
    toggleFactor
  } = useMaterialityFilters();
  
  // Countries available (using capital letters as specified)
  const countries = ["NO", "SE", "DK", "FI", "NL"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Areas</h1>
        
        {/* Country Selection Card */}
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl mb-6">
          <CountrySelect
            selectedCountry={selectedCountry}
            countries={countries}
            onCountryChange={handleCountryChange}
          />
        </Card>
        
        {selectedCountry && (
          <div className="space-y-6">
            {/* Filters Section - Now placed above the chart */}
            <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  {isLoading ? (
                    <div className="text-sm text-gray-500">Loading categories...</div>
                  ) : categories.length > 0 ? (
                    <CategorySelector
                      categories={categories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      No categories available for this country
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/2">
                  <FactorToggle
                    selectedFactors={selectedFactors}
                    toggleFactor={toggleFactor}
                  />
                </div>
              </div>
            </Card>
            
            {/* Results Display */}
            <MaterialityResultsDisplay
              isLoading={isLoading}
              error={error}
              selectedCountry={selectedCountry}
              selectedCategory={selectedCategory}
              filteredData={filteredData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialityAreasContent;
