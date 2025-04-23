
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import { useSelectionData } from "@/hooks/useSelectionData";
import DashboardLayout from "../layout/DashboardLayout";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptySelection from "./EmptySelection";
import { useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";
import { useToast } from "@/components/ui/use-toast";
import TopicsView from "./topics/TopicsView";
import TopicTrendsView from "./topics/TopicTrendsView";

const DiscussionsContent: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<string>("topics");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { countries } = useSelectionData("", []);
  const { toast } = useToast();

  const { 
    data: discussionData, 
    isLoading, 
    error 
  } = useAllDiscussionTopicsData(selectedCountries);

  const handleCountryChange = (country: string) => {
    setSelectedCountries(current => {
      if (current.includes(country)) {
        return current.filter(c => c !== country);
      } else {
        toast({
          title: `${country} Selected`,
          description: "Loading sustainability discussion data for this country",
        });
        return [...current, country];
      }
    });
  };

  return (
    <DashboardLayout
      title="Sustainability Discussions"
      description="Track and compare what consumers discuss about sustainability across different markets."
    >
      <div className="grid grid-cols-1 gap-6 w-full">
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md w-full">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <p className="text-gray-600 text-sm">
              Select one or more countries to view sustainability discussion topics.
            </p>
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
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl w-full">
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <TabsList className="bg-[#34502b]/10 mx-auto mb-6 w-full md:w-auto">
                <TabsTrigger value="topics" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Topics
                </TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Topic Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="topics" className="mt-0">
                <TopicsView 
                  data={discussionData || []} 
                  selectedCountries={selectedCountries}
                  selectedYear={selectedYear}
                  isLoading={isLoading}
                  error={error}
                />
              </TabsContent>

              <TabsContent value="trends" className="mt-0">
                <TopicTrendsView
                  data={discussionData || []}
                  selectedCountries={selectedCountries}
                  isLoading={isLoading}
                  error={error}
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
