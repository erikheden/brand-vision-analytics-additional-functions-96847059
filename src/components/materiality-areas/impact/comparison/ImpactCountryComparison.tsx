
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ComparisonChartControls from './ComparisonChartControls';
import ComparisonAnalysisPanel from './ComparisonAnalysisPanel';
import { useComparisonChartData } from '@/hooks/impact-comparison/useComparisonChartData';

interface ImpactCountryComparisonProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  years: number[];
  impactLevels: string[];
  activeCountries: string[];
  countryDataMap?: Record<string, any>;  // Added country data map
}

const ImpactCountryComparison: React.FC<ImpactCountryComparisonProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  years,
  impactLevels,
  activeCountries,
  countryDataMap  // Get the country-specific data
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<string>('');
  const [viewMode, setViewMode] = useState<'byCategory' | 'byImpactLevel'>('byCategory');
  
  // Set defaults when component loads or dependencies change
  useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedImpactLevel) {
      setSelectedImpactLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedImpactLevel]);
  
  // Log to check what data we're receiving
  useEffect(() => {
    console.log("ImpactCountryComparison - Active Countries:", activeCountries);
    console.log("ImpactCountryComparison - Country Data Map available:", !!countryDataMap);
    if (countryDataMap) {
      console.log("ImpactCountryComparison - Country Data Map keys:", Object.keys(countryDataMap));
    }
  }, [activeCountries, countryDataMap]);
  
  const { createCategoryChart, createImpactLevelChart } = useComparisonChartData(
    processedData,
    selectedCategory,
    selectedImpactLevel,
    selectedYear,
    selectedCategories,
    impactLevels,
    activeCountries,
    countryDataMap  // Pass the country-specific data
  );

  if (activeCountries.length <= 1) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least two countries to compare impact data.
        </div>
      </Card>
    );
  }
  
  if (selectedCategories.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one category to view comparison data.
        </div>
      </Card>
    );
  }
  
  if (!selectedYear) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select a year to view comparison data.
        </div>
      </Card>
    );
  }
  
  const chartOptions = viewMode === 'byCategory' ? createCategoryChart : createImpactLevelChart;
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <ComparisonChartControls 
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedImpactLevel={selectedImpactLevel}
          setSelectedImpactLevel={setSelectedImpactLevel}
          impactLevels={impactLevels}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCategories={selectedCategories}
        />
        
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        
        <ComparisonAnalysisPanel viewMode={viewMode} />
      </div>
    </Card>
  );
};

export default ImpactCountryComparison;
