
import React from "react";
import { Card } from "@/components/ui/card";
import CountryButtonSelect from "@/components/CountryButtonSelect";

interface SelectionPanelProps {
  title: string;
  description: string;
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  title,
  description,
  selectedCountries,
  setSelectedCountries
}) => {
  // Available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];

  const handleCountryChange = (country: string) => {
    setSelectedCountries(current => 
      current.includes(country) 
        ? current.filter(c => c !== country)
        : [...current, country]
    );
  };

  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#34502b]">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
        <CountryButtonSelect 
          countries={countries} 
          selectedCountries={selectedCountries} 
          onCountryChange={handleCountryChange} 
        />
      </div>
    </Card>
  );
};

export default SelectionPanel;
