
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
  selectedCountries: string[];
  selectedYear: number;
}

const DiscussionTopicsComparison: React.FC<DiscussionTopicsComparisonProps> = ({
  availableCountries,
  allCountriesData,
  isLoading,
  error,
  selectedCountries,
  selectedYear
}) => {
  const { toast } = useToast();
  
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
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
  );
};

export default DiscussionTopicsComparison;
