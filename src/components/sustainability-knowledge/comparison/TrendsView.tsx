
import React from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import KnowledgeTrendComparisonLineChart from './KnowledgeTrendComparisonLineChart';
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
      
      <KnowledgeTrendComparisonLineChart
        countriesData={countriesData}
        selectedCountries={selectedCountries}
        selectedTerms={selectedTerms}
      />
      
      <TermsSelectionPanel
        allTerms={allTerms}
        selectedTerms={selectedTerms}
        onTermToggle={onTermToggle}
      />
    </div>
  );
};

export default TrendsView;
