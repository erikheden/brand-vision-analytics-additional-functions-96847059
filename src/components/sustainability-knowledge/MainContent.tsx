
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import KnowledgeLevelsTab from "./KnowledgeLevelsTab";
import KnowledgeTrendsTab from "./KnowledgeTrendsTab";
import { useKnowledgePage } from "./KnowledgePageProvider";
import DashboardLayout from "../layout/DashboardLayout";
import { useSelectionData } from "@/hooks/useSelectionData";

const MainContent = () => {
  const [activeTab, setActiveTab] = useState<string>("levels");
  const { selectedCountries, handleCountriesChange, selectedYear, setSelectedYear } = useKnowledgePage();
  const { countries } = useSelectionData("", []);

  const handleCountryChange = (country: string) => {
    const newSelection = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    handleCountriesChange(newSelection);
  };

  return (
    <DashboardLayout
      title="Sustainability Knowledge"
      description="Track and compare consumer understanding of sustainability terms across different markets and time periods."
    >
      <div className="grid grid-cols-1 gap-6 w-full">
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md w-full">
          <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <p className="text-gray-600 text-sm">
              Select one or more countries to view and compare sustainability knowledge.
            </p>
            <CountryButtonSelect
              countries={countries || []}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
            />
          </div>
        </Card>

        {selectedCountries.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-[#34502b]/10 mx-auto mb-6 w-full md:w-auto">
                <TabsTrigger value="levels" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Knowledge Levels
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Knowledge Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="levels" className="mt-0">
                <KnowledgeLevelsTab />
              </TabsContent>
              
              <TabsContent value="trends" className="mt-0">
                <KnowledgeTrendsTab />
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MainContent;
