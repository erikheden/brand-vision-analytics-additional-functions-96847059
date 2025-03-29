
import React from "react";
import ImpactFilters from "./impact/ImpactFilters";
import ImpactResultsDisplay from "./impact/ImpactResultsDisplay";
import { useImpactCategories } from "./impact/useImpactCategories";

const ImpactCategoriesContent = () => {
  const {
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
    
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel
  } = useImpactCategories();

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <ImpactFilters 
        selectedCountry={selectedCountry}
        countries={countries}
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
      
      {/* Results Display */}
      <ImpactResultsDisplay 
        isLoading={isLoading}
        error={error}
        selectedCountry={selectedCountry}
        selectedCategories={selectedCategories}
        selectedYear={selectedYear}
        chartData={chartData}
      />
    </div>
  );
};

export default ImpactCategoriesContent;
