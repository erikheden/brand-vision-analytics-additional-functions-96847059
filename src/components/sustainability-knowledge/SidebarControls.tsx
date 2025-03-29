
import React from 'react';
import CountrySelect from '@/components/CountrySelect';
import YearSelector from '@/components/sustainability-influences/YearSelector';
import TermSelector from './TermSelector';

interface SidebarControlsProps {
  activeTab: string;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  terms: string[];
  selectedTerms: string[];
  onTermsChange: (terms: string[]) => void;
  countries: string[];
}

const SidebarControls: React.FC<SidebarControlsProps> = ({
  activeTab,
  selectedCountry,
  onCountryChange,
  years,
  selectedYear,
  onYearChange,
  terms,
  selectedTerms,
  onTermsChange,
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
        <TermSelector
          terms={terms}
          selectedTerms={selectedTerms}
          onChange={onTermsChange}
        />
      )}
    </div>
  );
};

export default SidebarControls;
