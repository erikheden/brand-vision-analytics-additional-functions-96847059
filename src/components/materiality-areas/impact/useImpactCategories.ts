
import { useState, useMemo } from "react";
import { useSustainabilityImpactData } from "@/hooks/useSustainabilityImpactData";

export const useImpactCategories = () => {
  // State for selected filters
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([
    "Aware", "Concerned", "Acting", "Willing to pay"
  ]);
  
  // Get impact data for the selected country
  const { 
    categories,
    years,
    impactLevels,
    isLoading,
    error,
    processedData
  } = useSustainabilityImpactData(selectedCountry);
  
  // Countries available
  const countries = ["NO", "SE", "DK", "FI", "NL"];
  
  // Define the correct sorting order for impact levels
  const sortedImpactLevels = ["Aware", "Concerned", "Acting", "Willing to pay"];
  
  // Handle country selection
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCategories([]);
    setSelectedYear(null);
  };
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Handle impact level toggle
  const toggleImpactLevel = (level: string) => {
    setSelectedLevels(prev => {
      // Don't allow deselecting all levels
      if (prev.includes(level) && prev.length === 1) {
        return prev;
      }
      
      return prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level];
    });
  };
  
  // Prepare data for the selected categories, year, and impact levels
  const chartData = useMemo(() => {
    if (selectedCategories.length === 0 || !selectedYear || selectedLevels.length === 0) {
      return [];
    }
    
    let allData: Array<{name: string; value: number; category: string}> = [];
    
    selectedCategories.forEach(category => {
      if (processedData[category] && processedData[category][selectedYear]) {
        const impactLevels = processedData[category][selectedYear];
        
        Object.entries(impactLevels).forEach(([level, percentage]) => {
          // Only include selected impact levels
          if (selectedLevels.includes(level)) {
            allData.push({
              name: level,
              value: percentage * 100, // Convert to percentage
              category: category
            });
          }
        });
      }
    });
    
    return allData;
  }, [selectedCategories, selectedYear, processedData, selectedLevels]);

  return {
    // Data
    selectedCountry,
    countries,
    categories,
    selectedCategories,
    years,
    selectedYear,
    sortedImpactLevels,
    selectedLevels,
    isLoading,
    error,
    chartData,
    
    // Actions
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel
  };
};
