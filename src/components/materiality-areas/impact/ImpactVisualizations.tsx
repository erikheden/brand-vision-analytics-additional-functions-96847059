
import React from 'react';
import { Card } from '@/components/ui/card';
import { useImpactVisualization } from '@/hooks/impact-visualization/useImpactVisualization';
import ImpactCategoryChart from './charts/ImpactCategoryChart';
import ImpactLevelChart from './charts/ImpactLevelChart';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';

interface ImpactVisualizationsProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  selectedLevels: string[];
  isLoading: boolean;
  error: Error | null;
}

const ImpactVisualizations: React.FC<ImpactVisualizationsProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  selectedLevels,
  isLoading,
  error
}) => {
  const { byLevel, byCategory, hasData } = useImpactVisualization(
    processedData,
    selectedCategories,
    selectedYear,
    selectedLevels
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!hasData || !selectedYear) {
    return (
      <EmptyState message="No data available for the selected filters." />
    );
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <ImpactCategoryChart 
          data={byCategory}
          selectedYear={selectedYear}
          selectedLevels={selectedLevels}
        />
      </Card>

      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <ImpactLevelChart 
          data={byLevel}
          selectedYear={selectedYear}
        />
      </Card>

      <Card className="p-4 bg-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-[#34502b] mb-2">Analysis Summary</h3>
        <p className="text-gray-600">
          This visualization shows the distribution of impact levels across selected categories for the year {selectedYear}.
          {selectedCategories.length > 1 ? 
            ` Multiple categories are displayed to allow for comparison.` :
            ` The selected category is displayed in detail.`
          }
        </p>
      </Card>
    </div>
  );
};

export default React.memo(ImpactVisualizations);
