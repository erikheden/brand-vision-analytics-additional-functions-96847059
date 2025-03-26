
import React from 'react';
import { Card } from '@/components/ui/card';

interface ComparisonEmptyStateProps {
  selectedAreas: string[];
}

const ComparisonEmptyState: React.FC<ComparisonEmptyStateProps> = ({ selectedAreas }) => {
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="text-center py-10 text-gray-500">
        {selectedAreas.length === 0 ? 
          "Please select at least one sustainability area to compare." : 
          "No data available for the selected countries and year. Please try different selections."}
      </div>
    </Card>
  );
};

export default ComparisonEmptyState;
