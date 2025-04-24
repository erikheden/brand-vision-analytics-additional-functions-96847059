import React from "react";
import { Card } from "@/components/ui/card";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import { normalizeCountry } from "@/components/CountrySelect";

interface SelectionPanelProps {
  title: string;
  description: string;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  title,
  description,
  selectedCountry,
  setSelectedCountry
}) => {
  // Available countries - normalize them
  const countries = ["SE", "NO", "DK", "FI", "NL"].map(normalizeCountry);

  const handleCountryChange = (country: string) => {
    // Normalize the country code to ensure consistent format
    const normalizedCountry = normalizeCountry(country);
    
    // If clicking the currently selected country, clear selection
    if (selectedCountry === normalizedCountry) {
      setSelectedCountry("");
    } else {
      // Otherwise set to the new country
      setSelectedCountry(normalizedCountry);
    }
  };

  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#34502b]">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
        <CountryButtonSelect 
          countries={countries} 
          selectedCountries={selectedCountry ? [selectedCountry] : []} 
          onCountryChange={handleCountryChange} 
        />
      </div>
    </Card>
  );
};

export default SelectionPanel;
