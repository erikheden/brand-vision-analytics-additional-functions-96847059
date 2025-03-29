
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
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  
  const { 
    data: influencesData = [], 
    years = [],
    influences = [],
    isLoading, 
    error 
  } = useSustainabilityInfluences(selectedCountry);
  
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
  
  // Reset selected influences when country changes
  useEffect(() => {
    setSelectedInfluences([]);
    
    // If influences are available, select the top 3 for initial display
    if (influences.length > 0) {
      const topInfluences = influencesData
        .filter(item => item.year === selectedYear)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 3)
        .map(item => item.english_label_short);
      
      setSelectedInfluences([...new Set(topInfluences)]);
    }
  }, [influences, selectedYear, influencesData]);
  
  // Handle country selection with toast notification
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    toast({
      title: "Country Selected",
      description: `Showing sustainability influences for ${country}`,
      duration: 3000,
    });
  };

  // Available countries (same as in other components)
  const countries = ["Se", "No", "Dk", "Fi", "Nl"];

  // Loading state
  if (isLoading) {
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

  // Error state
  if (error) {
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
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
    </div>
  );
};

export default MainContent;
