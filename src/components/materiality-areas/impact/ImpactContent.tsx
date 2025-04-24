
import React from "react";
import { useImpactCategories } from "@/hooks/useImpactCategories";
import { useImpactChartData } from "@/hooks/useImpactChartData";
import ImpactFiltersContainer from "./ImpactFiltersContainer";
import ImpactResultsDisplay from "./ImpactResultsDisplay";

interface ImpactContentProps {
  selectedCountries: string[];
}

const ImpactContent: React.FC<ImpactContentProps> = ({ selectedCountries }) => {
  const {
    activeCountry,
    selectedCategories,
    selectedYear,
    selectedLevels,
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel
  } = useImpactCategories(selectedCountries);

  const chartData = useImpactChartData(
    processedData,
    selectedYear,
    selectedCategories,
    selectedLevels,
    categories,
    impactLevels
  );

  return (
    <div className="space-y-6">
      <ImpactFiltersContainer
        activeCountry={activeCountry}
        selectedCountries={selectedCountries}
        handleCountryChange={handleCountryChange}
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
      />

      {activeCountry && (
        <ImpactResultsDisplay
          isLoading={isLoading}
          error={error}
          selectedCountry={activeCountry}
          selectedCategories={selectedCategories}
          selectedYear={selectedYear}
          chartData={chartData}
          data={data}
          processedData={processedData}
          selectedLevels={selectedLevels}
          country={activeCountry}
        />
      )}
    </div>
  );
};

export default ImpactContent;
