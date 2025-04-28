
import React from "react";
import { Button } from "@/components/ui/button";
import { getFullCountryName } from "@/components/CountrySelect";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CountryButtonSelectProps {
  selectedCountry?: string;
  selectedCountries?: string[];
  countries: string[];
  onCountryChange: (country: string) => void;
  className?: string;
  disabled?: boolean;
}

const CountryButtonSelect = ({
  selectedCountry,
  selectedCountries = [],
  countries,
  onCountryChange,
  className,
  disabled = false
}: CountryButtonSelectProps) => {
  // Check if a country is selected (either in single or multiple selection mode)
  const isSelected = (country: string) => {
    if (selectedCountries && selectedCountries.length > 0) {
      return selectedCountries.includes(country);
    }
    return selectedCountry === country;
  };

  return (
    <div className={className}>
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2 p-1">
          {countries.map((country) => {
            const fullName = getFullCountryName(country);
            return (
              <Button
                key={country}
                variant={isSelected(country) ? "default" : "outline"}
                onClick={() => onCountryChange(country)}
                className="min-w-24"
                disabled={disabled}
              >
                {fullName}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CountryButtonSelect;
