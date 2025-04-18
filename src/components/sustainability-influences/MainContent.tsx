import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SelectionPanel from "../sustainability-shared/SelectionPanel";
import InfluencesBarChart from "./InfluencesBarChart";
import InfluencesTrendChart from "./InfluencesTrendChart";
import InfluenceSelector from "./InfluenceSelector";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { useAllInfluencesData } from "@/hooks/useSustainabilityInfluences";
import DashboardLayout from "../layout/DashboardLayout";
const MainContent = () => {
  // All state hooks at the top
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [availableInfluences, setAvailableInfluences] = useState<string[]>([]);

  // Data fetching
  const {
    data: influencesData = {},
    isLoading,
    error
  } = useAllInfluencesData(selectedCountries);

  // Extract all unique influence factors from the data
  useEffect(() => {
    if (Object.keys(influencesData).length > 0) {
      const allInfluences = new Set<string>();
      Object.values(influencesData).forEach(countryData => {
        countryData.forEach(item => {
          if (item.english_label_short) {
            allInfluences.add(item.english_label_short);
          }
        });
      });
      const sortedInfluences = Array.from(allInfluences).sort();
      setAvailableInfluences(sortedInfluences);

      // Auto-select first few influences if none selected
      if (selectedInfluences.length === 0 && sortedInfluences.length > 0) {
        // Select the first 3 influences or all if less than 3
        setSelectedInfluences(sortedInfluences.slice(0, Math.min(3, sortedInfluences.length)));
      }
    }
  }, [influencesData, selectedInfluences.length]);
  const handleInfluenceChange = (influences: string[]) => {
    setSelectedInfluences(influences);
  };
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  return <DashboardLayout title="Sustainability Influences" description="Discover what influences sustainable consumer behavior across different markets and track how these influences change over time.">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <SelectionPanel title="Select Countries" description="Select one or more countries to view and compare sustainability influences." selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />

          {selectedCountries.length > 0 && <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <YearSelector years={[2023, 2024]} selectedYear={selectedYear} onChange={setSelectedYear} />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0 mb-6">
                  <TabsTrigger value="yearly" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                    Yearly View
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                    Trends
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="yearly">
                  <InfluencesBarChart data={influencesData} selectedYear={selectedYear} countries={selectedCountries} />
                </TabsContent>
                
                <TabsContent value="trends">
                  <InfluencesTrendChart data={influencesData} selectedInfluences={selectedInfluences} countries={selectedCountries} />
                </TabsContent>
              </Tabs>
            </Card>}
        </div>

        {/* Sidebar for influence selection */}
        
      </div>
    </DashboardLayout>;
};
export default MainContent;