
import React from "react";
import { Card } from "@/components/ui/card";
import CountrySelect from "@/components/CountrySelect";
import { useMaterialityFilters } from "@/hooks/useMaterialityFilters";
import MaterialityFilterPanel from "./MaterialityFilterPanel";
import MaterialityResultsDisplay from "./MaterialityResultsDisplay";

const MaterialityAreasContent = () => {
  const {
    selectedCountry,
    selectedIndustry,
    selectedCategory,
    selectedFactors,
    filteredData,
    isLoading,
    error,
    industries,
    categories,
    hasDistinctCategories,
    setSelectedIndustry,
    setSelectedCategory,
    handleCountryChange,
    toggleFactor
  } = useMaterialityFilters();
  
  // Countries available (using capital letters as specified)
  const countries = ["NO", "SE", "DK", "FI", "NL"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Materiality Areas</h1>
        
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl mb-6">
          <CountrySelect
            selectedCountry={selectedCountry}
            countries={countries}
            onCountryChange={handleCountryChange}
          />
        </Card>
        
        {selectedCountry && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <MaterialityFilterPanel
                countries={countries}
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                industries={industries}
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                hasDistinctCategories={hasDistinctCategories}
                selectedFactors={selectedFactors}
                toggleFactor={toggleFactor}
                isLoading={isLoading}
              />
            </div>
            
            <div className="md:col-span-3">
              <MaterialityResultsDisplay
                isLoading={isLoading}
                error={error}
                selectedCountry={selectedCountry}
                selectedIndustry={selectedIndustry}
                filteredData={filteredData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialityAreasContent;
