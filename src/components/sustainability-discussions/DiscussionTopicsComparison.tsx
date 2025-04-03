
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import DiscussionTopicsComparisonChart from "./DiscussionTopicsComparisonChart";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface DiscussionTopicsComparisonProps {
  availableCountries: string[];
  allCountriesData: DiscussionTopicData[];
  isLoading: boolean;
  error: Error | null;
}

const DiscussionTopicsComparison: React.FC<DiscussionTopicsComparisonProps> = ({
  availableCountries,
  allCountriesData,
  isLoading,
  error
}) => {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  
  // Process data by country
  const countriesData = React.useMemo(() => {
    if (!allCountriesData || allCountriesData.length === 0) return {};
    
    // Group data by country
    return allCountriesData.reduce((acc, item) => {
      if (!item.country) return acc;
      
      const country = item.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(item);
      return acc;
    }, {} as Record<string, DiscussionTopicData[]>);
  }, [allCountriesData]);
  
  // Get all available years from the data
  const years = React.useMemo(() => {
    if (!allCountriesData || allCountriesData.length === 0) return [2023, 2024];
    
    const uniqueYears = [...new Set(allCountriesData.map(item => item.year))];
    return uniqueYears.sort((a, b) => a - b);
  }, [allCountriesData]);
  
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : 2024
  );
  
  // Update selectedYear when years array changes
  useEffect(() => {
    if (years.length > 0) {
      const maxYear = Math.max(...years);
      if (!years.includes(selectedYear)) {
        setSelectedYear(maxYear);
      }
    }
  }, [years, selectedYear]);
  
  const handleCountriesChange = (countries: string[]) => {
    setSelectedCountries(countries);
    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: `Selected ${countries.length} countries for comparison`,
        duration: 3000,
      });
    }
  };
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Select Countries</h3>
              <p className="text-xs text-gray-500 mb-2">Choose countries to compare discussion topics</p>
              <CountryMultiSelect 
                countries={availableCountries} 
                selectedCountries={selectedCountries} 
                setSelectedCountries={setSelectedCountries} 
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Select Year</h3>
              <YearSelector
                years={years}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="md:col-span-3">
        {selectedCountries.length === 0 ? (
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
            <div className="text-center py-12 text-[#34502b]/70">
              Please select countries to compare discussion topics
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
            <DiscussionTopicsComparisonChart 
              countriesData={countriesData} 
              selectedYear={selectedYear}
              selectedCountries={selectedCountries}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiscussionTopicsComparison;
