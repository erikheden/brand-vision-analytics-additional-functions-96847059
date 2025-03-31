
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { useMultiCountryMateriality } from "@/hooks/useMultiCountryMateriality";
import ComparisonBarChart from "./ComparisonBarChart";

interface PrioritiesViewProps {
  selectedCountries: string[];
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  isLoading: boolean;
  error: Error | null;
}

const PrioritiesView: React.FC<PrioritiesViewProps> = ({
  selectedCountries,
  years,
  selectedYear,
  setSelectedYear,
  isLoading,
  error
}) => {
  // Fetch data for multiple countries
  const { 
    data: allCountriesData = {}, 
    isLoading: isLoadingMulti, 
    error: multiError 
  } = useMultiCountryMateriality(selectedCountries);

  // Determine if we're showing placeholder data
  const isPlaceholderData = Object.values(allCountriesData).some(countryData => 
    countryData.length > 0 && countryData.every(item => !item.row_id)
  );
  
  return (
    <div className="space-y-6">
      {error || multiError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sustainability priorities data: {
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
          <p className="text-lg text-gray-600">Please select at least one country to view sustainability priorities.</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <YearSelector
                years={years.length > 0 ? years : [2023, 2024]}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
          </div>

          <ComparisonBarChart 
            allCountriesData={allCountriesData}
            selectedAreas={[]} // Show all areas by default
            selectedYear={selectedYear}
          />
        </div>
      ) : null}

      {selectedCountries.length > 0 && 
       !isLoading && 
       !isLoadingMulti && 
       Object.keys(allCountriesData).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">
            No sustainability priorities data found for the selected countries.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default PrioritiesView;
