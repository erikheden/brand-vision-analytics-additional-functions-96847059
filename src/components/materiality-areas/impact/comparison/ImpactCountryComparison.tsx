
import React, { useState, useEffect, useMemo } from 'react';
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
  
  // Set defaults when component loads or dependencies change
  useEffect(() => {
    if (selectedCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(selectedCategories[0]);
    }
    
    if (impactLevels.length > 0 && !selectedImpactLevel) {
      setSelectedImpactLevel(impactLevels[0]);
    }
  }, [selectedCategories, impactLevels, selectedCategory, selectedImpactLevel]);
  
  // Only log when values actually change
  useEffect(() => {
    console.log('ImpactCountryComparison - activeCountries:', activeCountries);
    console.log('ImpactCountryComparison - selectedCategories:', selectedCategories);
    console.log('ImpactCountryComparison - selectedYear:', selectedYear);
    console.log('ImpactCountryComparison - countryDataMap keys:', countryDataMap ? Object.keys(countryDataMap) : 'undefined');
  }, [
    activeCountries.length, 
    selectedCategories.length, 
    selectedYear, 
    countryDataMap ? Object.keys(countryDataMap).join() : 'undefined'
  ]);

  // Extract country-specific data
  const countrySpecificData = useMemo(() => {
    if (!countryDataMap || Object.keys(countryDataMap).length === 0) {
      return {};
    }

    const result: Record<string, Record<string, Record<string, Record<string, number>>>> = {};
    
    activeCountries.forEach(country => {
      if (countryDataMap[country]?.processedData) {
        result[country] = countryDataMap[country].processedData;
      }
    });
    
    return result;
  }, [countryDataMap, activeCountries]);
  
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

  // Memoized messaging component
  const EmptyStateMessage = useMemo(() => {
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
    
    return null;
  }, [activeCountries.length, selectedCategories.length, selectedYear]);
  
  // Early return for empty states
  if (EmptyStateMessage) {
    return EmptyStateMessage;
  }
  
  // Use the appropriate chart options based on view mode
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
        
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
          immutable={true}
        />
        
        <ComparisonAnalysisPanel viewMode={viewMode} />
      </div>
    </Card>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ImpactCountryComparison);
