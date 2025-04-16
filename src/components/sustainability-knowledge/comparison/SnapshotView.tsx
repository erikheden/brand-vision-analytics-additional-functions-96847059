
import React from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import KnowledgeComparisonChart from '../KnowledgeComparisonChart';
import TermsSelectionPanel from './TermsSelectionPanel';

interface SnapshotViewProps {
  countriesData: Record<string, KnowledgeData[]>;
  selectedCountries: string[];
  selectedTerms: string[];
  selectedYear: number;
  allTerms: string[];
  onTermToggle: (term: string) => void;
}

const SnapshotView: React.FC<SnapshotViewProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms,
  selectedYear,
  allTerms,
  onTermToggle
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Knowledge Levels Comparison</h3>
      </div>
      
      <KnowledgeComparisonChart 
        countriesData={countriesData} 
        selectedCountries={selectedCountries}
        selectedTerms={selectedTerms}
        selectedYear={selectedYear}
      />
      
      <TermsSelectionPanel
        allTerms={allTerms}
        selectedTerms={selectedTerms}
        onTermToggle={onTermToggle}
      />
    </div>
  );
};

export default SnapshotView;
