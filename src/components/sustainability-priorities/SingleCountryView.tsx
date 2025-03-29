
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CountrySelect from "@/components/CountrySelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import AreaSelector from "@/components/sustainability-priorities/AreaSelector";
import PrioritiesBarChart from "@/components/sustainability-priorities/PrioritiesBarChart";
import PrioritiesTrendChart from "@/components/sustainability-priorities/PrioritiesTrendChart";
import AgeGroupSelector from "@/components/sustainability-priorities/AgeGroupSelector";
import { MaterialityData, AgeGroup } from "@/hooks/useGeneralMaterialityData";

interface SingleCountryViewProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  materialityData: MaterialityData[];
  isLoading: boolean;
  error: Error | null;
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  areas: string[];
  selectedAreas: string[];
  setSelectedAreas: (areas: string[]) => void;
  countries: string[];
  ageGroups: AgeGroup[];
  selectedAgeId: number | null;
  setSelectedAgeId: (ageId: number | null) => void;
  isLoadingAgeGroups: boolean;
}

const SingleCountryView: React.FC<SingleCountryViewProps> = ({
  selectedCountry,
  setSelectedCountry,
  materialityData,
  isLoading,
  error,
  years,
  selectedYear,
  setSelectedYear,
  areas,
  selectedAreas,
  setSelectedAreas,
  countries,
  ageGroups,
  selectedAgeId,
  setSelectedAgeId,
  isLoadingAgeGroups,
}) => {
  return (
    <div className="space-y-6 mt-0">
      {/* Country Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CountrySelect
            selectedCountry={selectedCountry}
            countries={countries}
            onCountryChange={setSelectedCountry}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sustainability priorities data: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="text-center py-10">Loading data...</div>
      )}

      {!selectedCountry && !isLoading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Please select a country to view sustainability priorities.</p>
        </div>
      )}

      {selectedCountry && materialityData.length > 0 && !isLoading && (
        <div className="space-y-8">
          {/* Bar Chart Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <YearSelector
                  years={years}
                  selectedYear={selectedYear}
                  onChange={setSelectedYear}
                />
              </div>
              <div className="md:col-span-1">
                <AgeGroupSelector
                  ageGroups={ageGroups}
                  selectedAgeId={selectedAgeId}
                  onChange={setSelectedAgeId}
                  isLoading={isLoadingAgeGroups}
                />
              </div>
            </div>

            <PrioritiesBarChart
              data={materialityData}
              selectedYear={selectedYear}
              selectedAgeId={selectedAgeId}
            />
          </div>

          {/* Line Chart Section */}
          <div className="space-y-4">
            <AreaSelector
              areas={areas}
              selectedAreas={selectedAreas}
              onChange={setSelectedAreas}
            />

            <PrioritiesTrendChart
              data={materialityData}
              selectedAreas={selectedAreas}
            />
          </div>
        </div>
      )}

      {selectedCountry && materialityData.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">No sustainability priorities data found for {selectedCountry}. Sample data will be shown instead.</p>
        </div>
      )}
    </div>
  );
};

export default SingleCountryView;
