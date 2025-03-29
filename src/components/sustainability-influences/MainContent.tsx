
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSustainabilityInfluences } from '@/hooks/useSustainabilityInfluences';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CountrySelect from '@/components/CountrySelect';
import YearSelector from './YearSelector';
import InfluenceSelector from './InfluenceSelector';
import InfluencesBarChart from './InfluencesBarChart';
import InfluencesTrendChart from './InfluencesTrendChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const MainContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("SE"); // Default to Sweden
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  
  console.log("MainContent rendered with selectedCountry:", selectedCountry);
  
  const { 
    data: influencesData = [], 
    years = [],
    influences = [],
    isLoading, 
    error 
  } = useSustainabilityInfluences(selectedCountry);
  
  console.log("MainContent received data:", {
    dataCount: influencesData.length,
    yearsCount: years.length,
    influencesCount: influences.length,
    isLoading,
    hasError: !!error
  });
  
  // Set default selected year to the most recent one
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : new Date().getFullYear()
  );
  
  // Update selected year when years data changes
  useEffect(() => {
    if (years.length > 0) {
      const maxYear = Math.max(...years);
      console.log(`Setting selectedYear to max year: ${maxYear}`);
      setSelectedYear(maxYear);
    }
  }, [years]);
  
  // Update selected influences when influences data changes or year changes
  useEffect(() => {
    if (influences.length > 0 && influencesData.length > 0) {
      console.log("Calculating top influences for year:", selectedYear);
      
      const yearData = influencesData.filter(item => item.year === selectedYear);
      console.log(`Data points for year ${selectedYear}:`, yearData.length);
      
      // Select top 3 influences based on percentage
      const topInfluences = yearData
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, Math.min(3, yearData.length))
        .map(item => item.english_label_short);
      
      console.log("Top influences selected:", topInfluences);
      setSelectedInfluences([...new Set(topInfluences)]);
    } else {
      // If no influences data, clear selection
      setSelectedInfluences([]);
    }
  }, [influences, selectedYear, influencesData]);
  
  const handleCountryChange = (country: string) => {
    console.log("Country selected:", country);
    setSelectedCountry(country);
    toast({
      title: "Country Selected",
      description: `Showing sustainability influences for ${country}`,
      duration: 3000,
    });
  };

  const countries = ["SE", "NO", "DK", "FI", "NL"];

  if (isLoading) {
    console.log("Rendering loading state");
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Influences</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-[170px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Influences</h1>
        <Card className="p-6 bg-white border-2 border-red-200 rounded-xl shadow-md">
          <div className="text-center py-10 text-red-500">
            Error loading data. Please try again later.
          </div>
        </Card>
      </div>
    );
  }

  console.log("Rendering main content with selected year:", selectedYear);
  console.log("Active tab:", activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Influences</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
          <TabsTrigger 
            value="yearly" 
            className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
          >
            Yearly View
          </TabsTrigger>
          <TabsTrigger 
            value="trends" 
            className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
          >
            Trends View
          </TabsTrigger>
        </TabsList>
      
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="space-y-4">
            <CountrySelect
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
              countries={countries}
            />
            
            {activeTab === "yearly" ? (
              <YearSelector
                years={years}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            ) : (
              <InfluenceSelector
                influences={influences}
                selectedInfluences={selectedInfluences}
                onChange={setSelectedInfluences}
              />
            )}
          </div>
          
          <div className="md:col-span-3">
            <TabsContent value="yearly" className="mt-0">
              {selectedCountry ? (
                <InfluencesBarChart
                  data={influencesData}
                  selectedYear={selectedYear}
                  country={selectedCountry}
                />
              ) : (
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="text-center py-10 text-gray-500">
                    Please select a country to view sustainability influences data.
                  </div>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              {selectedCountry ? (
                <InfluencesTrendChart
                  data={influencesData}
                  selectedInfluences={selectedInfluences}
                  country={selectedCountry}
                />
              ) : (
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="text-center py-10 text-gray-500">
                    Please select a country to view sustainability influences trends.
                  </div>
                </Card>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default MainContent;
