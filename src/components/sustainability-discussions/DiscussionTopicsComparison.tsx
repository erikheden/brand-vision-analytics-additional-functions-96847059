
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { useDiscussionTopicsData, DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import DiscussionTopicsComparisonChart from "./DiscussionTopicsComparisonChart";

interface DiscussionTopicsComparisonProps {
  availableCountries: string[];
}

const DiscussionTopicsComparison: React.FC<DiscussionTopicsComparisonProps> = ({ 
  availableCountries 
}) => {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [allCountriesData, setAllCountriesData] = useState<Record<string, DiscussionTopicData[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // For simplicity, we're using the first country's data to get years
  const { data: firstCountryData = [] } = useDiscussionTopicsData(selectedCountries[0] || "");
  
  // Extract unique years
  const years = React.useMemo(() => {
    if (!firstCountryData.length) return [2023, 2024]; // Default years if no data
    return [...new Set(firstCountryData.map(item => item.year))].sort((a, b) => a - b);
  }, [firstCountryData]);
  
  // Set default to most recent year
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : 2024
  );
  
  // Update selected year when years change
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);
  
  // Fetch data for each selected country
  useEffect(() => {
    const fetchAllCountriesData = async () => {
      if (!selectedCountries.length) {
        setAllCountriesData({});
        return;
      }
      
      setIsLoading(true);
      
      try {
        const countryDataMap: Record<string, DiscussionTopicData[]> = {};
        
        for (const country of selectedCountries) {
          const { data } = await useDiscussionTopicsData(country);
          if (data) {
            countryDataMap[country] = data;
          }
        }
        
        setAllCountriesData(countryDataMap);
      } catch (error) {
        console.error('Error fetching data for countries:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data for some countries",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllCountriesData();
  }, [selectedCountries, toast]);
  
  // Handle country selection
  const handleCountrySelection = (countries: string[]) => {
    if (countries.length > 5) {
      toast({
        title: "Selection limit",
        description: "You can select up to 5 countries for comparison",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedCountries(countries);
  };
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="w-full md:w-2/3">
            <CountryMultiSelect
              countries={availableCountries}
              selectedCountries={selectedCountries}
              setSelectedCountries={handleCountrySelection}
            />
          </div>
          
          <YearSelector
            years={years}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading comparison data...</div>
        ) : selectedCountries.length === 0 ? (
          <div className="text-center py-12">Please select countries to compare discussion topics</div>
        ) : (
          <DiscussionTopicsComparisonChart 
            countriesData={allCountriesData} 
            selectedYear={selectedYear}
            selectedCountries={selectedCountries}
          />
        )}
      </div>
    </Card>
  );
};

export default DiscussionTopicsComparison;
