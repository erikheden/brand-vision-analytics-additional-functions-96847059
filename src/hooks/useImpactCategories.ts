
import { useState, useEffect } from 'react';
import { useSustainabilityImpactData } from '@/hooks/useSustainabilityImpactData';
import { useToast } from '@/components/ui/use-toast';

export const useImpactCategories = (selectedCountries: string[]) => {
  const { toast } = useToast();
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Set active country when selectedCountries changes
  useEffect(() => {
    if (selectedCountries.length > 0 && (!activeCountry || !selectedCountries.includes(activeCountry))) {
      console.log("Setting active country to:", selectedCountries[0]);
      setActiveCountry(selectedCountries[0]);
    }
  }, [selectedCountries, activeCountry]);

  const {
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error
  } = useSustainabilityImpactData(activeCountry);

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

  // Handle country change
  const handleCountryChange = (country: string) => {
    if (!selectedCountries.includes(country)) {
      if (!activeCountry) {
        setActiveCountry(country);
      }
      return;
    }

    if (country === activeCountry && selectedCountries.length === 1) {
      return;
    }

    if (country === activeCountry) {
      const remainingCountries = selectedCountries.filter(c => c !== country);
      setActiveCountry(remainingCountries[0]);
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
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel
  };
};
