
import React from "react";
import { Button } from "@/components/ui/button";
import { getFullCountryName } from "@/components/CountrySelect";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CountryButtonSelectProps {
  selectedCountry?: string;
  countries: string[];
  onCountryChange: (country: string) => void;
  className?: string;
  disabled?: boolean;
}

const CountryButtonSelect = ({
  selectedCountry,
  countries,
  onCountryChange,
  className,
  disabled = false
}: CountryButtonSelectProps) => {
  return (
    <div className={className}>
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2 p-1">
          {countries.map((country) => (
            <Button
              key={country}
              variant={selectedCountry === country ? "default" : "outline"}
              onClick={() => onCountryChange(country)}
              className="min-w-24"
              disabled={disabled}
            >
              {getFullCountryName(country)}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CountryButtonSelect;
