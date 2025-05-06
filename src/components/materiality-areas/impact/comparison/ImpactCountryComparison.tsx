
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useProcessedChartData } from '@/hooks/impact-comparison/useProcessedChartData';
import ComparisonChartControls from './ComparisonChartControls';
import ComparisonAnalysisPanel from './ComparisonAnalysisPanel';
import { createCategoryChartOptions } from '@/hooks/impact-comparison/chart-utils/categoryChartUtils';
import { createImpactLevelChartOptions } from '@/hooks/impact-comparison/chart-utils/impactLevelChartUtils';

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
  const [viewMode, setViewMode] = useState<'byCategory' | 'byImpactLevel'>('byCategory');
  
  // Set initial selected values when data is loaded
  useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedImpactLevel) {
      setSelectedImpactLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedImpactLevel]);
  
  // Get processed chart data from the hook
  const { seriesData, impactLevelData } = useProcessedChartData(
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
  const categoryChartOptions = React.useMemo(() => {
    return createCategoryChartOptions(
      selectedYear,
      selectedImpactLevel,
      selectedCategories,
      activeCountries,
      seriesData
    );
  }, [selectedYear, selectedImpactLevel, selectedCategories, activeCountries, seriesData]);
  
  const impactLevelChartOptions = React.useMemo(() => {
    return createImpactLevelChartOptions(
      selectedYear,
      selectedCategory,
      impactLevels,
      activeCountries,
      impactLevelData
    );
  }, [selectedYear, selectedCategory, impactLevels, activeCountries, impactLevelData]);
  
  // Display appropriate message if requirements aren't met
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
  
  // Determine which chart options to use based on view mode
  const chartOptions = viewMode === 'byCategory' ? categoryChartOptions : impactLevelChartOptions;
  
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
        
        <div className="h-[500px]">
          <HighchartsReact 
            highcharts={Highcharts} 
            options={chartOptions}
            immutable={true}
            updateArgs={[true, true, true]}
          />
        </div>
        
        <ComparisonAnalysisPanel viewMode={viewMode} />
      </div>
    </Card>
  );
};

export default ImpactCountryComparison;
