
import React from 'react';
import { Card } from '@/components/ui/card';
import VHOAreaBarChart from './VHOAreaBarChart';
import { VHOData } from '@/hooks/useVHOData';

interface MaterialityResultsDisplayProps {
  isLoading: boolean;
  error: Error | null;
  selectedCountry: string;
  selectedCategory: string;
  filteredData: VHOData[];
}

const MaterialityResultsDisplay: React.FC<MaterialityResultsDisplayProps> = ({
  isLoading,
  error,
  selectedCountry,
  selectedCategory,
  filteredData
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#34502b] mx-auto"></div>
          <p className="mt-4 text-[#34502b]">Loading materiality areas...</p>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 bg-white border-2 border-red-200 rounded-xl shadow-md">
        <div className="text-center py-10 text-red-500">
          Error loading data. Please try again later.
        </div>
      </Card>
    );
  }
  
  if (!selectedCountry) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select a country to view materiality areas.
        </div>
      </Card>
    );
  }
  
  if (filteredData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No materiality areas data available for the selected criteria.
        </div>
      </Card>
    );
  }
  
  return <VHOAreaBarChart data={filteredData} />;
};

export default MaterialityResultsDisplay;
