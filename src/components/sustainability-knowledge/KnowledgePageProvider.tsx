
import React, { useState, useEffect } from "react";
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

  // Use the custom hook for data fetching
  const { countriesData, allYears, allTerms, isLoading, error } = useKnowledgeData(selectedCountries);

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
    if (countriesData && Object.keys(countriesData).length > 0 && 
        allTerms.length > 0 && selectedTerms.length === 0) {
      
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
      }
    }
  }, [countriesData, selectedCountries, allTerms, selectedYear, selectedTerms.length]);

  const handleSetSelectedTerms = (terms: string[]) => {
    console.log(`Setting selected terms: ${terms.join(', ')}`);
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
