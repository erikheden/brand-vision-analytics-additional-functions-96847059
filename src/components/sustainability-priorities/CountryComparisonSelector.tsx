
import React from 'react';
import { Label } from '@/components/ui/label';
import CountryMultiSelect from '@/components/CountryMultiSelect';

interface CountryComparisonSelectorProps {
  availableCountries: string[];
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
}

const CountryComparisonSelector: React.FC<CountryComparisonSelectorProps> = ({
  availableCountries,
  selectedCountries,
  onCountriesChange
}) => {
  // Ensure we have arrays even if props are undefined
  const countries = availableCountries || [];
  const selected = selectedCountries || [];

  return (
    <div className="space-y-2">
      <Label htmlFor="country-select" className="text-sm font-medium text-[#34502b]">
        Select Countries to Compare
      </Label>
      <CountryMultiSelect
        countries={countries}
        selectedCountries={selected}
        setSelectedCountries={onCountriesChange}
      />
    </div>
  );
};

export default CountryComparisonSelector;
