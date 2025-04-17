import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import SelectionPanel from "../sustainability-shared/SelectionPanel";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import DiscussionTopicsMap from "./DiscussionTopicsMap";
import { useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import SustainabilityLayout from "../sustainability-shared/SustainabilityLayout";
import EmptySelection from "./EmptySelection";
import TopicSelector from "./TopicSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Globe } from "lucide-react";

const DiscussionsContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("chart");
  
  const { data: allCountriesData = [], isLoading, error } = 
    useAllDiscussionTopicsData(selectedCountries);
  
  const topics = useMemo(() => {
    const topicsSet = new Set<string>();
    
    if (allCountriesData) {
      allCountriesData.forEach(item => {
        if (item.discussion_topic) {
          topicsSet.add(item.discussion_topic);
        }
      });
    }
    
    return Array.from(topicsSet).sort();
  }, [allCountriesData]);

  const SelectionPanelContent = (
    <div className="space-y-6">
      <SelectionPanel
        title="Select Countries"
        description="Select one or more countries to view and compare sustainability discussions."
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />
      
      {selectedCountries.length > 0 && (
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#34502b]">Filter Options</h2>
            <TopicSelector 
              topics={topics}
              selectedTopic={selectedTopic}
              onTopicChange={setSelectedTopic}
            />
          </div>
        </Card>
      )}
    </div>
  );

  const renderMainContent = () => {
    if (selectedCountries.length === 0) {
      return <EmptySelection />;
    }

    const filteredData = selectedTopic 
      ? allCountriesData.filter(item => item.discussion_topic === selectedTopic)
      : allCountriesData;

    return (
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <YearSelector
            years={[2023, 2024]}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Chart View</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Map View</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === "chart" ? (
          <>
            {selectedCountries.length === 1 ? (
              <DiscussionTopicsChart 
                data={filteredData.filter(item => item.country === selectedCountries[0])} 
                selectedYear={selectedYear}
                selectedCountry={selectedCountries[0]}
              />
            ) : (
              <DiscussionTopicsComparison 
                countriesData={filteredData}
                selectedCountries={selectedCountries}
                selectedYear={selectedYear}
              />
            )}
          </>
        ) : (
          <DiscussionTopicsMap
            data={filteredData}
            selectedYear={selectedYear}
            selectedTopic={selectedTopic}
          />
        )}
      </Card>
    );
  };

  return (
    <SustainabilityLayout
      title="Sustainability Discussions"
      description="Explore and compare sustainability discussion topics across different markets and time periods."
      selectionPanel={SelectionPanelContent}
    >
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        renderMainContent()
      )}
    </SustainabilityLayout>
  );
};

export default DiscussionsContent;
