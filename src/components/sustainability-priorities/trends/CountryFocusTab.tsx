
import React from "react";
import { Card } from "@/components/ui/card";
import AreaSelector from "@/components/sustainability-priorities/AreaSelector";
import PrioritiesTrendChart from "@/components/sustainability-priorities/PrioritiesTrendChart";
import { MaterialityData } from "@/hooks/useGeneralMaterialityData";

interface CountryFocusTabProps {
  selectedCountries: string[];
  focusedCountry: string;
  setFocusedCountry: (country: string) => void;
  allAreas: string[];
  selectedAreas: string[];
  setSelectedAreas: (areas: string[]) => void;
  trendData: MaterialityData[];
}

const CountryFocusTab: React.FC<CountryFocusTabProps> = ({
  selectedCountries,
  focusedCountry,
  setFocusedCountry,
  allAreas,
  selectedAreas,
  setSelectedAreas,
  trendData
}) => {
  const handleClearAreas = () => {
    setSelectedAreas([]);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-4">
        <p className="text-gray-600">
          View trends of sustainability priorities over time for a specific country.
        </p>
      </Card>
      
      {selectedCountries.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#34502b]">
                Focus on Country:
              </label>
              <select 
                value={focusedCountry}
                onChange={(e) => setFocusedCountry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {selectedCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <AreaSelector
          areas={allAreas}
          selectedAreas={selectedAreas}
          onChange={setSelectedAreas}
          onClearAreas={handleClearAreas}
        />

        <PrioritiesTrendChart
          data={trendData}
          selectedAreas={selectedAreas}
        />
      </div>
    </div>
  );
};

export default CountryFocusTab;
