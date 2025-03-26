
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import SelectionPanel from "@/components/SelectionPanel";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import TopicSelector from "./TopicSelector";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsMap from "./DiscussionTopicsMap";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import { useDiscussionTopicsData, useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";

const DiscussionsContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("Se");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("chart");
  
  // Fetch discussion topics data for the selected country
  const { data: countryTopicsData = [], isLoading, error } = useDiscussionTopicsData(selectedCountry);
  
  // Get all available countries
  const availableCountries = ["Se", "No", "Dk", "Fi", "Nl"];
  
  // Fetch all countries data for the map
  const { data: allCountriesData = [] } = useAllDiscussionTopicsData(availableCountries);
  
  // Extract unique years from the data
  const years = React.useMemo(() => {
    const yearsSet = new Set<number>();
    
    // Add years from country-specific data
    countryTopicsData.forEach(item => {
      if (item.year) yearsSet.add(item.year);
    });
    
    // Add years from all countries data
    allCountriesData.forEach(item => {
      if (item.year) yearsSet.add(item.year);
    });
    
    // Default to current year if no data
    if (yearsSet.size === 0) {
      yearsSet.add(new Date().getFullYear());
    }
    
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [countryTopicsData, allCountriesData]);
  
  // Set default to most recent year
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : new Date().getFullYear()
  );
  
  // Update selected year when years change
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);
  
  // Extract unique topics from the data for the selected country and year
  const topics = React.useMemo(() => {
    const topicsSet = new Set<string>();
    
    countryTopicsData
      .filter(item => item.year === selectedYear)
      .forEach(item => {
        if (item.discussion_topic) {
          topicsSet.add(item.discussion_topic);
        }
      });
    
    console.log(`Found ${topicsSet.size} unique topics for ${selectedCountry} in ${selectedYear}`);
    return Array.from(topicsSet);
  }, [countryTopicsData, selectedCountry, selectedYear]);
  
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  
  // Reset selected topic when country or year changes
  useEffect(() => {
    setSelectedTopic(undefined);
  }, [selectedCountry, selectedYear]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching discussion topics:", error);
      toast({
        title: "Error",
        description: "Failed to load discussion topics data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#34502b] mb-6">
        Sustainability Discussions
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <SelectionPanel
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />
        </div>
        
        <Card className="lg:col-span-2 p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#34502b] mb-4">
              Sustainability Discussion Topics
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <YearSelector
                  years={years}
                  selectedYear={selectedYear}
                  onChange={setSelectedYear}
                />
              </div>
              {activeTab !== "comparison" && (
                <div className="w-full md:w-2/3">
                  <TopicSelector
                    topics={topics}
                    selectedTopic={selectedTopic}
                    onTopicChange={setSelectedTopic}
                  />
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="comparison">Country Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              {isLoading ? (
                <div className="text-center py-12">Loading discussion topics data...</div>
              ) : countryTopicsData.length > 0 ? (
                <DiscussionTopicsChart
                  data={countryTopicsData}
                  selectedYear={selectedYear}
                  selectedCountry={selectedCountry}
                />
              ) : (
                <div className="text-center py-12">
                  No discussion topics data available for {selectedCountry}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="map">
              <DiscussionTopicsMap
                data={allCountriesData}
                selectedYear={selectedYear}
                selectedTopic={selectedTopic}
              />
            </TabsContent>
            
            <TabsContent value="comparison">
              <DiscussionTopicsComparison
                availableCountries={availableCountries}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
};

export default DiscussionsContent;
