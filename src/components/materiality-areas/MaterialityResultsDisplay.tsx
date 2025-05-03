
import React from "react";
import { Card } from "@/components/ui/card";
import ImpactBarChart from "./ImpactBarChart";

// Define the MaterialityData interface since it's not exported from useMaterialityFilters
interface MaterialityData {
  category: string;
  sustainability_area: string;
  impact_level: string;
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

  if (!filteredData.length) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10">
          No data available for {selectedCountry} in {selectedCategory}
        </div>
      </Card>
    );
  }

  // Process data for charts
  const chartData = filteredData.map((item) => ({
    name: item.impact_level,
    value: item.percentage * 100, // Convert to percentage
    category: item.sustainability_area,
  }));

  // Get unique categories
  const categories = Array.from(new Set(chartData.map((item) => item.category)));

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <ImpactBarChart
              data={chartData}
              title={`Impact Levels by Sustainability Area in ${selectedCountry}`}
              categories={categories}
              chartType="bar"
            />
          </div>

          <div className="lg:w-1/2">
            <ImpactBarChart
              data={chartData}
              title={`Sustainability Areas by Impact Level in ${selectedCountry}`}
              categories={categories}
              chartType="stacked"
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-[#34502b] mb-2">Analysis</h3>
          <p className="text-gray-600">
            This chart shows the consumer engagement with various sustainability
            areas in {selectedCountry}. The levels of engagement range from
            basic awareness to willingness to pay for sustainable products.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MaterialityResultsDisplay;
