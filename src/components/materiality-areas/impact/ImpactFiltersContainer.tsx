
import React from "react";
import ImpactFilters from "./ImpactFilters";

interface ImpactFiltersContainerProps {
  activeCountry: string;
  activeCountries: string[];
  selectedCountries: string[];
  handleCountryChange: (country: string) => void;
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  years: number[];
  selectedYear: number | null;
  setSelectedYear: (year: number) => void;
  impactLevels: string[];
  selectedLevels: string[];
  toggleImpactLevel: (level: string) => void;
  isLoading: boolean;
  comparisonMode: boolean;
  toggleComparisonMode: (enabled: boolean) => void;
  setActiveCountries: (countries: string[]) => void;
}

const ImpactFiltersContainer: React.FC<ImpactFiltersContainerProps> = ({
  activeCountry,
  activeCountries,
  selectedCountries,
  handleCountryChange,
  categories,
  selectedCategories,
  toggleCategory,
  years,
  selectedYear,
  setSelectedYear,
  impactLevels,
  selectedLevels,
  toggleImpactLevel,
  isLoading,
  comparisonMode,
  toggleComparisonMode,
  setActiveCountries
}) => {
  return (
    <div className="space-y-6">
      <ImpactFilters
        selectedCountry={activeCountry}
        selectedCountries={activeCountries}
        availableCountries={selectedCountries}
        handleCountryChange={handleCountryChange}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        sortedImpactLevels={impactLevels}
        selectedLevels={selectedLevels}
        toggleImpactLevel={toggleImpactLevel}
        isLoading={isLoading}
        comparisonMode={comparisonMode}
        toggleComparisonMode={toggleComparisonMode}
        setSelectedCountries={setActiveCountries}
      />
    </div>
  );
};

export default ImpactFiltersContainer;
