
import React from 'react';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { Card } from '@/components/ui/card';
import InfluencesBarChart from './InfluencesBarChart';
import InfluencesTrendChart from './InfluencesTrendChart';

interface TabViewProps {
  activeTab: string;
  selectedCountry: string;
  selectedYear: number;
  selectedInfluences: string[];
  influencesData: InfluenceData[];
}

const TabView: React.FC<TabViewProps> = ({
  activeTab,
  selectedCountry,
  selectedYear,
  selectedInfluences,
  influencesData
}) => {
  if (!selectedCountry) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select a country to view sustainability influences data.
        </div>
      </Card>
    );
  }

  return (
    <>
      {activeTab === "yearly" ? (
        <InfluencesBarChart
          data={influencesData}
          selectedYear={selectedYear}
          country={selectedCountry}
        />
      ) : (
        <InfluencesTrendChart
          data={influencesData}
          selectedInfluences={selectedInfluences}
          country={selectedCountry}
        />
      )}
    </>
  );
};

export default TabView;
