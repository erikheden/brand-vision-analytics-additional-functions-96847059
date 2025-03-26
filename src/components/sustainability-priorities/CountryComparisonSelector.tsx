
import React from 'react';
import { Label } from '@/components/ui/label';
import CountryMultiSelect from '@/components/CountryMultiSelect';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
  const countries = Array.isArray(availableCountries) ? availableCountries : [];
  const selected = Array.isArray(selectedCountries) ? selectedCountries : [];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="country-select" className="text-sm font-medium text-[#34502b]">
          Select Countries to Compare
        </Label>
        
        {selected.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs text-[#34502b]/70 hover:text-[#34502b] flex items-center gap-1"
            onClick={() => onCountriesChange([])}
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>
      
      <CountryMultiSelect
        countries={countries}
        selectedCountries={selected}
        setSelectedCountries={onCountriesChange}
      />
    </div>
  );
};

export default CountryComparisonSelector;
