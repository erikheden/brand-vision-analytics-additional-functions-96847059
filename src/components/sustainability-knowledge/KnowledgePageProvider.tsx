
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSustainabilityKnowledge, KnowledgeData } from "@/hooks/useSustainabilityKnowledge";

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

export const KnowledgePageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("levels");

  // Available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];
  
  // State to hold combined data from all selected countries
  const [countriesData, setCountriesData] = useState<Record<string, KnowledgeData[]>>({});
  const [allYears, setAllYears] = useState<number[]>([]);
  const [allTerms, setAllTerms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
            // Use the hook to get the fetching function
            const { fetchKnowledgeData } = useSustainabilityKnowledge(country);
            const countryData = await fetchKnowledgeData();
            
            allData[country] = countryData;
            
            // Extract years and terms
            countryData.forEach(item => {
              yearsSet.add(item.year);
              termsSet.add(item.term);
            });
          } catch (err) {
            console.error(`Error fetching data for ${country}:`, err);
          }
        }));
        
        setCountriesData(allData);
        setAllYears(Array.from(yearsSet).sort((a, b) => a - b));
        setAllTerms(Array.from(termsSet).sort());
        
        // Set default year to the most recent one
        if (yearsSet.size > 0) {
          const maxYear = Math.max(...Array.from(yearsSet));
          setSelectedYear(maxYear);
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

  const handleCountriesChange = (countries: string[]) => {
    setSelectedCountries(countries);
    setSelectedTerms([]);
    
    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: "Showing sustainability knowledge for selected countries",
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
