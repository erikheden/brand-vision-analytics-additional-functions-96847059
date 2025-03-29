
import React from "react";
import { Card } from "@/components/ui/card";
import ImpactBarChart from "../ImpactBarChart";

interface ImpactResultsDisplayProps {
  isLoading: boolean;
  error: any;
  selectedCountry: string;
  selectedCategories: string[];
  selectedYear: number | null;
  chartData: Array<{name: string; value: number; category: string}>;
}

const ImpactResultsDisplay: React.FC<ImpactResultsDisplayProps> = ({
  isLoading,
  error,
  selectedCountry,
  selectedCategories,
  selectedYear,
  chartData
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <div className="flex justify-center items-center h-80">
          <p className="text-red-500">Error loading data. Please try again.</p>
        </div>
      </Card>
    );
  }
  
  if (!selectedCountry) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">Please select a country to view the data.</p>
        </div>
      </Card>
    );
  }
  
  if (selectedCategories.length === 0 || !selectedYear) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">Please select categories and a year to view the data.</p>
        </div>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">No data available for the selected categories, year, or impact levels.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
      <div className="h-[500px]">
        <ImpactBarChart 
          data={chartData} 
          title={`Impact Levels (${selectedYear})`} 
          categories={selectedCategories}
        />
      </div>
    </Card>
  );
};

export default ImpactResultsDisplay;
