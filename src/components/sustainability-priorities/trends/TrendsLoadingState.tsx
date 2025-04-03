
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface TrendsLoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  selectedCountries: string[];
  isPlaceholderData: boolean;
  allCountriesData: Record<string, any>;
}

const TrendsLoadingState: React.FC<TrendsLoadingStateProps> = ({
  isLoading,
  error,
  selectedCountries,
  isPlaceholderData,
  allCountriesData
}) => {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load sustainability trends data: {
            error instanceof Error 
              ? error.message 
              : 'Unknown error'
          }
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading data...</div>;
  }

  if (!selectedCountries.length) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Please select at least one country to view sustainability trends.</p>
      </div>
    );
  }

  if (selectedCountries.length > 0 && Object.keys(allCountriesData).length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">
          No sustainability trends data found for the selected countries.
        </p>
      </div>
    );
  }

  if (isPlaceholderData) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Using Sample Data</AlertTitle>
        <AlertDescription>
          No actual data was found for some countries. Sample data is being displayed for demonstration purposes.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default TrendsLoadingState;
