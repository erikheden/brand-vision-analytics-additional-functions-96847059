
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
import DashboardLayout from "../layout/DashboardLayout";

const MainContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const { data: influencesData = {}, isLoading, error } = useAllInfluencesData(selectedCountries);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <DashboardLayout
      title="Sustainability Influences"
      description="Discover what influences sustainable consumer behavior across different markets and track how these influences change over time."
    >
      <SelectionPanel
        title="Select Countries"
        description="Select one or more countries to view and compare sustainability influences."
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />

      {selectedCountries.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl mt-6">
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
    </DashboardLayout>
  );
};

export default MainContent;
