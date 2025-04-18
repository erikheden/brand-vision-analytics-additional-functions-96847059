
import React, { useState, useEffect, useMemo } from "react";
import ImpactFilters from "./impact/ImpactFilters";
import ImpactResultsDisplay from "./impact/ImpactResultsDisplay";
import { useSustainabilityImpactData } from "@/hooks/useSustainabilityImpactData";
import { useSelectionData } from "@/hooks/useSelectionData";

interface ImpactCategoriesContentProps {
  selectedCountries: string[];
}

const ImpactCategoriesContent: React.FC<ImpactCategoriesContentProps> = ({ 
  selectedCountries = [] 
}) => {
  const [activeCountry, setActiveCountry] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  
  const { countries } = useSelectionData("", []);
  
  // Set active country when selectedCountries changes
  useEffect(() => {
    if (selectedCountries.length > 0 && (!activeCountry || !selectedCountries.includes(activeCountry))) {
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
  
  // When years data changes, select the most recent year by default
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[years.length - 1]);
    }
  }, [years, selectedYear]);
  
  // Sort impact levels in a meaningful order (if needed)
  const sortedImpactLevels = impactLevels.sort((a, b) => {
    const order = { "high": 0, "medium": 1, "low": 2 };
    return (order[a.toLowerCase()] || 99) - (order[b.toLowerCase()] || 99);
  });
  
  // Toggle a category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Toggle an impact level selection
  const toggleImpactLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  // When switching between countries, reset selections if necessary
  useEffect(() => {
    // Reset selected categories if none match the new country's available categories
    if (categories.length > 0 && selectedCategories.length > 0) {
      const validCategories = selectedCategories.filter(cat => categories.includes(cat));
      if (validCategories.length === 0) {
        setSelectedCategories([categories[0]]);
      } else if (validCategories.length !== selectedCategories.length) {
        setSelectedCategories(validCategories);
      }
    }
    
    // Reset selected levels if none match the new country's available levels
    if (impactLevels.length > 0 && selectedLevels.length > 0) {
      const validLevels = selectedLevels.filter(lvl => impactLevels.includes(lvl));
      if (validLevels.length === 0) {
        setSelectedLevels([impactLevels[0]]);
      } else if (validLevels.length !== selectedLevels.length) {
        setSelectedLevels(validLevels);
      }
    }
  }, [activeCountry, categories, impactLevels]);
  
  const handleCountryChange = (country: string) => {
    if (selectedCountries.includes(country)) {
      // Don't allow deselecting the active country if it's the only one selected
      if (country === activeCountry && selectedCountries.length === 1) {
        return;
      }
      
      // If the active country is deselected, switch to another country
      if (country === activeCountry) {
        const remainingCountries = selectedCountries.filter(c => c !== country);
        setActiveCountry(remainingCountries[0]);
      }
    } else if (!activeCountry) {
      setActiveCountry(country);
    }
  };
  
  // Prepare chart data from the processed data
  const chartData = useMemo(() => {
    if (!processedData || !selectedYear) {
      return { byLevel: [], byCategory: [] };
    }
    
    const byLevel: Array<{ name: string, value: number, category: string }> = [];
    const byCategory: Array<{ name: string, value: number, category: string }> = [];
    
    const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : categories;
    const levelsToUse = selectedLevels.length > 0 ? selectedLevels : sortedImpactLevels;
    
    categoriesToUse.forEach(category => {
      if (processedData[category] && processedData[category][selectedYear]) {
        levelsToUse.forEach(level => {
          if (processedData[category][selectedYear][level] !== undefined) {
            byLevel.push({
              name: level,
              value: processedData[category][selectedYear][level] * 100, // Convert to percentage
              category: category
            });
            
            byCategory.push({
              name: category,
              value: processedData[category][selectedYear][level] * 100,
              category: level
            });
          }
        });
      }
    });
    
    return { byLevel, byCategory };
  }, [processedData, selectedYear, selectedCategories, selectedLevels, categories, sortedImpactLevels]);
  
  return (
    <div className="space-y-6">
      <ImpactFilters
        selectedCountry={activeCountry}
        countries={selectedCountries}
        handleCountryChange={handleCountryChange}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        sortedImpactLevels={sortedImpactLevels}
        selectedLevels={selectedLevels}
        toggleImpactLevel={toggleImpactLevel}
        isLoading={isLoading}
      />
      
      {activeCountry && (
        <ImpactResultsDisplay
          selectedCountry={activeCountry}
          selectedCategories={selectedCategories.length > 0 ? selectedCategories : categories}
          selectedYear={selectedYear}
          chartData={chartData}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default ImpactCategoriesContent;
