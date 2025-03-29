
import React, { useState, useMemo, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useGeneralMaterialityData } from "@/hooks/useGeneralMaterialityData";
import SingleCountryView from "./SingleCountryView";
import CountryComparisonPanel from "./CountryComparisonPanel";

const MainContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("single");
  const [selectedAgeId, setSelectedAgeId] = useState<number | null>(null);
  
  const { 
    data: materialityData = [], 
    ageGroups = [],
    isLoading, 
    isLoadingAgeGroups,
    error 
  } = useGeneralMaterialityData(selectedCountry, selectedAgeId);
  
  useEffect(() => {
    // Log data to help with debugging
    console.log("Materiality data loaded:", materialityData.length > 0 ? "Yes" : "No");
    if (materialityData.length > 0) {
      console.log("Sample data:", materialityData.slice(0, 2));
    }
    
    // Reset selected areas when country changes
    setSelectedAreas([]);
  }, [materialityData]);
  
  // Extract unique years from the data
  const years = useMemo(() => {
    if (!materialityData.length) return [2023, 2024]; // Default years if no data
    return [...new Set(materialityData.map(item => item.year))].sort((a, b) => a - b);
  }, [materialityData]);
  
  // Set default to most recent year
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : 2024
  );
  
  // Update selected year when years change
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);
  
  // Extract unique areas from the data
  const areas = useMemo(() => {
    if (!materialityData.length) return [];
    return [...new Set(materialityData.map(item => item.materiality_area))];
  }, [materialityData]);
  
  // Get available countries (we can reuse the CountrySelect component)
  const countries = ["Se", "No", "Dk", "Fi", "Nl"];
  
  // Handle country selection with toast notification
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    toast({
      title: "Country Selected",
      description: `Showing sustainability priorities for ${country}`,
      duration: 3000,
    });
  };

  return (
    <div className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Headline moved to the top */}
          <h1 className="text-2xl font-semibold text-[#34502b] text-center md:text-left">Sustainability Priorities</h1>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
              <TabsTrigger value="single" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                Single Country Analysis
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                Country Comparison
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="single">
              <SingleCountryView 
                selectedCountry={selectedCountry}
                setSelectedCountry={handleCountryChange}
                materialityData={materialityData}
                isLoading={isLoading}
                error={error instanceof Error ? error : null}
                years={years}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                areas={areas}
                selectedAreas={selectedAreas}
                setSelectedAreas={setSelectedAreas}
                countries={countries}
                ageGroups={ageGroups}
                selectedAgeId={selectedAgeId}
                setSelectedAgeId={setSelectedAgeId}
                isLoadingAgeGroups={isLoadingAgeGroups}
              />
            </TabsContent>
            
            <TabsContent value="comparison">
              <CountryComparisonPanel availableCountries={countries} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
