
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SelectionPanel from "../sustainability-shared/SelectionPanel";
import InfluencesBarChart from "./InfluencesBarChart";
import InfluencesTrendChart from "./InfluencesTrendChart";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { useAllInfluencesData } from "@/hooks/useSustainabilityInfluences";

const MainContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const { data: influencesData = {}, isLoading, error } = useAllInfluencesData(selectedCountries);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Influences</h1>
      
      <SelectionPanel
        title="Select Countries"
        description="Select one or more countries to view and compare sustainability influences."
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />

      {selectedCountries.length > 0 && (
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <YearSelector
                years={[2023, 2024]}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
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
              <InfluencesBarChart
                data={influencesData}
                selectedYear={selectedYear}
                countries={selectedCountries}
              />
            </TabsContent>
            
            <TabsContent value="trends">
              <InfluencesTrendChart
                data={influencesData}
                selectedInfluences={selectedInfluences}
                countries={selectedCountries}
              />
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default MainContent;
