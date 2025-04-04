
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CountryComparisonSelector from './CountryComparisonSelector';
import { useMultiCountryMateriality } from '@/hooks/useMultiCountryMateriality';
import AreaSelector from './AreaSelector';
import YearSelector from './YearSelector';
import ComparisonBarChart from './ComparisonBarChart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSelectionData } from '@/hooks/useSelectionData';

interface CountryComparisonPanelProps {
  availableCountries: string[];
}

const CountryComparisonPanel: React.FC<CountryComparisonPanelProps> = ({ availableCountries }) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  // Get the countries data if not provided
  // Fix: Pass empty string and empty array to match required parameters
  const { countries: fetchedCountries } = useSelectionData("", []);
  const allCountries = availableCountries?.length > 0 ? availableCountries : fetchedCountries || [];
  
  const { 
    data: allCountriesData = {}, 
    isLoading, 
    error 
  } = useMultiCountryMateriality(selectedCountries);
  
  // Extract all unique years and areas from the data
  const allYears = React.useMemo(() => {
    const yearsSet = new Set<number>();
    Object.values(allCountriesData).forEach(countryData => {
      countryData.forEach(item => yearsSet.add(item.year));
    });
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [allCountriesData]);
  
  // Set default to most recent year
  const [selectedYear, setSelectedYear] = useState<number>(
    allYears.length > 0 ? Math.max(...allYears) : 2024
  );
  
  // Update selected year when years change
  React.useEffect(() => {
    if (allYears.length > 0) {
      setSelectedYear(Math.max(...allYears));
    }
  }, [allYears]);
  
  // Get all unique areas across all selected countries
  const allAreas = React.useMemo(() => {
    const areasSet = new Set<string>();
    Object.values(allCountriesData).forEach(countryData => {
      countryData.forEach(item => areasSet.add(item.materiality_area));
    });
    return Array.from(areasSet).sort();
  }, [allCountriesData]);

  // Clear selected areas when the available areas change
  useEffect(() => {
    if (allAreas.length > 0 && selectedAreas.length > 0) {
      // Check if any of the selected areas are no longer available
      const newAreas = selectedAreas.filter(area => allAreas.includes(area));
      if (newAreas.length !== selectedAreas.length) {
        setSelectedAreas(newAreas);
      }
    }
  }, [allAreas, selectedAreas]);

  // Handle clearing all areas
  const handleClearAreas = () => {
    console.log("Clearing all selected areas");
    setSelectedAreas([]);
  };

  // IMPORTANT: Remove the auto-selection of countries
  // This was causing countries to be permanently selected
  // useEffect(() => {
  //   if (selectedCountries.length === 0 && allCountries.length > 0) {
  //     // Select first 3 countries or all if fewer
  //     const initialCount = Math.min(3, allCountries.length);
  //     setSelectedCountries(allCountries.slice(0, initialCount));
  //   }
  // }, [allCountries, selectedCountries.length]);

  // Log selected countries for debugging
  useEffect(() => {
    console.log("Selected countries:", selectedCountries);
  }, [selectedCountries]);

  return (
    <Card className="bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-[#34502b]">Country Comparison</CardTitle>
            <CardDescription>
              Compare sustainability priorities across different countries
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <CountryComparisonSelector 
          availableCountries={allCountries}
          selectedCountries={selectedCountries}
          onCountriesChange={(countries) => {
            console.log("Countries changed to:", countries);
            setSelectedCountries(countries);
          }}
        />
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load comparison data: {error instanceof Error ? error.message : 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-pulse text-[#34502b]">Loading comparison data...</div>
          </div>
        )}
        
        {!isLoading && selectedCountries.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Please select at least one country to compare sustainability priorities.
          </div>
        )}
        
        {!isLoading && selectedCountries.length > 0 && Object.keys(allCountriesData).length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <YearSelector 
                  years={allYears.length > 0 ? allYears : [2023, 2024]}
                  selectedYear={selectedYear}
                  onChange={setSelectedYear}
                />
              </div>
              <div>
                {allAreas.length > 0 && (
                  <AreaSelector
                    areas={allAreas}
                    selectedAreas={selectedAreas}
                    onChange={setSelectedAreas}
                    onClearAreas={handleClearAreas}
                  />
                )}
              </div>
            </div>
            
            <ComparisonBarChart 
              allCountriesData={allCountriesData}
              selectedAreas={selectedAreas}
              selectedYear={selectedYear}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryComparisonPanel;
