
import React from "react";
import { Card } from "@/components/ui/card";
import AreaSelector from "@/components/sustainability-priorities/AreaSelector";
import PrioritiesTrendChart from "@/components/sustainability-priorities/PrioritiesTrendChart";
import { MaterialityData } from "@/hooks/useGeneralMaterialityData";

interface AreaFocusTabProps {
  selectedCountries: string[];
  allAreas: string[];
  selectedAreas: string[];
  setSelectedAreas: (areas: string[]) => void;
  trendData: MaterialityData[];
}

const AreaFocusTab: React.FC<AreaFocusTabProps> = ({
  selectedCountries,
  allAreas,
  selectedAreas,
  setSelectedAreas,
  trendData
}) => {
  const handleClearAreas = () => {
    setSelectedAreas([]);
  };

  // Only transform and display areas that are actually selected
  const transformedSelectedAreas = selectedAreas.flatMap(area => 
    selectedCountries.map(country => `${area} (${country})`)
  );

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-4">
        <p className="text-gray-600">
          Compare trends of the same sustainability priority across different countries.
        </p>
      </Card>
      
      <div className="space-y-4">
        <AreaSelector
          areas={allAreas.filter(area => !area.includes('('))} // Filter out compound names
          selectedAreas={selectedAreas}
          onChange={setSelectedAreas}
          onClearAreas={handleClearAreas}
        />

        {selectedAreas.length > 0 ? (
          <PrioritiesTrendChart
            data={trendData}
            selectedAreas={transformedSelectedAreas}
          />
        ) : (
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
            <div className="text-center py-10 text-gray-500">
              Select at least one sustainability area to view trends
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AreaFocusTab;
