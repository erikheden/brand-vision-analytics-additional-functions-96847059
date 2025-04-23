
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { KnowledgeData } from "@/hooks/useSustainabilityKnowledge";
import { useKnowledgeData } from "./hooks/useKnowledgeData";
import { getTopTermsByPercentage } from "./utils/knowledgeUtils";

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
  selectedYear: 2023, // Changed from 2024 to 2023 to match likely available data
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
  const [selectedYear, setSelectedYear] = useState<number>(2023); // Changed from 2024 to 2023
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("levels");

  // Use the custom hook for data fetching
  const { countriesData, allYears, allTerms, isLoading, error } = useKnowledgeData(selectedCountries);

  console.log("KnowledgePageProvider state:", {
    countriesCount: Object.keys(countriesData || {}).length,
    allYears,
    allTerms,
    selectedYear,
    selectedTerms,
    isLoading
  });

  // Update selected year when years array changes
  useEffect(() => {
    if (allYears.length > 0 && !allYears.includes(selectedYear)) {
      const mostRecentYear = allYears[allYears.length - 1];
      console.log(`Updating selected year to most recent: ${mostRecentYear}`);
      setSelectedYear(mostRecentYear); // Set to most recent year
    }
  }, [allYears, selectedYear]);

  const handleCountriesChange = (countries: string[]) => {
    console.log(`Countries selection changed to: ${countries.join(', ')}`);
    setSelectedCountries(countries);
    setSelectedTerms([]); // Reset selected terms to trigger auto-selection
    
    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: "Loading sustainability knowledge data for selected countries",
        duration: 3000,
      });
    }
  };

  // Auto-select top terms when data changes
  useEffect(() => {
    // Only proceed if we have data, countries, and no terms are selected yet
    if (countriesData && 
        Object.keys(countriesData).length > 0 && 
        selectedCountries.length > 0 && 
        allTerms.length > 0 && 
        selectedTerms.length === 0) {
      
      console.log("Trying to auto-select terms with:", {
        hasCountriesData: Object.keys(countriesData).length > 0,
        countriesCount: selectedCountries.length,
        termsCount: allTerms.length,
        selectedYear
      });
      
      const topTerms = getTopTermsByPercentage(
        countriesData,
        selectedCountries,
        allTerms,
        selectedYear,
        5
      );
      
      console.log(`Auto-selecting top terms: ${topTerms.join(', ')}`);
      
      if (topTerms.length > 0) {
        setSelectedTerms(topTerms);
      } else {
        // If no top terms were found, but we have terms available,
        // just select the first few as a fallback
        if (allTerms.length > 0) {
          const fallbackTerms = allTerms.slice(0, Math.min(5, allTerms.length));
          console.log(`Using fallback terms: ${fallbackTerms.join(', ')}`);
          setSelectedTerms(fallbackTerms);
        }
      }
    }
  }, [countriesData, selectedCountries, allTerms, selectedYear, selectedTerms.length]);

  const handleSetSelectedTerms = useCallback((terms: string[]) => {
    console.log(`Setting selected terms: ${terms.join(', ')}`);
    setSelectedTerms(terms);
  }, []);

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
