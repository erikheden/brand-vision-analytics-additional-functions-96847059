
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useProcessedChartData } from '@/hooks/impact-comparison/useProcessedChartData';
import { useComparisonChartData } from '@/hooks/impact-comparison/useComparisonChartData';

interface ImpactCountryComparisonProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  years: number[];
  impactLevels: string[];
  activeCountries: string[];
  countryDataMap?: Record<string, any>;
}

const ImpactCountryComparison: React.FC<ImpactCountryComparisonProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  years,
  impactLevels,
  activeCountries,
  countryDataMap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<string>('');
  
  // Set initial selected values when data is loaded
  useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedImpactLevel) {
      setSelectedImpactLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedImpactLevel]);
  
  // Process chart data
  const { createCategoryChart, createImpactLevelChart } = useComparisonChartData(
    processedData,
    selectedCategory,
    selectedImpactLevel,
    selectedYear,
    selectedCategories,
    impactLevels,
    activeCountries,
    countryDataMap
  );
  
  // Create chart options
  const categoryChartOptions = React.useMemo(
    () => createCategoryChart,
    [createCategoryChart]
  );
  
  const impactLevelChartOptions = React.useMemo(
    () => createImpactLevelChart,
    [createImpactLevelChart]
  );
  
  // Display empty state if no data is available
  if (activeCountries.length < 2) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least two countries to compare impact data.
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Category and Impact Level selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {selectedCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impact Level</label>
          <select
            value={selectedImpactLevel}
            onChange={(e) => setSelectedImpactLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {impactLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Charts */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-[#34502b] mb-4">Category Comparison</h3>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={categoryChartOptions} />
        </div>
      </Card>
      
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-[#34502b] mb-4">Impact Level Comparison</h3>
        <div className="h-[400px]">
          <HighchartsReact highcharts={Highcharts} options={impactLevelChartOptions} />
        </div>
      </Card>
    </div>
  );
};

export default ImpactCountryComparison;
