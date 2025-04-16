
import React from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import KnowledgeTrendComparisonChart from '../KnowledgeTrendComparisonChart';
import TermsSelectionPanel from './TermsSelectionPanel';

interface TrendsViewProps {
  countriesData: Record<string, KnowledgeData[]>;
  selectedCountries: string[];
  selectedTerms: string[];
  allTerms: string[];
  onTermToggle: (term: string) => void;
}

const TrendsView: React.FC<TrendsViewProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms,
  allTerms,
  onTermToggle
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Knowledge Trends Comparison</h3>
      </div>
      
      {selectedTerms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Please select at least one term to view trends
        </div>
      ) : (
        <KnowledgeTrendComparisonChart 
          countriesData={countriesData} 
          selectedCountries={selectedCountries}
          selectedTerms={selectedTerms}
        />
      )}
      
      <TermsSelectionPanel
        allTerms={allTerms}
        selectedTerms={selectedTerms}
        onTermToggle={onTermToggle}
      />
    </div>
  );
};

export default TrendsView;
