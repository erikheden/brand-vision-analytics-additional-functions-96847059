
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { fetchAllDiscussionTopicsData, DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
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
  const [years, setYears] = useState<number[]>([2023, 2024]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  
  // Fetch data for each selected country
  useEffect(() => {
    const loadCountriesData = async () => {
      if (!selectedCountries.length) {
        setAllCountriesData({});
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch all data at once instead of country by country
        const allData = await fetchAllDiscussionTopicsData(selectedCountries);
        
        // Group by country
        const countryGroups: Record<string, DiscussionTopicData[]> = {};
        
        allData.forEach(item => {
          if (!countryGroups[item.country]) {
            countryGroups[item.country] = [];
          }
          countryGroups[item.country].push(item);
        });
        
        // Extract years for year selector
        const allYears = [...new Set(allData.map(item => item.year))].sort();
        if (allYears.length > 0) {
          setYears(allYears);
          setSelectedYear(Math.max(...allYears));
        }
        
        setAllCountriesData(countryGroups);
        console.log("Loaded data for countries:", Object.keys(countryGroups));
        
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
    
    loadCountriesData();
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
