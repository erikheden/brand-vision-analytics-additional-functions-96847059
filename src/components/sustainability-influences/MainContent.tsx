import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import CountryMultiSelect from '@/components/CountryMultiSelect';
import InfluencesBarChart from './InfluencesBarChart';
import InfluencesTrendChart from './InfluencesTrendChart';
import { fetchInfluencesData } from '@/utils/api/fetchInfluencesData';
import YearSelector from '@/components/sustainability-priorities/YearSelector';
import InfluenceSelector from './InfluenceSelector';
const MainContent = () => {
  const {
    toast
  } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Get available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];

  // State for combined data from all countries
  const [combinedData, setCombinedData] = useState<Record<string, any>>({});
  const [allYears, setAllYears] = useState<number[]>([]);
  const [allInfluences, setAllInfluences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data for all selected countries
  useEffect(() => {
    const fetchAllCountriesData = async () => {
      if (selectedCountries.length === 0) {
        setCombinedData({});
        setAllYears([]);
        setAllInfluences([]);
        setIsLoading(false);
        return;
      }
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
  }, [selectedCountries, toast]);
  const handleCountriesChange = (countries: string[]) => {
    setSelectedCountries(countries);
    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: `Showing sustainability influences for selected countries`,
        duration: 3000
      });
    }
  };
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Influences</h1>
      
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-4 py-0">
              <h3 className="text-sm font-medium text-gray-700">Select Countries</h3>
              <CountryMultiSelect countries={countries} selectedCountries={selectedCountries} setSelectedCountries={handleCountriesChange} />
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              
              <YearSelector years={allYears} selectedYear={selectedYear} onChange={setSelectedYear} />
            </div>
          </div>
        </div>
      </Card>
      
      {selectedCountries.length === 0 ? <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="text-center py-10 text-gray-500">
            Please select at least one country to view sustainability influences data.
          </div>
        </Card> : <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0 mb-6">
            <TabsTrigger value="yearly" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Yearly View
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yearly">
            {activeTab === "yearly" ? <div className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Influences by Year</h3>
                  <p className="text-sm text-gray-500">
                    Compare influence factors across countries for year {selectedYear}
                  </p>
                </div>
                <InfluencesBarChart data={combinedData} selectedYear={selectedYear} countries={selectedCountries} />
              </div> : null}
          </TabsContent>
          
          <TabsContent value="trends">
            {activeTab === "trends" ? <div className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Influence Trends Over Time</h3>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <InfluenceSelector influences={allInfluences} selectedInfluences={selectedInfluences} onChange={setSelectedInfluences} />
                  </div>
                </div>
                {selectedInfluences.length > 0 ? <InfluencesTrendChart data={combinedData} selectedInfluences={selectedInfluences} countries={selectedCountries} /> : <div className="text-center py-10 text-gray-500">
                    Please select at least one influence factor to view trends.
                  </div>}
              </div> : null}
          </TabsContent>
        </Tabs>}
    </div>;
};
export default MainContent;