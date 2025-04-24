
import React, { useState } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { Card } from '@/components/ui/card';
import TermSelector from './TermSelector';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { createKnowledgeTrendChartOptions } from './charts/chartOptions/knowledgeTrendOptions';
import { BarChart, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface KnowledgeTrendsTabProps {
  data: Record<string, KnowledgeData[]>;
  terms: string[];
  selectedTerms: string[];
  selectedCountries: string[];
  setSelectedTerms: (terms: string[]) => void;
}

type ChartType = 'line' | 'column';

const KnowledgeTrendsTab: React.FC<KnowledgeTrendsTabProps> = ({
  data,
  terms,
  selectedTerms,
  selectedCountries,
  setSelectedTerms
}) => {
  const [chartType, setChartType] = useState<ChartType>('line');

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

  const options = createKnowledgeTrendChartOptions(data, selectedTerms, selectedCountries, chartType);
  
  const handleChartTypeChange = (newType: string) => {
    if (newType) {
      setChartType(newType as ChartType);
    }
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
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#34502b]">Knowledge Trends</h2>
            <ToggleGroup type="single" value={chartType} onValueChange={handleChartTypeChange} className="bg-gray-100 rounded-md p-1">
              <ToggleGroupItem value="line" className="data-[state=on]:bg-white data-[state=on]:text-[#34502b] data-[state=on]:shadow-sm rounded-sm p-2">
                <LineChart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="column" className="data-[state=on]:bg-white data-[state=on]:text-[#34502b] data-[state=on]:shadow-sm rounded-sm p-2">
                <BarChart className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="h-[500px]">
            <HighchartsReact 
              highcharts={Highcharts} 
              options={options}
              immutable={false}
              updateArgs={[true, true, true]}
            />
          </div>
          {selectedCountries.length > 1 && (
            <div className="mt-4 p-3 bg-[#f1f0fb] rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Comparing {selectedCountries.length} countries:</strong> View how sustainability knowledge 
                trends differ across markets.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeTrendsTab;
