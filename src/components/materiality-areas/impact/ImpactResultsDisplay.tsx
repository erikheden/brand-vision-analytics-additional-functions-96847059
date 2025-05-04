
import React from 'react';
import ImpactVisualizations from './ImpactVisualizations';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';

interface ImpactResultsDisplayProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  selectedLevels: string[];
  isLoading: boolean;
  error: Error | null;
  selectedCountry: string;
}

const ImpactResultsDisplay: React.FC<ImpactResultsDisplayProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  selectedLevels,
  isLoading,
  error,
  selectedCountry
}) => {
  // Add debug logging
  React.useEffect(() => {
    console.log('ImpactResultsDisplay rendering with:', {
      hasProcessedData: !!processedData && Object.keys(processedData).length > 0,
      selectedCategoriesCount: selectedCategories.length,
      selectedYear,
      selectedLevelsCount: selectedLevels.length,
      isLoading,
      hasError: !!error,
      selectedCountry
    });
  }, [processedData, selectedCategories, selectedYear, selectedLevels, isLoading, error, selectedCountry]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!selectedYear || !selectedCountry || selectedCategories.length === 0) {
    const message = !selectedCountry
      ? "Please select a country to view data."
      : !selectedCategories.length
        ? "Please select at least one category."
        : "Please select a year to view data.";
    return <EmptyState message={message} />;
  }

  return (
    <ImpactVisualizations 
      processedData={processedData}
      selectedCategories={selectedCategories}
      selectedYear={selectedYear}
      selectedLevels={selectedLevels}
      isLoading={isLoading}
      error={error}
      activeCountries={[selectedCountry]} // Single country mode
      countryDataMap={{}} // Empty countryDataMap as a fallback
    />
  );
};

export default ImpactResultsDisplay;
