
import React from "react";
import { Card } from "@/components/ui/card";
import ImpactBarChart from "../ImpactBarChart";
import { getFullCountryName } from "@/components/CountrySelect";

interface ImpactResultsDisplayProps {
  isLoading: boolean;
  error: any;
  selectedCountry: string;
  selectedCategories: string[];
  selectedYear: number;
  chartData: {
    byLevel: Array<{ name: string, value: number, category: string }>;
    byCategory: Array<{ name: string, value: number, category: string }>;
  };
}

const ImpactResultsDisplay: React.FC<ImpactResultsDisplayProps> = ({
  isLoading,
  error,
  selectedCountry,
  selectedCategories,
  selectedYear,
  chartData,
}) => {
  const countryName = getFullCountryName(selectedCountry) || selectedCountry;
  const categories = [...new Set(chartData.byLevel.map(item => item.category))];

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

  if (!selectedCountry) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-[#34502b]/70">
          Please select a country to view sustainability impact data
        </div>
      </Card>
    );
  }

  if (selectedCategories.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-[#34502b]/70">
          Please select at least one category to view impact data
        </div>
      </Card>
    );
  }

  if (chartData.byLevel.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-gray-500">
          No impact data available for the selected criteria in {countryName} for {selectedYear}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-8">
        <ImpactBarChart
          data={chartData.byLevel}
          title={`Sustainability Impact by Level in ${countryName} (${selectedYear})`}
          categories={categories}
        />
      </div>
    </Card>
  );
};

export default ImpactResultsDisplay;
