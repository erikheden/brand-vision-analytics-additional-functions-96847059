
import React from 'react';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { Card } from '@/components/ui/card';
import InfluencesBarChart from './InfluencesBarChart';
import InfluencesTrendChart from './InfluencesTrendChart';
import YearSelector from './YearSelector';
import InfluenceSelector from './InfluenceSelector';

interface TabViewProps {
  activeTab: string;
  selectedCountries: string[];
  selectedYear: number;
  selectedInfluences: string[];
  influencesData: Record<string, InfluenceData[]>;
  years?: number[];
  setSelectedYear?: (year: number) => void;
  influences?: string[];
  setSelectedInfluences?: (influences: string[]) => void;
}

const TabView: React.FC<TabViewProps> = ({
  activeTab,
  selectedCountries,
  selectedYear,
  selectedInfluences,
  influencesData,
  years,
  setSelectedYear,
  influences,
  setSelectedInfluences
}) => {
  if (selectedCountries.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one country to view sustainability influences data.
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        {activeTab === "yearly" && years && setSelectedYear ? (
          <YearSelector
            years={years}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        ) : activeTab === "trends" && influences && setSelectedInfluences ? (
          <InfluenceSelector
            influences={influences}
            selectedInfluences={selectedInfluences}
            onChange={setSelectedInfluences}
          />
        ) : null}
      </div>
      
      <div className="md:col-span-3">
        {activeTab === "yearly" ? (
          <InfluencesBarChart
            data={influencesData}
            selectedYear={selectedYear}
            countries={selectedCountries}
          />
        ) : (
          <InfluencesTrendChart
            data={influencesData}
            selectedInfluences={selectedInfluences}
            countries={selectedCountries}
          />
        )}
      </div>
    </div>
  );
};

export default TabView;
