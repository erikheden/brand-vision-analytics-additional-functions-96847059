import { useState, useEffect } from 'react';
import { useSustainabilityImpactData } from '@/hooks/useSustainabilityImpactData';
import { useToast } from '@/components/ui/use-toast';
import { normalizeCountry } from '@/components/CountrySelect';

export const useImpactCategories = (selectedCountries: string[]) => {
  const { toast } = useToast();
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);

  // Set active country when selectedCountries changes and normalize the country code
  useEffect(() => {
    if (selectedCountries.length > 0 && (!activeCountry || !selectedCountries.includes(activeCountry))) {
      const normalizedCountry = normalizeCountry(selectedCountries[0]);
      console.log("Setting active country to:", normalizedCountry);
      setActiveCountry(normalizedCountry);
      
      // Initialize active countries with just the first country
      if (activeCountries.length === 0) {
        setActiveCountries([normalizedCountry]);
      }
    }
  }, [selectedCountries, activeCountry]);

  // When comparing countries, we need to load data for all active countries
  // For now, we'll use the first active country for data loading
  // Later we'll update this to handle multiple countries
  const normalizedActiveCountry = activeCountry ? normalizeCountry(activeCountry) : "";
  console.log("Using normalized active country for data fetching:", normalizedActiveCountry);

  const {
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error
  } = useSustainabilityImpactData(normalizedActiveCountry);

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      console.log("Auto-selecting first category:", categories[0]);
      setSelectedCategories([categories[0]]);
    }
  }, [categories]);

  // Auto-select most recent year when years data changes
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      const mostRecentYear = years[years.length - 1];
      console.log("Auto-selecting most recent year:", mostRecentYear);
      setSelectedYear(mostRecentYear);
    }
  }, [years, selectedYear]);

  // Auto-select all impact levels when they load
  useEffect(() => {
    if (impactLevels.length > 0 && selectedLevels.length === 0) {
      console.log("Auto-selecting all impact levels:", impactLevels);
      setSelectedLevels([...impactLevels]);
    }
  }, [impactLevels]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle impact level selection
  const toggleImpactLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  // Handle country change with normalized country codes
  const handleCountryChange = (country: string) => {
    const normalizedCountry = normalizeCountry(country);
    
    if (!selectedCountries.includes(normalizedCountry)) {
      if (!activeCountry) {
        setActiveCountry(normalizedCountry);
        setActiveCountries([normalizedCountry]);
      }
      return;
    }

    // In comparison mode, toggle the country in active countries list
    if (comparisonMode) {
      setActiveCountries(prev => {
        // If the country is already active, remove it (unless it's the last one)
        if (prev.includes(normalizedCountry)) {
          return prev.length > 1 ? prev.filter(c => c !== normalizedCountry) : prev;
        } else {
          // Otherwise add it to the active countries
          return [...prev, normalizedCountry];
        }
      });
      return;
    }

    // In single country mode, just set the active country
    if (normalizedCountry === activeCountry && selectedCountries.length === 1) {
      return;
    }

    setActiveCountry(normalizedCountry);
    setActiveCountries([normalizedCountry]);
  };

  // Toggle comparison mode
  const toggleComparisonMode = (enabled: boolean) => {
    setComparisonMode(enabled);
    
    if (enabled) {
      // When enabling comparison mode, start with the active country
      if (activeCountries.length === 0 && activeCountry) {
        setActiveCountries([activeCountry]);
      }
    } else {
      // When disabling comparison mode, just keep the first active country
      if (activeCountries.length > 0) {
        setActiveCountry(activeCountries[0]);
        setActiveCountries([activeCountries[0]]);
      }
    }
  };

  // Report any errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading impact data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Notify user if no data is available
  useEffect(() => {
    if (!isLoading && activeCountry && data && data.length === 0) {
      toast({
        title: "No data available",
        description: `No sustainability impact data is available for ${activeCountry}`,
        variant: "default",
      });
    }
  }, [activeCountry, data, isLoading, toast]);

  return {
    // State
    activeCountry,
    activeCountries,
    comparisonMode,
    selectedCategories,
    selectedYear,
    selectedLevels,
    // Data
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    // Actions
    setActiveCountry,
    setActiveCountries,
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel,
    toggleComparisonMode
  };
};
