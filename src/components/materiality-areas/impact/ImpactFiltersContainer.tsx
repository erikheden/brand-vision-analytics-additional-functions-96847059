
import React from "react";
import ImpactFilters from "./ImpactFilters";

interface ImpactFiltersContainerProps {
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
  setActiveCountries: (countries: string[]) => void;
}

const ImpactFiltersContainer: React.FC<ImpactFiltersContainerProps> = ({
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
  setActiveCountries
}) => {
  return (
    <div className="space-y-6">
      <ImpactFilters
        selectedCountries={activeCountries}
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
      />
    </div>
  );
};

export default ImpactFiltersContainer;
