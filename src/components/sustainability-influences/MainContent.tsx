
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSustainabilityInfluences } from '@/hooks/useSustainabilityInfluences';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import TabView from './TabView';
import CountryMultiSelect from '@/components/CountryMultiSelect';
import { fetchInfluencesData } from '@/utils/api/fetchInfluencesData';

const MainContent = () => {
  const {
    toast
  } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["SE"]); // Default to Sweden
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]); // Changed to empty array
  const [selectedYear, setSelectedYear] = useState<number>(2024); // Default to 2024

  // Get available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];
  console.log("MainContent rendered with selectedCountries:", selectedCountries);

  // Use the hook for the first selected country to get structure
  const {
    data: firstCountryData,
    years: firstCountryYears,
    influences: firstCountryInfluences,
    isLoading: isFirstCountryLoading,
    error: firstCountryError
  } = useSustainabilityInfluences(selectedCountries[0] || "SE");

  // State for combined data from all countries
  const [combinedData, setCombinedData] = useState<Record<string, any>>({});
  const [allYears, setAllYears] = useState<number[]>([]);
  const [allInfluences, setAllInfluences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data for all selected countries
  useEffect(() => {
    const fetchAllCountriesData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newCombinedData: Record<string, any> = {};
        let newCombinedYears: number[] = [];
        let newCombinedInfluences: string[] = [];

        // Fetch data for each country sequentially
        for (const country of selectedCountries) {
          try {
            const result = await fetchInfluencesData(country);

            // Store the data
            newCombinedData[country] = result.data;
            newCombinedYears = [...newCombinedYears, ...(result.years || [])];
            newCombinedInfluences = [...newCombinedInfluences, ...(result.influences || [])];
          } catch (err) {
            console.error(`Error fetching data for ${country}:`, err);
            // Continue with other countries even if one fails
          }
        }

        // Remove duplicates and sort
        const uniqueYears = [...new Set(newCombinedYears)].sort((a, b) => a - b);
        const uniqueInfluences = [...new Set(newCombinedInfluences)].sort();
        setCombinedData(newCombinedData);
        setAllYears(uniqueYears);
        setAllInfluences(uniqueInfluences);

        // Update selected year to most recent if not already set
        if (uniqueYears.length > 0) {
          const maxYear = Math.max(...uniqueYears);
          if (!selectedYear || !uniqueYears.includes(selectedYear)) {
            setSelectedYear(maxYear);
          }
        }

        // Initialize selected influences if needed
        if (uniqueInfluences.length > 0 && selectedInfluences.length === 0) {
          // No longer automatically selecting influences
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching countries data:", err);
        setError(err as Error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load influences data for one or more countries",
          variant: "destructive"
        });
      }
    };
    fetchAllCountriesData();
  }, [selectedCountries, selectedYear, selectedInfluences, toast]);

  // Update the hook without breaking React rules
  useEffect(() => {
    if (selectedCountries.length === 1) {
      // If only one country is selected, we can rely on the hook data
      setCombinedData({
        [selectedCountries[0]]: firstCountryData
      });
      if (firstCountryYears.length > 0) {
        setAllYears(firstCountryYears);
        const maxYear = Math.max(...firstCountryYears);
        if (!selectedYear || !firstCountryYears.includes(selectedYear)) {
          setSelectedYear(maxYear);
        }
      }
      if (firstCountryInfluences.length > 0) {
        setAllInfluences(firstCountryInfluences);
        if (selectedInfluences.length === 0) {
          // No longer automatically selecting influences
        }
      }
    }
  }, [firstCountryData, firstCountryYears, firstCountryInfluences, selectedCountries, selectedYear, selectedInfluences]);

  const handleCountryChange = (countries: string[]) => {
    console.log("Countries selected:", countries);
    setSelectedCountries(countries);
    toast({
      title: "Countries Selected",
      description: `Showing sustainability influences for selected countries`,
      duration: 3000
    });
  };

  if (isLoading || isFirstCountryLoading) {
    console.log("Rendering loading state");
    return <LoadingState />;
  }

  if (error || firstCountryError) {
    console.log("Rendering error state:", error || firstCountryError);
    return <ErrorState />;
  }

  console.log("Rendering main content with selected year:", selectedYear);
  console.log("Active tab:", activeTab);
  console.log("Currently selected influences:", selectedInfluences);

  // Fall back to first country data if combinedData is empty
  const finalCombinedData = Object.keys(combinedData).length === 0 && selectedCountries.length > 0 ? {
    [selectedCountries[0]]: firstCountryData
  } : combinedData;
  const years = allYears.length > 0 ? allYears : firstCountryYears;
  const influences = allInfluences.length > 0 ? allInfluences : firstCountryInfluences;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  <CountryMultiSelect countries={countries || []} selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
            <TabsTrigger value="yearly" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Yearly View
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yearly" className="space-y-6 pt-4 py-0">
            
            
            <TabView activeTab="yearly" selectedCountries={selectedCountries} selectedYear={selectedYear} selectedInfluences={selectedInfluences} influencesData={finalCombinedData} years={years} setSelectedYear={setSelectedYear} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 pt-4">
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <p className="text-gray-600">
                Analyze trends in sustainability influences over time for selected countries and areas.
              </p>
            </Card>
            
            <TabView activeTab="trends" selectedCountries={selectedCountries} selectedYear={selectedYear} selectedInfluences={selectedInfluences} influencesData={finalCombinedData} influences={influences} setSelectedInfluences={setSelectedInfluences} />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};

export default MainContent;
