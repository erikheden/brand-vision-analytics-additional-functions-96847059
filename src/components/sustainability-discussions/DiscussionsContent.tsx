
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import { useDiscussionTopicsData, useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

const DiscussionsContent = () => {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("single");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  
  // Get available countries
  const countries = ["Se", "No", "Dk", "Fi", "Nl"];
  
  // For comparison view - fetch data for all countries at once
  const { data: allCountriesData = [], isLoading: isComparisonDataLoading, error: comparisonDataError } = 
    useAllDiscussionTopicsData(selectedCountries);
  
  // Extract years from data
  const years = React.useMemo(() => {
    if (!allCountriesData || !allCountriesData.length) return [2023, 2024];
    return [...new Set(allCountriesData.map(item => item.year))].sort((a, b) => a - b);
  }, [allCountriesData]);
  
  // Update selectedYear when years array changes to make sure it's always valid
  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(Math.max(...years));
    }
  }, [years, selectedYear]);
  
  const handleCountriesChange = (countries: string[]) => {
    setSelectedCountries(countries);
    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: `Showing sustainability discussions for selected countries`,
        duration: 3000,
      });
    }
  };

  if (isComparisonDataLoading) return <LoadingState />;
  if (comparisonDataError) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] text-center md:text-left">Sustainability Discussions</h1>
        
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Select Countries</h3>
                <CountryMultiSelect
                  countries={countries}
                  selectedCountries={selectedCountries}
                  setSelectedCountries={handleCountriesChange}
                />
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Select Year</h3>
                <YearSelector
                  years={years}
                  selectedYear={selectedYear}
                  onChange={setSelectedYear}
                />
              </div>
            </div>
          </div>
        
          {selectedCountries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Please select at least one country to view discussion topics
            </div>
          ) : (
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0 mb-6">
                <TabsTrigger value="single" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Single Country Analysis
                </TabsTrigger>
                <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                  Country Comparison
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="single">
                {selectedCountries.length === 1 ? (
                  <DiscussionTopicsChart 
                    data={allCountriesData.filter(item => item.country === selectedCountries[0])} 
                    selectedYear={selectedYear}
                    selectedCountry={selectedCountries[0]}
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Please select only one country for single country analysis
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comparison">
                <DiscussionTopicsComparison 
                  availableCountries={countries} 
                  allCountriesData={allCountriesData}
                  isLoading={isComparisonDataLoading}
                  error={comparisonDataError}
                  selectedCountries={selectedCountries}
                  selectedYear={selectedYear}
                />
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DiscussionsContent;
