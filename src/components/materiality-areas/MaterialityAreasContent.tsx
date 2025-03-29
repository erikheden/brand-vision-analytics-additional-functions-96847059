
import React, { useState, useMemo, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CountrySelect from "@/components/CountrySelect";
import { Card } from "@/components/ui/card";
import { useVHOData } from "@/hooks/useVHOData";
import VHOAreaBarChart from "./VHOAreaBarChart";
import IndustrySelector from "./IndustrySelector";
import CategorySelector from "./CategorySelector";
import FactorToggle from "./FactorToggle";

const MaterialityAreasContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["hygiene_factor"]);
  
  const { data: vhoData = [], isLoading, error } = useVHOData(selectedCountry);
  
  // Extract unique industries
  const industries = useMemo(() => {
    if (!vhoData.length) return [];
    const uniqueIndustries = [...new Set(vhoData.map(item => item.industry))].sort();
    console.log("Extracted industries:", uniqueIndustries);
    return uniqueIndustries;
  }, [vhoData]);
  
  // Extract unique categories for the selected industry
  const categories = useMemo(() => {
    if (!vhoData.length || !selectedIndustry) return [];
    const uniqueCategories = [...new Set(
      vhoData
        .filter(item => item.industry === selectedIndustry)
        .map(item => item.category)
    )].sort();
    console.log("Extracted categories for", selectedIndustry, ":", uniqueCategories);
    return uniqueCategories;
  }, [vhoData, selectedIndustry]);
  
  // Check if we have distinct categories (different from industry)
  const hasDistinctCategories = useMemo(() => {
    if (!vhoData.length || !selectedIndustry) return false;
    // Get unique categories for the selected industry
    const uniqueCategories = [...new Set(
      vhoData
        .filter(item => item.industry === selectedIndustry)
        .map(item => item.category)
    )];
    
    // If we have more than one category or the category is different from the industry name
    return uniqueCategories.length > 1 || 
           (uniqueCategories.length === 1 && uniqueCategories[0] !== selectedIndustry);
  }, [vhoData, selectedIndustry]);
  
  // Filter data based on selections
  const filteredData = useMemo(() => {
    if (!vhoData.length || !selectedIndustry) return [];
    
    let filtered = vhoData.filter(item => item.industry === selectedIndustry);
    
    if (hasDistinctCategories && selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedFactors.length > 0) {
      filtered = filtered.filter(item => selectedFactors.includes(item.type_of_factor));
    }
    
    return filtered;
  }, [vhoData, selectedIndustry, selectedCategory, selectedFactors, hasDistinctCategories]);
  
  // Reset category when industry changes
  useEffect(() => {
    setSelectedCategory("");
  }, [selectedIndustry]);
  
  // Reset industry when country changes
  useEffect(() => {
    setSelectedIndustry("");
    setSelectedCategory("");
  }, [selectedCountry]);
  
  // Handle country selection with toast notification
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    toast({
      title: "Country Selected",
      description: `Showing materiality areas for ${country}`,
      duration: 3000,
    });
  };
  
  // Countries available (using capital letters as specified)
  const countries = ["NO", "SE", "DK", "FI", "NL"];
  
  // Toggle a factor selection
  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => {
      if (prev.includes(factor)) {
        // Don't remove if it's the only factor left
        if (prev.length === 1) return prev;
        return prev.filter(f => f !== factor);
      } else {
        return [...prev, factor];
      }
    });
  };

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
              <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="text-sm text-gray-500">Loading industries...</div>
                  ) : industries.length > 0 ? (
                    <IndustrySelector
                      industries={industries}
                      selectedIndustry={selectedIndustry}
                      setSelectedIndustry={setSelectedIndustry}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      No industries available for this country
                    </div>
                  )}
                  
                  {selectedIndustry && hasDistinctCategories && (
                    <CategorySelector
                      categories={categories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  )}
                  
                  {selectedIndustry && (
                    <FactorToggle
                      selectedFactors={selectedFactors}
                      toggleFactor={toggleFactor}
                    />
                  )}
                </div>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              {isLoading ? (
                <Card className="p-6 h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#34502b] mx-auto"></div>
                    <p className="mt-4 text-[#34502b]">Loading materiality areas...</p>
                  </div>
                </Card>
              ) : error ? (
                <Card className="p-6 bg-white border-2 border-red-200 rounded-xl shadow-md">
                  <div className="text-center py-10 text-red-500">
                    Error loading data. Please try again later.
                  </div>
                </Card>
              ) : !selectedCountry ? (
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="text-center py-10 text-gray-500">
                    Please select a country to view materiality areas.
                  </div>
                </Card>
              ) : !selectedIndustry ? (
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="text-center py-10 text-gray-500">
                    Please select an industry to view materiality areas.
                  </div>
                </Card>
              ) : filteredData.length === 0 ? (
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="text-center py-10 text-gray-500">
                    No materiality areas data available for the selected criteria.
                  </div>
                </Card>
              ) : (
                <VHOAreaBarChart data={filteredData} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialityAreasContent;
