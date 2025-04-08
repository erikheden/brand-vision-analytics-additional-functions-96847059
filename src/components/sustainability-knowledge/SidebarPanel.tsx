
import React from 'react';
import CountrySelect from '@/components/CountrySelect';
import { Card } from '@/components/ui/card';

interface SidebarPanelProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: string[];
  isLoading: boolean;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  selectedCountry,
  onCountryChange,
  countries,
  isLoading
}) => {
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select Country</h3>
          <CountrySelect
            countries={countries}
            selectedCountry={selectedCountry}
            onCountryChange={onCountryChange}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-2">
            Select a country to explore sustainability knowledge data.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SidebarPanel;
