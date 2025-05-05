
import React from 'react';
import { Card } from '@/components/ui/card';
import useInsightsGenerator from './hooks/useInsightsGenerator';
import InsightsCard from './components/InsightsCard';
import RecommendationsCard from './components/RecommendationsCard';
import ImpactInfoAlert from './components/ImpactInfoAlert';
import ImpactVisualizationTabs from './components/ImpactVisualizationTabs';

interface ImpactVisualizationsProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  selectedLevels: string[];
  isLoading: boolean;
  error: Error | null;
  activeCountries: string[];
  countryDataMap?: Record<string, any>;
}

const ImpactVisualizations: React.FC<ImpactVisualizationsProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  selectedLevels,
  isLoading,
  error,
  activeCountries,
  countryDataMap
}) => {
  // Filter processedData to only include selected categories
  const filteredData = React.useMemo(() => {
    if (!selectedCategories.length || !processedData) return processedData;
    
    return Object.entries(processedData)
      .filter(([category]) => selectedCategories.includes(category))
      .reduce((acc, [category, data]) => {
        acc[category] = data;
        return acc;
      }, {} as Record<string, Record<string, Record<string, number>>>);
  }, [processedData, selectedCategories]);

  // Extract years from the data
  const years = React.useMemo(() => {
    if (!processedData || Object.keys(processedData).length === 0) return [];
    
    const yearsSet = new Set<number>();
    
    Object.values(processedData).forEach(categoryData => {
      Object.keys(categoryData).forEach(year => {
        yearsSet.add(Number(year));
      });
    });
    
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [processedData]);

  // Extract impact levels from the data
  const impactLevels = React.useMemo(() => {
    if (!processedData || Object.keys(processedData).length === 0) return [];
    
    const levelsSet = new Set<string>();
    
    Object.values(processedData).forEach(categoryData => {
      Object.values(categoryData).forEach(yearData => {
        Object.keys(yearData).forEach(level => {
          levelsSet.add(level);
        });
      });
    });
    
    return Array.from(levelsSet);
  }, [processedData]);

  // Generate insights and recommendations
  const { insightText, recommendations } = useInsightsGenerator(
    processedData, 
    selectedCategories, 
    selectedYear, 
    selectedLevels
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#34502b] mb-2">Sustainability Impact Analysis</h3>
          <p className="text-gray-600 text-sm">
            Explore impact data by category or compare across countries.
          </p>
        </div>
        
        <ImpactVisualizationTabs 
          filteredData={filteredData}
          processedData={processedData}
          selectedCategories={selectedCategories}
          selectedYear={selectedYear}
          selectedLevels={selectedLevels}
          years={years}
          impactLevels={impactLevels}
          activeCountries={activeCountries}
          countryDataMap={countryDataMap}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightsCard insightText={insightText} />
        <RecommendationsCard recommendations={recommendations} />
      </div>
      
      <ImpactInfoAlert />
    </div>
  );
};

export default React.memo(ImpactVisualizations);
