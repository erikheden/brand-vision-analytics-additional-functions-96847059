
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSustainabilityKnowledge, KnowledgeData } from "@/hooks/useSustainabilityKnowledge";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import KnowledgeLevelsTab from "./KnowledgeLevelsTab";
import KnowledgeTrendsTab from "./KnowledgeTrendsTab";
import CountryComparisonTab from "./CountryComparisonTab";

const MainContent = () => {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("levels");

  // Available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];
  
  // State to hold combined data from all selected countries
  const [countriesData, setCountriesData] = useState<Record<string, KnowledgeData[]>>({});
  const [allYears, setAllYears] = useState<number[]>([]);
  const [allTerms, setAllTerms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch data for each selected country
  useEffect(() => {
    const fetchAllData = async () => {
      if (selectedCountries.length === 0) {
        setCountriesData({});
        setAllYears([]);
        setAllTerms([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const allData: Record<string, KnowledgeData[]> = {};
        let yearsSet = new Set<number>();
        let termsSet = new Set<string>();
        
        await Promise.all(selectedCountries.map(async (country) => {
          try {
            // Use the hook's fetch function directly
            const { data: fetchKnowledgeData } = useSustainabilityKnowledge(country);
            const countryData = await fetchKnowledgeData();
            
            allData[country] = countryData;
            
            // Extract years and terms
            countryData.forEach(item => {
              yearsSet.add(item.year);
              termsSet.add(item.term);
            });
          } catch (err) {
            console.error(`Error fetching data for ${country}:`, err);
          }
        }));
        
        setCountriesData(allData);
        setAllYears(Array.from(yearsSet).sort((a, b) => a - b));
        setAllTerms(Array.from(termsSet).sort());
        
        // Set default year to the most recent one
        if (yearsSet.size > 0) {
          const maxYear = Math.max(...Array.from(yearsSet));
          setSelectedYear(maxYear);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching knowledge data:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [selectedCountries]);

  const handleCountriesChange = (countries: string[]) => {
    setSelectedCountries(countries);
    setSelectedTerms([]);
    
    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: "Showing sustainability knowledge for selected countries",
        duration: 3000,
      });
    }
  };

  const handleSetSelectedTerms = (terms: string[]) => {
    setSelectedTerms(terms);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Knowledge</h1>
      
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                years={allYears}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
          </div>
        </div>
      </Card>
      
      {selectedCountries.length === 0 ? (
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="text-center py-10 text-gray-500">
            Please select at least one country to view sustainability knowledge data.
          </div>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0 mb-6">
            <TabsTrigger value="levels" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Knowledge Levels
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Knowledge Trends
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Country Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="mt-0">
            {selectedCountries.length === 1 ? (
              <KnowledgeLevelsTab 
                data={countriesData[selectedCountries[0]] || []}
                years={allYears}
                selectedYear={selectedYear}
                selectedTerms={selectedTerms}
                selectedCountry={selectedCountries[0]}
                setSelectedYear={setSelectedYear}
              />
            ) : (
              <div className="text-center py-6 text-gray-500">
                Please select only one country for Knowledge Levels view
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="mt-0">
            {selectedCountries.length === 1 ? (
              <KnowledgeTrendsTab 
                data={countriesData[selectedCountries[0]] || []}
                terms={allTerms}
                selectedTerms={selectedTerms}
                selectedCountry={selectedCountries[0]}
                setSelectedTerms={handleSetSelectedTerms}
              />
            ) : (
              <div className="text-center py-6 text-gray-500">
                Please select only one country for Knowledge Trends view
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="mt-0">
            <CountryComparisonTab
              selectedCountries={selectedCountries}
              terms={allTerms}
              countriesData={countriesData}
              selectedYear={selectedYear}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MainContent;
