
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CountrySelect from "@/components/CountrySelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import { useDiscussionTopicsData, useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

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
  
  // Update selectedYear when years array changes to make sure it's always valid
  useEffect(() => {
    if (years.length > 0) {
      const maxYear = Math.max(...years);
      // Only update if the current selectedYear isn't in the years array
      if (!years.includes(selectedYear)) {
        setSelectedYear(maxYear);
      }
    }
  }, [years, selectedYear]);
  
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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Select Country</h3>
                      <CountrySelect
                        countries={countries}
                        selectedCountry={selectedCountry}
                        onCountryChange={handleCountryChange}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Select Year</h3>
                      <YearSelector
                        years={years}
                        selectedYear={selectedYear}
                        onChange={setSelectedYear}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                {!selectedCountry ? (
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
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <DiscussionTopicsComparison 
              availableCountries={countries} 
              allCountriesData={allCountriesData}
              isLoading={isComparisonDataLoading}
              error={comparisonDataError}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiscussionsContent;
