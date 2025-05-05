
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectionData } from "@/hooks/useSelectionData";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import TabView from "./TabView";
import EmptySelection from "./EmptySelection";
import { useToast } from "@/components/ui/use-toast";
import { useAllCountriesInfluences } from "@/hooks/sustainability-influences";

const MainContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("current");
  const [selectedYear, setSelectedYear] = useState<number>(2024); // Set default to 2024
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const { countries } = useSelectionData("", []);
  const { toast } = useToast();
  
  // Fetch data for all selected countries
  const { data: influencesData = {}, isLoading, error } = useAllCountriesInfluences(selectedCountries);

  // Define all available influences 
  const allInfluences = ["TV", "News Media", "Social Media", "Friends & Family"];

  // Reset selected influences when changing tabs
  useEffect(() => {
    if (activeTab === "current") {
      // For current view, we don't need to pre-select influences
      setSelectedInfluences([]);
    } else if (activeTab === "trends" && selectedInfluences.length === 0) {
      // For trends view, pre-select two influences as default
      setSelectedInfluences(allInfluences.slice(0, 2));
    }
  }, [activeTab]);

  const handleCountryChange = (country: string) => {
    setSelectedCountries(current => {
      if (current.includes(country)) {
        return current.filter(c => c !== country);
      } else {
        toast({
          title: `${country} Selected`,
          description: "Loading sustainability influence data for this country",
        });
        return [...current, country];
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#34502b] mb-2">Sustainability Influences</h1>
            <p className="text-gray-600 max-w-2xl">
              Understand what influences consumers' sustainability decisions across different markets.
              Use these insights to develop effective sustainability communication strategies.
            </p>
          </div>
        </div>
        
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <CountryButtonSelect
              countries={countries || []}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
            />
          </div>
        </Card>

        {selectedCountries.length === 0 ? (
          <EmptySelection />
        ) : (
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 bg-[#34502b]/10 mb-6">
                <TabsTrigger 
                  value="current" 
                  className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
                >
                  Current View
                </TabsTrigger>
                <TabsTrigger 
                  value="trends" 
                  className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
                >
                  Trend Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                <TabView 
                  activeTab="current" 
                  selectedCountries={selectedCountries}
                  selectedYear={selectedYear}
                  selectedInfluences={selectedInfluences}
                  influencesData={influencesData}
                  years={[2024, 2023, 2022, 2021]} // Update years array with 2024 first
                  setSelectedYear={setSelectedYear}
                  influences={allInfluences}
                  setSelectedInfluences={setSelectedInfluences}
                />
              </TabsContent>
              
              <TabsContent value="trends">
                <TabView 
                  activeTab="trends" 
                  selectedCountries={selectedCountries}
                  selectedYear={selectedYear}
                  selectedInfluences={selectedInfluences}
                  influencesData={influencesData}
                  years={[2024, 2023, 2022, 2021]} // Update years array with 2024 first
                  setSelectedYear={setSelectedYear}
                  influences={allInfluences}
                  setSelectedInfluences={setSelectedInfluences}
                />
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MainContent;
