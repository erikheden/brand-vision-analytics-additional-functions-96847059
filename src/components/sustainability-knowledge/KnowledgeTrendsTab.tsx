
import React from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { Card } from '@/components/ui/card';
import TermSelector from './TermSelector';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { createKnowledgeTrendChartOptions } from './charts/chartOptions/knowledgeTrendOptions';

interface KnowledgeTrendsTabProps {
  data: Record<string, KnowledgeData[]>;
  terms: string[];
  selectedTerms: string[];
  selectedCountries: string[];
  setSelectedTerms: (terms: string[]) => void;
}

const KnowledgeTrendsTab: React.FC<KnowledgeTrendsTabProps> = ({
  data,
  terms,
  selectedTerms,
  selectedCountries,
  setSelectedTerms
}) => {
  if (selectedTerms.length === 0) {
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
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
            <div className="text-center py-10 text-gray-500">
              Please select at least one term to view trends
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const options = createKnowledgeTrendChartOptions(data, selectedTerms, selectedCountries);

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
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="h-[500px]">
            <HighchartsReact 
              highcharts={Highcharts} 
              options={options}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeTrendsTab;
