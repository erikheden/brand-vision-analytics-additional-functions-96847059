
import React from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import KnowledgeTrendChart from './KnowledgeTrendChart';
import TermSelector from './TermSelector';
import { Card } from '@/components/ui/card';

interface KnowledgeTrendsTabProps {
  data: KnowledgeData[];
  terms: string[];
  selectedTerms: string[];
  selectedCountry: string;
  setSelectedTerms: (terms: string[]) => void;
}

const KnowledgeTrendsTab: React.FC<KnowledgeTrendsTabProps> = ({
  data,
  terms,
  selectedTerms,
  selectedCountry,
  setSelectedTerms
}) => {
  const handleTermToggle = (term: string) => {
    if (selectedTerms.includes(term)) {
      setSelectedTerms(selectedTerms.filter(t => t !== term));
    } else {
      setSelectedTerms([...selectedTerms, term]);
    }
  };

  const handleSelectAllTerms = () => {
    setSelectedTerms([...terms]);
  };

  const handleClearTerms = () => {
    setSelectedTerms([]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <TermSelector 
          terms={terms} 
          selectedTerms={selectedTerms} 
          onChange={setSelectedTerms} 
        />
      </div>
      
      <div className="md:col-span-3">
        {selectedTerms.length === 0 ? (
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
            <div className="text-center py-10 text-gray-500">
              Please select at least one term to view trends over time.
            </div>
          </Card>
        ) : (
          <KnowledgeTrendChart
            data={data}
            selectedTerms={selectedTerms}
            country={selectedCountry}
          />
        )}
      </div>
    </div>
  );
};

export default KnowledgeTrendsTab;
