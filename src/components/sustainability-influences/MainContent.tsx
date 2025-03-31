
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSustainabilityInfluences } from '@/hooks/useSustainabilityInfluences';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import TabView from './TabView';
import CountryMultiSelect from '@/components/CountryMultiSelect';

const MainContent = () => {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["SE"]); // Default to Sweden
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  
  // Get available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];
  
  console.log("MainContent rendered with selectedCountries:", selectedCountries);
  
  // Get the data for the first selected country
  const { 
    data: influencesData = [], 
    years = [],
    influences = [],
    isLoading, 
    error 
  } = useSustainabilityInfluences(selectedCountries[0] || "");
  
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
  
  // Initialize selected influences when influences data changes
  useEffect(() => {
    if (influences.length > 0 && selectedInfluences.length === 0) {
      // Select a default of first 3 influences or all if less than 3
      const defaultSelection = influences.slice(0, Math.min(3, influences.length));
      console.log("Initial influences selection:", defaultSelection);
      setSelectedInfluences(defaultSelection);
    }
  }, [influences, selectedInfluences.length]);
  
  const handleCountryChange = (countries: string[]) => {
    console.log("Countries selected:", countries);
    setSelectedCountries(countries);
    // Reset selected influences when country changes
    setSelectedInfluences([]);
    toast({
      title: "Countries Selected",
      description: `Showing sustainability influences for selected countries`,
      duration: 3000,
    });
  };

  if (isLoading) {
    console.log("Rendering loading state");
    return <LoadingState />;
  }

  if (error) {
    console.log("Rendering error state:", error);
    return <ErrorState />;
  }

  console.log("Rendering main content with selected year:", selectedYear);
  console.log("Active tab:", activeTab);
  console.log("Currently selected influences:", selectedInfluences);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] text-center md:text-left">
          Sustainability Influences
        </h1>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
                  <p className="text-gray-600 text-sm">
                    Select one or more countries to view and compare sustainability influences.
                  </p>
                  <CountryMultiSelect
                    countries={countries || []}
                    selectedCountries={selectedCountries}
                    setSelectedCountries={setSelectedCountries}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
            <TabsTrigger value="yearly" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Yearly View
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yearly" className="space-y-6 pt-4">
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <p className="text-gray-600">
                View and compare sustainability influences across selected countries for specific years.
              </p>
            </Card>
            
            <TabView
              activeTab="yearly"
              selectedCountry={selectedCountries[0]}
              selectedYear={selectedYear}
              selectedInfluences={selectedInfluences}
              influencesData={influencesData}
              years={years}
              setSelectedYear={setSelectedYear}
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 pt-4">
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <p className="text-gray-600">
                Analyze trends in sustainability influences over time for selected countries and areas.
              </p>
            </Card>
            
            <TabView
              activeTab="trends"
              selectedCountry={selectedCountries[0]}
              selectedYear={selectedYear}
              selectedInfluences={selectedInfluences}
              influencesData={influencesData}
              influences={influences}
              setSelectedInfluences={setSelectedInfluences}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainContent;
