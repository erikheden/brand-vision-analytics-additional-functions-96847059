
import React from "react";
import ImpactFilters from "./ImpactFilters";
import ImpactResultsDisplay from "./ImpactResultsDisplay";
import { useImpactCategories } from "@/hooks/useImpactCategories";

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

  // Prepare chart data from the processed data
  const chartData = React.useMemo(() => {
    if (!processedData || !selectedYear) {
      return { byLevel: [], byCategory: [] };
    }

    const byLevel: Array<{ name: string, value: number, category: string }> = [];
    const byCategory: Array<{ name: string, value: number, category: string }> = [];

    const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : categories;
    const levelsToUse = selectedLevels.length > 0 ? selectedLevels : impactLevels;

    categoriesToUse.forEach(category => {
      if (processedData[category] && processedData[category][selectedYear]) {
        levelsToUse.forEach(level => {
          if (processedData[category][selectedYear][level] !== undefined) {
            byLevel.push({
              name: level,
              value: processedData[category][selectedYear][level] * 100,
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
  }, [processedData, selectedYear, selectedCategories, selectedLevels, categories, impactLevels]);

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
        sortedImpactLevels={impactLevels}
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
