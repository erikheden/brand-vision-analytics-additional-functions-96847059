
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTrendsData } from "@/hooks/useTrendsData";
import CountryFocusTab from "./trends/CountryFocusTab";
import AreaFocusTab from "./trends/AreaFocusTab";
import TrendsLoadingState from "./trends/TrendsLoadingState";

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
  isLoading: externalIsLoading,
  error: externalError
}) => {
  const {
    allCountriesData,
    trendMode,
    setTrendMode,
    focusedCountry,
    setFocusedCountry,
    allAreas,
    trendData,
    isPlaceholderData,
    isLoading,
    error
  } = useTrendsData(selectedCountries, selectedAreas, "areas");  // Set default mode to "areas"

  // Combine loading and error states from both sources
  const combinedIsLoading = isLoading || externalIsLoading;
  const combinedError = error || externalError;

  return (
    <div className="space-y-6">
      <TrendsLoadingState 
        isLoading={combinedIsLoading} 
        error={combinedError} 
        selectedCountries={selectedCountries} 
        isPlaceholderData={isPlaceholderData} 
        allCountriesData={allCountriesData} 
      />

      {selectedCountries.length > 0 && !combinedIsLoading && !combinedError && Object.keys(allCountriesData).length > 0 && (
        <div className="space-y-6">
          {isPlaceholderData && (
            <TrendsLoadingState 
              isLoading={false} 
              error={null} 
              selectedCountries={selectedCountries} 
              isPlaceholderData={true} 
              allCountriesData={allCountriesData} 
            />
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
              <CountryFocusTab 
                selectedCountries={selectedCountries} 
                focusedCountry={focusedCountry} 
                setFocusedCountry={setFocusedCountry} 
                allAreas={allAreas} 
                selectedAreas={selectedAreas} 
                setSelectedAreas={setSelectedAreas} 
                trendData={trendData} 
              />
            </TabsContent>
            
            <TabsContent value="areas" className="pt-4">
              <AreaFocusTab 
                selectedCountries={selectedCountries} 
                allAreas={allAreas} 
                selectedAreas={selectedAreas} 
                setSelectedAreas={setSelectedAreas} 
                trendData={trendData} 
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TrendsView;

