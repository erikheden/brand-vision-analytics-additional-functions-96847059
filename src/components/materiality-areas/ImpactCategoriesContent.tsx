
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import ImpactContent from "./impact/ImpactContent";
import { useImpactCategories } from "@/hooks/useImpactCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImpactCategoriesContentProps {
  selectedCountries: string[];
}

const ImpactCategoriesContent: React.FC<ImpactCategoriesContentProps> = ({ 
  selectedCountries 
}) => {
  const {
    isLoading,
    error
  } = useImpactCategories(selectedCountries);

  return (
    <div className="space-y-6">
      {selectedCountries.length === 0 ? (
        <EmptyState />
      ) : isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <div className="space-y-6">
          <Alert className="bg-[#f1f0fb] border-[#34502b]/20">
            <AlertCircle className="h-5 w-5 text-[#34502b]" />
            <AlertTitle className="text-[#34502b]">How to use this analysis</AlertTitle>
            <AlertDescription className="text-gray-600">
              Select categories, impact levels, and time periods below to analyze how sustainability influences 
              consumer decisions in your selected markets. Compare countries to identify regional differences.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border border-[#34502b]/20 rounded-lg">
              <div className="font-medium text-[#34502b] mb-1">Step 1</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Select Categories</h3>
              <p className="text-sm text-gray-600">
                Choose one or more sustainability categories to analyze consumer attitudes.
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border border-[#34502b]/20 rounded-lg">
              <div className="font-medium text-[#34502b] mb-1">Step 2</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Select Impact Level</h3>
              <p className="text-sm text-gray-600">
                Filter by impact level to see how deeply consumers engage with sustainability.
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border border-[#34502b]/20 rounded-lg">
              <div className="font-medium text-[#34502b] mb-1">Step 3</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Compare & Analyze</h3>
              <p className="text-sm text-gray-600">
                View trends over time or compare markets to identify opportunities.
              </p>
            </Card>
          </div>
          
          <ImpactContent selectedCountries={selectedCountries} />
        </div>
      )}
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
    <div className="text-center py-10">
      <h3 className="text-xl font-medium text-[#34502b] mb-2">Select a Country to Get Started</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Choose at least one country above to view sustainability impact data and insights.
      </p>
    </div>
  </Card>
);

// Loading state component
const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
);

// Error state component
const ErrorState = ({ error }: { error: Error }) => (
  <Card className="p-6 bg-white border-2 border-red-200 rounded-xl shadow-md">
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Data</h3>
      <p className="text-gray-600">{error.message}</p>
    </div>
  </Card>
);

export default ImpactCategoriesContent;
