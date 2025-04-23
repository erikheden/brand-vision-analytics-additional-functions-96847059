
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import { useSelectionData } from "@/hooks/useSelectionData";
import DashboardLayout from "../layout/DashboardLayout";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";

const DiscussionsContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const { countries } = useSelectionData("", []);
  
  const { data: topicsData, isLoading, error } = useAllDiscussionTopicsData(selectedCountries);

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
      title="Sustainability Discussions"
      description="Explore and compare sustainability discussion topics across different markets."
    >
      <div className="grid grid-cols-1 gap-6 w-full">
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md w-full">
          <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <p className="text-gray-600 text-sm">
              Select one or more countries to view and compare sustainability discussions.
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
                <TabsTrigger value="yearly" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Topics Overview
                </TabsTrigger>
                <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Topics Comparison
                </TabsTrigger>
              </TabsList>

              <TabsContent value="yearly" className="mt-0">
                <DiscussionTopicsChart 
                  data={topicsData || []}
                  selectedCountries={selectedCountries}
                />
              </TabsContent>
              
              <TabsContent value="comparison" className="mt-0">
                <DiscussionTopicsComparison
                  data={topicsData || []}
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

export default DiscussionsContent;
