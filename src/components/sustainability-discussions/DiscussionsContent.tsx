
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import SelectionPanel from "../sustainability-shared/SelectionPanel";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import { useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import SustainabilityLayout from "../sustainability-shared/SustainabilityLayout";
import EmptySelection from "./EmptySelection";
import TopicSelector from "./TopicSelector";
import { LineChart, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionTrendsChart from "./trends/DiscussionTrendsChart";

const DiscussionsContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("chart");
  const [selectedYear, setSelectedYear] = useState<number>(2023); // Default to most recent year
  
  const { data: allCountriesData = [], isLoading, error } = 
    useAllDiscussionTopicsData(selectedCountries);
  
  // Get available years from the data
  const years = useMemo(() => {
    const yearsSet = new Set<number>();
    
    if (allCountriesData) {
      allCountriesData.forEach(item => {
        if (item.year) {
          yearsSet.add(item.year);
        }
      });
    }
    
    // Convert to array and sort in ascending order
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [allCountriesData]);
  
  // Set the most recent year when data loads
  React.useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(years[years.length - 1]);
    }
  }, [years]);
  
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
              selectedTopics={selectedTopics}
              onTopicChange={setSelectedTopics}
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

    const filteredData = selectedTopics.length > 0 
      ? allCountriesData.filter(item => selectedTopics.includes(item.discussion_topic))
      : allCountriesData;

    return (
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span className="hidden md:inline">Distribution</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden md:inline">Trends</span>
              </TabsTrigger>
            </TabsList>
          </div>
        
          <TabsContent value="chart" className="w-full">
            {selectedCountries.length === 1 ? (
              <DiscussionTopicsChart 
                data={filteredData.filter(item => item.country === selectedCountries[0])} 
                selectedCountry={selectedCountries[0]}
                selectedYear={selectedYear}
              />
            ) : (
              <DiscussionTopicsComparison 
                countriesData={filteredData}
                selectedCountries={selectedCountries}
                selectedYear={selectedYear}
              />
            )}
          </TabsContent>

          <TabsContent value="trends" className="w-full">
            <DiscussionTrendsChart
              data={filteredData}
              selectedCountries={selectedCountries}
              selectedTopics={selectedTopics}
            />
          </TabsContent>
        </Tabs>
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
