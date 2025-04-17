
import React from "react";
import { useTrendsData } from "@/hooks/useTrendsData";
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
    focusedCountry,
    setFocusedCountry,
    allAreas,
    trendData,
    isPlaceholderData,
    isLoading,
    error
  } = useTrendsData(selectedCountries, selectedAreas);  // Remove trendMode parameter

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
          
          <div className="pt-4">
            <AreaFocusTab 
              selectedCountries={selectedCountries} 
              allAreas={allAreas} 
              selectedAreas={selectedAreas} 
              setSelectedAreas={setSelectedAreas} 
              trendData={trendData} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendsView;
