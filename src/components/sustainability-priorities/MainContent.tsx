
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import PrioritiesView from "./PrioritiesView";
import TrendsView from "./TrendsView";
import YearSelector from "./YearSelector";
import { useSelectionData } from "@/hooks/useSelectionData";
import DashboardLayout from "../layout/DashboardLayout";

const MainContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("priorities");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { countries } = useSelectionData("", []);
  
  const handleCountryChange = (country: string) => {
    setSelectedCountries(current => 
      current.includes(country) 
        ? current.filter(c => c !== country)
        : [...current, country]
    );
  };

  return (
    <DashboardLayout
      title="Sustainability Priorities"
      description="Track and compare sustainability priorities across different markets and time periods."
    >
      <div className="grid grid-cols-1 gap-6 w-full">
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md w-full">
          <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <p className="text-gray-600 text-sm">
              Select one or more countries to view and compare sustainability priorities.
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
            <div className="grid grid-cols-1 gap-6 mb-6">
              <YearSelector years={[2023, 2024]} selectedYear={selectedYear} onChange={setSelectedYear} />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-[#34502b]/10 mx-auto mb-6 w-full md:w-auto">
                <TabsTrigger value="priorities" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Priorities View
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="priorities" className="mt-0">
                <PrioritiesView
                  selectedCountries={selectedCountries}
                  years={[2023, 2024]}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
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
    </DashboardLayout>
  );
};

export default MainContent;
