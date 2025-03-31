
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
  
  // Fetch data for all selected countries
  const [countriesData, setCountriesData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [allInfluences, setAllInfluences] = useState<string[]>([]);
  
  // Fetch data for each selected country
  useEffect(() => {
    const fetchAllCountriesData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const dataPromises = selectedCountries.map(country => {
          // For each country, get its data
          const { data, years, influences, error } = useSustainabilityInfluences(country);
          
          if (error) {
            throw error;
          }
          
          return { country, data, years, influences };
        });
        
        // Wait for all country data to load
        const results = await Promise.all(dataPromises);
        
        // Combine the data
        const combinedData: Record<string, any> = {};
        let combinedYears: number[] = [];
        let combinedInfluences: string[] = [];
        
        results.forEach(result => {
          combinedData[result.country] = result.data;
          combinedYears = [...combinedYears, ...(result.years || [])];
          combinedInfluences = [...combinedInfluences, ...(result.influences || [])];
        });
        
        // Remove duplicates and sort
        const uniqueYears = [...new Set(combinedYears)].sort((a, b) => a - b);
        const uniqueInfluences = [...new Set(combinedInfluences)].sort();
        
        setCountriesData(combinedData);
        setAllYears(uniqueYears);
        setAllInfluences(uniqueInfluences);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching countries data:", err);
        setError(err as Error);
        setIsLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load influences data for one or more countries",
          variant: "destructive",
        });
      }
    };
    
    fetchAllCountriesData();
  }, [selectedCountries, toast]);
  
  // Use the data from the first country to initialize
  const firstCountryData = useSustainabilityInfluences(selectedCountries[0] || "");
  
  // Set default selected year to the most recent one
  const [selectedYear, setSelectedYear] = useState<number>(
    allYears.length > 0 ? Math.max(...allYears) : 
    firstCountryData.years.length > 0 ? Math.max(...firstCountryData.years) : 
    new Date().getFullYear()
  );
  
  // Update selected year when years data changes
  useEffect(() => {
    if (allYears.length > 0) {
      const maxYear = Math.max(...allYears);
      console.log(`Setting selectedYear to max year: ${maxYear}`);
      setSelectedYear(maxYear);
    } else if (firstCountryData.years.length > 0) {
      const maxYear = Math.max(...firstCountryData.years);
      console.log(`Setting selectedYear to max year from first country: ${maxYear}`);
      setSelectedYear(maxYear);
    }
  }, [allYears, firstCountryData.years]);
  
  // Initialize selected influences when influences data changes
  useEffect(() => {
    if (allInfluences.length > 0 && selectedInfluences.length === 0) {
      // Select a default of first 3 influences or all if less than 3
      const defaultSelection = allInfluences.slice(0, Math.min(3, allInfluences.length));
      console.log("Initial influences selection:", defaultSelection);
      setSelectedInfluences(defaultSelection);
    } else if (firstCountryData.influences.length > 0 && selectedInfluences.length === 0) {
      const defaultSelection = firstCountryData.influences.slice(0, Math.min(3, firstCountryData.influences.length));
      console.log("Initial influences selection from first country:", defaultSelection);
      setSelectedInfluences(defaultSelection);
    }
  }, [allInfluences, firstCountryData.influences, selectedInfluences.length]);
  
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

  if (isLoading || firstCountryData.isLoading) {
    console.log("Rendering loading state");
    return <LoadingState />;
  }

  if (error || firstCountryData.error) {
    console.log("Rendering error state:", error || firstCountryData.error);
    return <ErrorState />;
  }

  console.log("Rendering main content with selected year:", selectedYear);
  console.log("Active tab:", activeTab);
  console.log("Currently selected influences:", selectedInfluences);

  // Merge data from all selected countries
  const combinedData = countriesData;
  if (Object.keys(combinedData).length === 0 && selectedCountries.length > 0) {
    combinedData[selectedCountries[0]] = firstCountryData.data;
  }

  const years = allYears.length > 0 ? allYears : firstCountryData.years;
  const influences = allInfluences.length > 0 ? allInfluences : firstCountryData.influences;

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
              selectedCountries={selectedCountries}
              selectedYear={selectedYear}
              selectedInfluences={selectedInfluences}
              influencesData={combinedData}
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
              selectedCountries={selectedCountries}
              selectedYear={selectedYear}
              selectedInfluences={selectedInfluences}
              influencesData={combinedData}
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
