
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CountrySelect from "@/components/CountrySelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import { useDiscussionTopicsData, useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";

const DiscussionsContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("single");
  
  const countries = ["Se", "No", "Dk", "Fi", "Nl"];
  
  const { data: topicsData = [], isLoading, error } = useDiscussionTopicsData(selectedCountry);
  
  const years = React.useMemo(() => {
    if (!topicsData || !topicsData.length) return [2023, 2024];
    return [...new Set(topicsData.map(item => item.year))].sort((a, b) => a - b);
  }, [topicsData]);
  
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : 2024
  );
  
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);
  
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

  // For comparison view - fetch data for all countries at once
  const { data: allCountriesData = [], isLoading: isComparisonDataLoading, error: comparisonDataError } = 
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
            </TabsList>
          
            <TabsContent value="single">
              <div className="space-y-6">
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
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
                </Card>
                
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-pulse text-[#34502b]">Loading discussion topics data...</div>
                  </div>
                ) : error ? (
                  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                    <div className="text-center py-12 text-red-500">
                      Error loading data: {error instanceof Error ? error.message : "Unknown error"}
                    </div>
                  </Card>
                ) : !selectedCountry ? (
                  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                    <div className="text-center py-12 text-[#34502b]/70">
                      Please select a country to view discussion topics
                    </div>
                  </Card>
                ) : (
                  <DiscussionTopicsChart 
                    data={topicsData} 
                    selectedYear={selectedYear}
                    selectedCountry={selectedCountry}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <DiscussionTopicsComparison availableCountries={countries} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DiscussionsContent;
