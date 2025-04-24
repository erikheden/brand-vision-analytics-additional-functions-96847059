
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import ImpactBarChart from "../ImpactBarChart";
import { getFullCountryName } from "@/components/CountrySelect";
import { BarChart, LineChart } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  data?: any[];
  processedData?: Record<string, Record<string, Record<string, number>>>;
  selectedLevels?: string[];
  country?: string;
}

type ChartDisplayMode = 'bar' | 'stacked';

const ImpactResultsDisplay: React.FC<ImpactResultsDisplayProps> = ({
  isLoading,
  error,
  selectedCountry,
  selectedCategories,
  selectedYear,
  chartData,
  country = ""
}) => {
  const [chartMode, setChartMode] = useState<ChartDisplayMode>('bar');
  
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

  const handleChartModeChange = (value: string) => {
    if (value) {
      setChartMode(value as ChartDisplayMode);
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-[#34502b]">
            Impact by Level in {countryName} {selectedYear ? `(${selectedYear})` : ''}
          </h2>
          <ToggleGroup 
            type="single" 
            value={chartMode} 
            onValueChange={handleChartModeChange} 
            className="bg-gray-100 rounded-md p-1"
          >
            <ToggleGroupItem 
              value="bar" 
              className="data-[state=on]:bg-white data-[state=on]:text-[#34502b] data-[state=on]:shadow-sm rounded-sm p-2"
              title="Bar Chart"
            >
              <BarChart className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="stacked" 
              className="data-[state=on]:bg-white data-[state=on]:text-[#34502b] data-[state=on]:shadow-sm rounded-sm p-2"
              title="Stacked Bar Chart"
            >
              <LineChart className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <ImpactBarChart
          data={chartData.byLevel}
          title={`Sustainability Impact by Level in ${countryName} ${selectedYear ? `(${selectedYear})` : ''}`}
          categories={categories}
          chartType={chartMode}
        />
        
        {selectedCategories.length > 0 && (
          <div className="mt-4 p-3 bg-[#f1f0fb] rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Analysis:</strong> The data shows how different impact levels vary across 
              {selectedCategories.length > 1 
                ? ` the ${selectedCategories.length} selected categories` 
                : ` the ${selectedCategories[0]} category`}. 
              {chartData.byLevel.some(item => item.value > 50) 
                ? " There is a strong impact in some areas, indicating high consumer engagement."
                : " Impact levels are moderate, suggesting potential for growth in consumer engagement."}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImpactResultsDisplay;
