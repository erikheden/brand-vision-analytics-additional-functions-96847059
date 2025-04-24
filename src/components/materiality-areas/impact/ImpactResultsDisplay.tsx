
import React from "react";
import { Card } from "@/components/ui/card";
import ImpactBarChart from "../ImpactBarChart";
import { getFullCountryName } from "@/components/CountrySelect";

interface ImpactResultsDisplayProps {
  isLoading: boolean;
  error: any;
  selectedCountry: string;
  selectedCategories: string[];
  selectedYear: number | null;
  chartData?: {
    byLevel: Array<{ name: string, value: number, category: string }>;
    byCategory: Array<{ name: string, value: number, category: string }>;
  };
  // Add the missing props that are being passed
  data?: any[];
  processedData?: Record<string, Record<string, Record<string, number>>>;
  selectedLevels?: string[];
  country?: string;
}

const ImpactResultsDisplay: React.FC<ImpactResultsDisplayProps> = ({
  isLoading,
  error,
  selectedCountry,
  selectedCategories,
  selectedYear,
  chartData,
  // We can ignore the extra props since we don't use them directly
  country = ""
}) => {
  // Use either explicitly passed country or the selectedCountry prop
  const countryToUse = country || selectedCountry;
  const countryName = getFullCountryName(countryToUse) || countryToUse;
  
  // Consider categories from the chart data if available
  const categories = chartData?.byLevel ? [...new Set(chartData.byLevel.map(item => item.category))] : [];
  
  console.log("ImpactResultsDisplay rendering", { 
    isLoading, 
    hasError: !!error, 
    selectedCountry, 
    selectedCategoriesCount: selectedCategories.length, 
    selectedYear,
    hasChartData: chartData && chartData.byLevel && chartData.byLevel.length > 0,
    categories
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12">
          <div className="animate-pulse text-[#34502b]">Loading impact data...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-red-500">
          Error loading data: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </Card>
    );
  }

  if (!countryToUse) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-[#34502b]/70">
          Please select a country to view sustainability impact data
        </div>
      </Card>
    );
  }

  // Changed condition to check chart data directly rather than selected categories
  if (!chartData || !chartData.byLevel || chartData.byLevel.length === 0) {
    if (isLoading) {
      return (
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="text-center py-12">
            <div className="animate-pulse text-[#34502b]">Loading impact data...</div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-gray-500">
          {selectedCategories.length === 0 
            ? "Please select at least one category to view impact data" 
            : `No impact data available for the selected criteria in ${countryName} ${selectedYear ? `for ${selectedYear}` : ''}`}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-8">
        <ImpactBarChart
          data={chartData.byLevel}
          title={`Sustainability Impact by Level in ${countryName} ${selectedYear ? `(${selectedYear})` : ''}`}
          categories={categories}
        />
      </div>
    </Card>
  );
};

export default ImpactResultsDisplay;
