
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CountryComparisonSelector from './CountryComparisonSelector';
import { useMultiCountryMateriality } from '@/hooks/useMultiCountryMateriality';
import AreaSelector from './AreaSelector';
import YearSelector from './YearSelector';
import ComparisonBarChart from './ComparisonBarChart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CountryComparisonPanelProps {
  availableCountries: string[];
}

const CountryComparisonPanel: React.FC<CountryComparisonPanelProps> = ({ availableCountries }) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
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

  return (
    <Card className="bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-[#34502b]">Country Comparison</CardTitle>
        <CardDescription>
          Compare sustainability priorities across different countries
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <CountryComparisonSelector 
          availableCountries={availableCountries}
          selectedCountries={selectedCountries}
          onCountriesChange={setSelectedCountries}
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
