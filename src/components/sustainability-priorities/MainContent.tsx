
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectionData } from "@/hooks/useSelectionData";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import PrioritiesView from "./PrioritiesView";
import TrendsView from "./TrendsView";
import EmptySelection from "./EmptySelection";
import { useToast } from "@/components/ui/use-toast";

const MainContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("priorities");
  const { countries } = useSelectionData("", []);
  const { toast } = useToast();
  
  const handleCountryChange = (country: string) => {
    setSelectedCountries(current => {
      if (current.includes(country)) {
        return current.filter(c => c !== country);
      } else {
        toast({
          title: `${country} Selected`,
          description: "Loading sustainability priorities data for this country",
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
            <h1 className="text-3xl font-semibold text-[#34502b] mb-2">Sustainability Priorities</h1>
            <p className="text-gray-600 max-w-2xl">
              Explore what sustainability topics are most important to consumers across different markets.
              Use these insights to align your sustainability initiatives with consumer priorities.
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
                  value="priorities" 
                  className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
                >
                  Priorities
                </TabsTrigger>
                <TabsTrigger 
                  value="trends" 
                  className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
                >
                  Trends
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="priorities" className="mt-0">
                <PrioritiesView 
                  selectedCountries={selectedCountries}
                />
              </TabsContent>
              
              <TabsContent value="trends" className="mt-0">
                <TrendsView 
                  selectedCountries={selectedCountries}
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
