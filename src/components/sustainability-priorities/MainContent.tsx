import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PrioritiesView from "./PrioritiesView";
import TrendsView from "./TrendsView";
import { useGeneralMaterialityData } from "@/hooks/useGeneralMaterialityData";
import { useSelectionData } from "@/hooks/useSelectionData";
import CountryMultiSelect from "@/components/CountryMultiSelect";
const MainContent = () => {
  const [activeView, setActiveView] = useState<string>("priorities");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  // Get available countries
  const {
    countries
  } = useSelectionData("", []);

  // Get the data for all selected countries
  const {
    data: materialityData,
    isLoading,
    error
  } = useGeneralMaterialityData(selectedCountries[0] || "");

  // Extract unique years from data
  const years = React.useMemo(() => {
    if (!materialityData || materialityData.length === 0) return [2023, 2024];
    const yearsSet = new Set(materialityData.map(item => item.year));
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [materialityData]);

  // Extract areas from data
  const areas = React.useMemo(() => {
    if (!materialityData || materialityData.length === 0) return [];
    const areasSet = new Set(materialityData.map(item => item.materiality_area));
    return Array.from(areasSet).sort();
  }, [materialityData]);

  // Set default year when years change
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] text-center md:text-left">
          Sustainability Priorities
        </h1>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
                  <p className="text-gray-600 text-sm">
                    Select one or more countries to view and compare sustainability priorities.
                  </p>
                  <CountryMultiSelect countries={countries || []} selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
            <TabsTrigger value="priorities" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Priorities
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="priorities" className="space-y-6 pt-4 py-0">
            
            
            <PrioritiesView selectedCountries={selectedCountries} years={years} selectedYear={selectedYear} setSelectedYear={setSelectedYear} isLoading={isLoading} error={error} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 pt-4">
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <p className="text-gray-600">
                Analyze trends in sustainability priorities over time for selected countries and areas.
              </p>
            </Card>
            
            <TrendsView selectedCountries={selectedCountries} areas={areas} selectedAreas={selectedAreas} setSelectedAreas={setSelectedAreas} isLoading={isLoading} error={error} />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default MainContent;