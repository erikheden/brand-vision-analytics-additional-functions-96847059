
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectionData } from "@/hooks/useSelectionData";
import { normalizeCountry } from "@/components/CountrySelect";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import ImpactCategoriesContent from "@/components/materiality-areas/ImpactCategoriesContent";
import InsightsSummaryCard from "@/components/materiality-areas/impact/InsightsSummaryCard";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SustainabilityImpact = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("visualization");
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#34502b] mb-2">Sustainability Impact</h1>
            <p className="text-gray-600 max-w-2xl">
              Explore how sustainability influences consumer decisions across different markets and categories.
              Use these insights to align your marketing and communication strategies with consumer priorities.
            </p>
          </div>
        </div>
        
        <Alert className="bg-[#f1f0fb] border-[#34502b]/20">
          <Info className="h-5 w-5 text-[#34502b]" />
          <AlertTitle className="text-[#34502b]">Using this data</AlertTitle>
          <AlertDescription className="text-gray-600">
            Select countries to compare sustainability impact levels across different categories.
            Higher percentages indicate stronger consumer engagement with the sustainability topic.
          </AlertDescription>
        </Alert>
        
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <CountryButtonSelect
              countries={countries ? countries.map(normalizeCountry) : []}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
            />
          </div>
        </Card>
        
        {selectedCountries.length > 0 ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 bg-[#34502b]/10 mb-6">
                <TabsTrigger 
                  value="visualization" 
                  className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
                >
                  Impact Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
                >
                  Key Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualization" className="mt-0">
                <ImpactCategoriesContent selectedCountries={selectedCountries} />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0">
                <InsightsSummaryCard selectedCountries={selectedCountries} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="p-6 border-2 border-[#34502b]/20 rounded-xl shadow-md bg-gradient-to-r from-gray-50 to-[#f1f0fb]">
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-[#34502b] mb-2">Select a country to get started</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Choose one or more countries above to view sustainability impact data and discover consumer priorities.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SustainabilityImpact;
