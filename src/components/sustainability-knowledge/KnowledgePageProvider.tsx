
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
  selectedYear: 2023,
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
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]); // Initialize with empty array
  const [activeTab, setActiveTab] = useState<string>("levels");

  const { countriesData, allYears, allTerms, isLoading, error } = useKnowledgeData(selectedCountries);

  console.log("KnowledgePageProvider state:", {
    countriesCount: Object.keys(countriesData || {}).length,
    allYears,
    allTerms,
    selectedYear,
    selectedTerms,
    isLoading
  });

  useEffect(() => {
    if (allYears.length > 0 && !allYears.includes(selectedYear)) {
      const mostRecentYear = allYears[allYears.length - 1];
      console.log(`Updating selected year to most recent: ${mostRecentYear}`);
      setSelectedYear(mostRecentYear);
    }
  }, [allYears, selectedYear]);

  const handleCountriesChange = (countries: string[]) => {
    console.log(`Countries selection changed to: ${countries.join(', ')}`);
    setSelectedCountries(countries);
    setSelectedTerms([]); // Reset terms selection when countries change

    if (countries.length > 0) {
      toast({
        title: "Countries Selected",
        description: "Loading sustainability knowledge data for selected countries",
        duration: 3000,
      });
    }
  };

  // Remove the auto-select effect that was setting all terms
  // This ensures no terms are selected by default

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
