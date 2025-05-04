
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMaterialityFilters } from "@/hooks/useMaterialityFilters";
import CategorySelector from "./CategorySelector";
import FactorToggle from "./FactorToggle";
import MaterialityResultsDisplay from "./MaterialityResultsDisplay";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import { useSelectionData } from "@/hooks/useSelectionData";
import { useToast } from "@/components/ui/use-toast";

// Define the mapping interface for MaterialityData
interface MaterialityData {
  category: string;
  sustainability_area: string;
  vho_type: string;
  percentage: number;
  type_of_factor: string;
}

const MaterialityAreasContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const { toast } = useToast();
  const { countries } = useSelectionData("", []);
  
  const {
    selectedCategory,
    selectedFactors,
    filteredData: vhoFilteredData,
    isLoading,
    error,
    categories,
    setSelectedCategory,
    toggleFactor
  } = useMaterialityFilters(selectedCountries[0]); // Pass the first selected country for now

  // Map VHOData to MaterialityData using only VHO-specific terminology
  const mappedData: MaterialityData[] = vhoFilteredData.map((item) => ({
    category: item.category,
    sustainability_area: item.vho_area,
    vho_type: item.type_of_factor === 'hygiene_factor' ? 'Hygiene Factor' : 'More Of Factor',
    percentage: item.priority_percentage,
    type_of_factor: item.type_of_factor
  }));

  const handleCountryChange = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      toast({
        title: `${country} Selected`,
        description: "Loading materiality data for this country",
      });
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Areas</h1>
        
        {/* Country Selection Card */}
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-[#34502b] mb-3">Select Countries</h2>
          <CountryButtonSelect 
            countries={countries || []} 
            selectedCountries={selectedCountries} 
            onCountryChange={handleCountryChange} 
          />
        </Card>
        
        {selectedCountries.length > 0 ? (
          <div className="space-y-6">
            {/* Filters Section */}
            <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
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
              selectedCountry={selectedCountries[0]} 
              selectedCategory={selectedCategory} 
              filteredData={mappedData} 
            />
          </div>
        ) : (
          <EmptySelection />
        )}
      </div>
    </div>
  );
};

// Empty selection component for when no countries are selected
const EmptySelection = () => {
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-[#34502b] mb-2">Select a Country to Get Started</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Choose at least one country above to view sustainability materiality data and insights.
        </p>
      </div>
    </Card>
  );
};

export default MaterialityAreasContent;
