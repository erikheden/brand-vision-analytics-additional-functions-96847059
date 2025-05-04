
import React, { useState, useEffect, useMemo } from 'react';
import ImpactFilters from './ImpactFilters';
import ImpactVisualizations from './ImpactVisualizations';
import { useImpactData } from '@/hooks/useImpactData';

interface ImpactContentProps {
  selectedCountries: string[];
}

const ImpactContent: React.FC<ImpactContentProps> = ({ selectedCountries }) => {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  
  // Get data from hook
  const { 
    processedData, 
    categories, 
    years, 
    impactLevels, 
    isLoading, 
    error,
    countryDataMap 
  } = useImpactData(selectedCountries);
  
  // Log debug info
  useEffect(() => {
    console.log("Selected Year:", selectedYear);
    
    // Check if country-specific data is available
    if (countryDataMap) {
      selectedCountries.forEach(country => {
        console.log(`Data for ${country}: ${countryDataMap[country] ? "ProcessedData exists" : "No data"}`);
      });
      
      console.log("ImpactContent - countryDataMap countries:", Object.keys(countryDataMap));
      
      // Log sample data structure for debugging
      const sampleCountry = Object.keys(countryDataMap)[0];
      if (sampleCountry) {
        const sampleCategories = countryDataMap[sampleCountry]?.processedData || {};
        console.log(`ImpactContent - ${sampleCountry} has ${Object.keys(sampleCategories).length} categories`);
        
        const firstCategory = Object.keys(sampleCategories)[0];
        if (firstCategory) {
          const yearKeys = Object.keys(sampleCategories[firstCategory]);
          console.log(`ImpactContent - ${sampleCountry}, ${firstCategory} has years:`, yearKeys);
        }
      }
    }
  }, [selectedYear, countryDataMap, selectedCountries]);
  
  // Set defaults when component loads or dependencies change
  useEffect(() => {
    // Set active countries to selected countries
    setActiveCountries(selectedCountries);
    
    // Set default category selection if available
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories([categories[0]]);
    }
    
    // Set default level selection if available
    if (impactLevels.length > 0 && selectedLevels.length === 0) {
      setSelectedLevels([impactLevels[0]]);
    }
    
    // Set default year if available (use the latest year)
    if (years.length > 0 && !selectedYear) {
      const latestYear = Math.max(...years);
      setSelectedYear(latestYear);
    }
  }, [categories, impactLevels, years, selectedCategories.length, selectedLevels.length, selectedYear, selectedCountries]);

  // Handle toggling a category
  const toggleCategory = (category: string) => {
    setSelectedCategories(current => 
      current.includes(category) 
        ? current.filter(c => c !== category) 
        : [...current, category]
    );
  };
  
  // Handle toggling an impact level
  const toggleImpactLevel = (level: string) => {
    setSelectedLevels(current => 
      current.includes(level) 
        ? current.filter(l => l !== level) 
        : [...current, level]
    );
  };
  
  // Handle country selection changes
  const handleCountryChange = (country: string) => {
    setActiveCountries(current => 
      current.includes(country) 
        ? current.filter(c => c !== country) 
        : [...current, country]
    );
  };
  
  return (
    <div className="space-y-6">
      <ImpactFilters 
        selectedCountries={selectedCountries}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        impactLevels={impactLevels}
        selectedLevels={selectedLevels}
        toggleImpactLevel={toggleImpactLevel}
        isLoading={isLoading}
        activeCountries={activeCountries}
        handleCountryChange={handleCountryChange}
      />
      
      <ImpactVisualizations 
        processedData={processedData}
        selectedCategories={selectedCategories}
        selectedYear={selectedYear}
        selectedLevels={selectedLevels}
        years={years}
        impactLevels={impactLevels}
        isLoading={isLoading}
        error={error}
        activeCountries={activeCountries}
        countryDataMap={countryDataMap}
      />
    </div>
  );
};

export default ImpactContent;
