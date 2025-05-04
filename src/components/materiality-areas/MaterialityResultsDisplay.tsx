
import React from "react";
import { Card } from "@/components/ui/card";
import ImpactBarChart from "./ImpactBarChart";

// Define the MaterialityData interface since it's not exported from useMaterialityFilters
interface MaterialityData {
  category: string;
  sustainability_area: string;
  vho_type: string;
  percentage: number;
  type_of_factor: string;
}

interface MaterialityResultsDisplayProps {
  isLoading: boolean;
  error: any;
  selectedCountry: string;
  selectedCategory: string;
  filteredData: MaterialityData[];
}

const MaterialityResultsDisplay = ({
  isLoading,
  error,
  selectedCountry,
  selectedCategory,
  filteredData,
}: MaterialityResultsDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10">Loading data...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-red-500">
          Error loading data: {error.message}
        </div>
      </Card>
    );
  }

  // Show a prompt to select a category if none is selected
  if (!selectedCategory) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10">
          Please select a category to view sustainability area data
        </div>
      </Card>
    );
  }

  if (!filteredData.length) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10">
          No data available for {selectedCountry} in {selectedCategory || "any category"}
        </div>
      </Card>
    );
  }

  // Process data for charts
  const chartData = filteredData.map((item) => ({
    name: item.vho_type,
    value: item.percentage * 100, // Convert to percentage
    category: item.sustainability_area,
  }));

  // Get unique categories
  const categories = Array.from(new Set(chartData.map((item) => item.category)));

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <div className="mb-4">
          <ImpactBarChart
            data={chartData}
            title={`Sustainability Areas in ${selectedCategory} - ${selectedCountry}`}
            categories={categories}
          />
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-[#34502b] mb-2">Analysis</h3>
          <p className="text-gray-600">
            This chart shows the priority levels of various sustainability areas 
            in the {selectedCategory} industry for {selectedCountry}. The data represents 
            how different sustainability factors are prioritized by consumers.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MaterialityResultsDisplay;
