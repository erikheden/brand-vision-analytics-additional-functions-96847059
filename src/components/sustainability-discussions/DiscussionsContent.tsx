
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CountrySelect from "@/components/CountrySelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import DiscussionTopicsMap from "./DiscussionTopicsMap";
import TopicSelector from "./TopicSelector";
import { useDiscussionTopicsData, useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";

const DiscussionsContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("single");
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  
  const countries = ["Se", "No", "Dk", "Fi", "Nl"];
  
  const { data: topicsData = [], isLoading, error } = useDiscussionTopicsData(selectedCountry);
  
  const years = React.useMemo(() => {
    if (!topicsData.length) return [2023, 2024];
    return [...new Set(topicsData.map(item => item.year))].sort((a, b) => a - b);
  }, [topicsData]);
  
  const topics = React.useMemo(() => {
    console.log("Calculating topics from topicsData length:", topicsData?.length);
    
    if (!topicsData || !topicsData.length) return [];
    
    const uniqueTopics = [...new Set(topicsData
      .filter(item => item.discussion_topic && item.discussion_topic.trim() !== '')
      .map(item => item.discussion_topic))]
      .sort();
    
    console.log("Extracted topics:", uniqueTopics);
    return uniqueTopics;
  }, [topicsData]);
  
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : 2024
  );
  
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);
  
  // Reset selected topic when changing country
  useEffect(() => {
    setSelectedTopic(undefined);
  }, [selectedCountry]);
  
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    if (country) {
      toast({
        title: "Country Selected",
        description: `Showing sustainability discussions for ${country}`,
        duration: 3000,
      });
    }
  };

  const handleTopicChange = (topic: string | undefined) => {
    setSelectedTopic(topic);
    if (topic) {
      toast({
        title: "Topic Selected",
        description: `Filtering to show "${topic}" discussions`,
        duration: 3000,
      });
    }
  };

  // For map view - fetch data for all countries at once
  const { data: allCountriesData = [], isLoading: isMapDataLoading, error: mapDataError } = 
    useAllDiscussionTopicsData(countries);

  return (
    <div className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-[#34502b] text-center md:text-left">Sustainability Discussions</h1>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
              <TabsTrigger value="single" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                Single Country Analysis
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                Country Comparison
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                Geographic Distribution
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="single">
              <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <CountrySelect
                      countries={countries}
                      selectedCountry={selectedCountry}
                      onCountryChange={handleCountryChange}
                      className="w-full md:w-64"
                    />
                    
                    <YearSelector
                      years={years}
                      selectedYear={selectedYear}
                      onChange={setSelectedYear}
                    />
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-12">Loading discussion topics data...</div>
                  ) : error ? (
                    <div className="text-center py-12 text-red-500">
                      Error loading data: {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                  ) : !selectedCountry ? (
                    <div className="text-center py-12">Please select a country to view discussion topics</div>
                  ) : (
                    <DiscussionTopicsChart 
                      data={topicsData} 
                      selectedYear={selectedYear}
                      selectedCountry={selectedCountry}
                    />
                  )}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison">
              <DiscussionTopicsComparison availableCountries={countries} />
            </TabsContent>
            
            <TabsContent value="map">
              <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <TopicSelector
                      topics={topics}
                      selectedTopic={selectedTopic}
                      onTopicChange={handleTopicChange}
                      className="w-full md:w-64"
                    />
                    
                    <YearSelector
                      years={years}
                      selectedYear={selectedYear}
                      onChange={setSelectedYear}
                    />
                  </div>
                  
                  {isMapDataLoading ? (
                    <div className="text-center py-12">Loading map data...</div>
                  ) : mapDataError ? (
                    <div className="text-center py-12 text-red-500">
                      Error loading map data: {mapDataError instanceof Error ? mapDataError.message : "Unknown error"}
                    </div>
                  ) : (
                    <DiscussionTopicsMap 
                      data={allCountriesData}
                      selectedYear={selectedYear}
                      selectedTopic={selectedTopic}
                    />
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DiscussionsContent;
