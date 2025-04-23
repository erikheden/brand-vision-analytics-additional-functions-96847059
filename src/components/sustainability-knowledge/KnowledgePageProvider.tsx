
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KnowledgeData } from "@/hooks/useSustainabilityKnowledge";

type KnowledgePageContextType = {
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedTerms: string[];
  setSelectedTerms: (terms: string[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  countriesData: Record<string, KnowledgeData[]>;
  allYears: number[];
  allTerms: string[];
  isLoading: boolean;
  error: Error | null;
  handleCountriesChange: (countries: string[]) => void;
  handleSetSelectedTerms: (terms: string[]) => void;
};

export const KnowledgePageContext = React.createContext<KnowledgePageContextType>({
  selectedCountries: [],
  setSelectedCountries: () => {},
  selectedYear: 2024,
  setSelectedYear: () => {},
  selectedTerms: [],
  setSelectedTerms: () => {},
  activeTab: "levels",
  setActiveTab: () => {},
  countriesData: {},
  allYears: [],
  allTerms: [],
  isLoading: false,
  error: null,
  handleCountriesChange: () => {},
  handleSetSelectedTerms: () => {},
});

// Helper function to fetch knowledge data for a specific country
const fetchKnowledgeData = async (country: string) => {
  console.log(`Fetching sustainability knowledge data for: ${country}`);
  
  const { data, error } = await supabase
    .from('SBI_Knowledge')
    .select('*')
    .eq('country', country)
    .order('year', { ascending: true });
  
  if (error) {
    console.error('Error fetching knowledge data:', error);
    throw error;
  }
  
  return data as KnowledgeData[];
};

export const KnowledgePageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("levels");

  // State to hold combined data from all selected countries
  const [countriesData, setCountriesData] = useState<Record<string, KnowledgeData[]>>({});
  const [allYears, setAllYears] = useState<number[]>([]);
  const [allTerms, setAllTerms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch data for each selected country
  useEffect(() => {
    const fetchAllData = async () => {
      if (selectedCountries.length === 0) {
        setCountriesData({});
        setAllYears([]);
        setAllTerms([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const allData: Record<string, KnowledgeData[]> = {};
        let yearsSet = new Set<number>();
        let termsSet = new Set<string>();
        
        await Promise.all(selectedCountries.map(async (country) => {
          try {
            const countryData = await fetchKnowledgeData(country);
            
            allData[country] = countryData;
            
            // Extract years and terms
            countryData.forEach(item => {
              if (typeof item.year === 'number') {
                yearsSet.add(item.year);
              }
              if (item.term) {
                termsSet.add(item.term);
              }
            });
          } catch (err) {
            console.error(`Error fetching data for ${country}:`, err);
          }
        }));
        
        console.log('Fetched data for countries:', Object.keys(allData));
        console.log('Sample data:', Object.values(allData)[0]?.slice(0, 2));
        
        setCountriesData(allData);
        
        const years = Array.from(yearsSet).sort((a, b) => a - b);
        setAllYears(years);
        setAllTerms(Array.from(termsSet).sort());
        
        // Set default year to the most recent one
        if (years.length > 0) {
          const maxYear = Math.max(...years);
          setSelectedYear(maxYear);
        }
        
        // Auto-select top terms for initial view if no terms are selected
        if (termsSet.size > 0 && selectedTerms.length === 0) {
          // Get the top 5 terms by average percentage for the selected year
          const topTerms = getTopTermsByPercentage(allData, selectedCountries, Array.from(termsSet), selectedYear, 5);
          if (topTerms.length > 0) {
            setSelectedTerms(topTerms);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching knowledge data:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [selectedCountries]);

  // Helper function to get top terms by percentage
  const getTopTermsByPercentage = (
    data: Record<string, KnowledgeData[]>,
    countries: string[],
    terms: string[],
    year: number,
    limit: number
  ): string[] => {
    // Create a map to store average percentage for each term
    const termPercentages: Record<string, { sum: number; count: number }> = {};
    
    // Calculate average percentage for each term across countries
    countries.forEach(country => {
      const countryData = data[country] || [];
      const yearData = countryData.filter(item => item.year === year);
      
      yearData.forEach(item => {
        if (!termPercentages[item.term]) {
          termPercentages[item.term] = { sum: 0, count: 0 };
        }
        termPercentages[item.term].sum += item.percentage;
        termPercentages[item.term].count += 1;
      });
    });
    
    // Calculate average and sort terms by average percentage
    const termAverages = Object.entries(termPercentages)
      .map(([term, data]) => ({
        term,
        average: data.sum / data.count
      }))
      .sort((a, b) => b.average - a.average);
    
    // Return top terms
    return termAverages.slice(0, limit).map(item => item.term);
  };

  const handleCountriesChange = (countries: string[]) => {
    setSelectedCountries(countries);
    // Reset selected terms when countries change to trigger auto-selection of top terms
    setSelectedTerms([]);
    
    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: "Loading sustainability knowledge data for selected countries",
        duration: 3000,
      });
    }
  };

  const handleSetSelectedTerms = (terms: string[]) => {
    setSelectedTerms(terms);
  };

  const value = {
    selectedCountries,
    setSelectedCountries,
    selectedYear,
    setSelectedYear,
    selectedTerms,
    setSelectedTerms,
    activeTab,
    setActiveTab,
    countriesData,
    allYears,
    allTerms,
    isLoading,
    error,
    handleCountriesChange,
    handleSetSelectedTerms,
  };

  return (
    <KnowledgePageContext.Provider value={value}>
      {children}
    </KnowledgePageContext.Provider>
  );
};

export const useKnowledgePage = () => {
  const context = React.useContext(KnowledgePageContext);
  if (context === undefined) {
    throw new Error("useKnowledgePage must be used within a KnowledgePageProvider");
  }
  return context;
};
