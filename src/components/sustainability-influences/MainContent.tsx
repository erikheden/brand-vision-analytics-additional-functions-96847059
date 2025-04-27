
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SelectionPanel from "@/components/sustainability-shared/SelectionPanel";
import InfluencesBarChart from "./InfluencesBarChart";
import InfluencesTrendChart from "./InfluencesTrendChart";
import InfluenceSelector from "./InfluenceSelector";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import YearSelector from "./YearSelector";
import DashboardLayout from "../layout/DashboardLayout";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import { useSelectionData } from "@/hooks/useSelectionData";
import { useAllInfluencesData } from "@/hooks/useSustainabilityInfluences";

const MainContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [availableInfluences, setAvailableInfluences] = useState<string[]>([]);

  const { countries } = useSelectionData("", []);

  const {
    data: influencesData = {},
    isLoading,
    error
  } = useAllInfluencesData(selectedCountries);

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
    }
  }, [influencesData]);

  const handleInfluenceChange = (influences: string[]) => {
    setSelectedInfluences(influences);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountries(current => 
      current.includes(country) 
        ? current.filter(c => c !== country)
        : [...current, country]
    );
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <DashboardLayout 
      title="Sustainability Influences" 
      description="Discover what influences sustainable consumer behavior across different markets and track how these influences change over time."
    >
      <div className="grid grid-cols-1 gap-6 w-full">
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md w-full">
          <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <p className="text-gray-600 text-sm">
              Select one or more countries to view and compare sustainability influences.
            </p>
            <CountryButtonSelect
              countries={countries || []}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
            />
          </div>
        </Card>

        {selectedCountries.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl w-full">
            <div className="grid grid-cols-1 gap-6 mb-6 w-full">
              <div>
                <YearSelector years={[2023, 2024]} selectedYear={selectedYear} onChange={setSelectedYear} />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-[#34502b]/10 mx-auto mb-6 w-full md:w-auto">
                <TabsTrigger value="yearly" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Yearly View
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Trends
                </TabsTrigger>
              </TabsList>

              <div className="space-y-6 w-full">
                {activeTab === "yearly" && (
                  <InfluencesBarChart 
                    data={influencesData} 
                    selectedYear={selectedYear} 
                    countries={selectedCountries} 
                  />
                )}
                
                {activeTab === "trends" && (
                  <div className="flex flex-col gap-6">
                    <div className="w-full">
                      <InfluenceSelector 
                        influences={availableInfluences}
                        selectedInfluences={selectedInfluences}
                        onChange={handleInfluenceChange}
                      />
                    </div>
                    <div className="w-full">
                      <InfluencesTrendChart 
                        data={influencesData} 
                        selectedInfluences={selectedInfluences} 
                        countries={selectedCountries} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </Tabs>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MainContent;
