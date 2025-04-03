
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import AreaSelector from "@/components/sustainability-priorities/AreaSelector";
import PrioritiesTrendChart from "./PrioritiesTrendChart";
import { useMultiCountryMateriality } from "@/hooks/useMultiCountryMateriality";

interface TrendsViewProps {
  selectedCountries: string[];
  areas: string[];
  selectedAreas: string[];
  setSelectedAreas: (areas: string[]) => void;
  isLoading: boolean;
  error: Error | null;
}

const TrendsView: React.FC<TrendsViewProps> = ({
  selectedCountries,
  areas,
  selectedAreas,
  setSelectedAreas,
  isLoading,
  error
}) => {
  const [trendMode, setTrendMode] = useState<string>("countries");
  const [focusedCountry, setFocusedCountry] = useState<string>("");
  
  // Fetch data for multiple countries
  const { 
    data: allCountriesData = {}, 
    isLoading: isLoadingMulti, 
    error: multiError 
  } = useMultiCountryMateriality(selectedCountries);
  
  // Extract all areas from all countries' data
  const allAreas = React.useMemo(() => {
    const areasSet = new Set<string>();
    Object.values(allCountriesData).forEach(countryData => {
      countryData.forEach(item => areasSet.add(item.materiality_area));
    });
    return Array.from(areasSet).sort();
  }, [allCountriesData]);
  
  // Flatten data for the focused country or selected area
  const trendData = React.useMemo(() => {
    if (trendMode === "countries") {
      // For country-focused trend, return data for the focused country
      return focusedCountry && allCountriesData[focusedCountry] 
        ? allCountriesData[focusedCountry] 
        : [];
    } else {
      // For area-focused trend, combine data from all countries
      const combinedData: any[] = [];
      Object.entries(allCountriesData).forEach(([country, data]) => {
        // Add country name to each data point
        data.forEach(item => {
          combinedData.push({
            ...item,
            materiality_area: `${item.materiality_area} (${country})`
          });
        });
      });
      return combinedData;
    }
  }, [trendMode, focusedCountry, allCountriesData]);
  
  // Handle clearing selected areas
  const handleClearAreas = () => {
    setSelectedAreas([]);
  };
  
  // Determine if we're using placeholder data
  const isPlaceholderData = Object.values(allCountriesData).some(countryData => 
    countryData.length > 0 && countryData.every(item => !item.row_id)
  );
  
  // When countries change, ensure focusedCountry is valid
  useEffect(() => {
    // If no country is focused but we have selected countries, set the first one as focused
    if ((!focusedCountry || !selectedCountries.includes(focusedCountry)) && selectedCountries.length > 0) {
      setFocusedCountry(selectedCountries[0]);
    }
    // If there are no selected countries, clear the focused country
    else if (selectedCountries.length === 0) {
      setFocusedCountry("");
    }
  }, [selectedCountries, focusedCountry]);
  
  return (
    <div className="space-y-6">
      {error || multiError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sustainability trends data: {
              (error || multiError) instanceof Error 
                ? (error || multiError)?.message 
                : 'Unknown error'
            }
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading || isLoadingMulti ? (
        <div className="text-center py-10">Loading data...</div>
      ) : null}

      {!selectedCountries.length && !isLoading && !isLoadingMulti ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Please select at least one country to view sustainability trends.</p>
        </div>
      ) : null}

      {selectedCountries.length > 0 && 
       !isLoading && 
       !isLoadingMulti && 
       Object.keys(allCountriesData).length > 0 ? (
        <div className="space-y-6">
          {isPlaceholderData && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Using Sample Data</AlertTitle>
              <AlertDescription>
                No actual data was found for some countries. Sample data is being displayed for demonstration purposes.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={trendMode} onValueChange={setTrendMode} className="w-full">
            <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
              <TabsTrigger 
                value="countries" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Country Focus
              </TabsTrigger>
              <TabsTrigger 
                value="areas" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Area Focus
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="countries" className="pt-4">
              <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-4">
                <p className="text-gray-600">
                  View trends of sustainability priorities over time for a specific country.
                </p>
              </Card>
              
              {selectedCountries.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-1">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#34502b]">
                        Focus on Country:
                      </label>
                      <select 
                        value={focusedCountry}
                        onChange={(e) => setFocusedCountry(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {selectedCountries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <AreaSelector
                  areas={allAreas}
                  selectedAreas={selectedAreas}
                  onChange={setSelectedAreas}
                  onClearAreas={handleClearAreas}
                />

                <PrioritiesTrendChart
                  data={trendData}
                  selectedAreas={selectedAreas}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="areas" className="pt-4">
              <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-4">
                <p className="text-gray-600">
                  Compare trends of the same sustainability priority across different countries.
                </p>
              </Card>
              
              <div className="space-y-4">
                <AreaSelector
                  areas={allAreas.filter(area => !area.includes('('))} // Filter out compound names
                  selectedAreas={selectedAreas}
                  onChange={setSelectedAreas}
                  onClearAreas={handleClearAreas}
                />

                <PrioritiesTrendChart
                  data={trendData}
                  selectedAreas={selectedAreas.flatMap(area => 
                    selectedCountries.map(country => `${area} (${country})`)
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}

      {selectedCountries.length > 0 && 
       !isLoading && 
       !isLoadingMulti && 
       Object.keys(allCountriesData).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">
            No sustainability trends data found for the selected countries.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default TrendsView;
