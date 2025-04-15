import React from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import KnowledgeChart from './KnowledgeChart';
import YearSelector from '@/components/sustainability-priorities/YearSelector';
interface KnowledgeLevelsTabProps {
  data: KnowledgeData[];
  years: number[];
  selectedYear: number;
  selectedTerms: string[];
  selectedCountry: string;
  setSelectedYear: (year: number) => void;
}
const KnowledgeLevelsTab: React.FC<KnowledgeLevelsTabProps> = ({
  data,
  years,
  selectedYear,
  selectedTerms,
  selectedCountry,
  setSelectedYear
}) => {
  return <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <div className="space-y-4">
          
          <YearSelector years={years} selectedYear={selectedYear} onChange={setSelectedYear} />
        </div>
      </div>
      
      <div className="md:col-span-3">
        <KnowledgeChart data={data} selectedYear={selectedYear} country={selectedCountry} selectedTerms={selectedTerms} />
      </div>
    </div>;
};
export default KnowledgeLevelsTab;