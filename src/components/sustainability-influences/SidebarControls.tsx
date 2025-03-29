
import React from 'react';
import CountrySelect from '@/components/CountrySelect';
import YearSelector from './YearSelector';
import InfluenceSelector from './InfluenceSelector';

interface SidebarControlsProps {
  activeTab: string;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  influences: string[];
  selectedInfluences: string[];
  onInfluencesChange: (influences: string[]) => void;
  countries: string[];
}

const SidebarControls: React.FC<SidebarControlsProps> = ({
  activeTab,
  selectedCountry,
  onCountryChange,
  years,
  selectedYear,
  onYearChange,
  influences,
  selectedInfluences,
  onInfluencesChange,
  countries
}) => {
  return (
    <div className="space-y-4">
      <CountrySelect
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
        countries={countries}
      />
      
      {activeTab === "yearly" ? (
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          onChange={onYearChange}
        />
      ) : (
        <InfluenceSelector
          influences={influences}
          selectedInfluences={selectedInfluences}
          onChange={onInfluencesChange}
        />
      )}
    </div>
  );
};

export default SidebarControls;
