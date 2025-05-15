
import React from "react";
import { Button } from "@/components/ui/button";
import { getFullCountryName } from "@/components/CountrySelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe } from "lucide-react";

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
        <div className="flex flex-wrap gap-3 p-1">
          {countries.map((country) => {
            const fullName = getFullCountryName(country);
            return (
              <Button
                key={country}
                variant={isSelected(country) ? "default" : "outline"}
                onClick={() => onCountryChange(country)}
                className={`px-6 py-2 rounded-xl h-auto min-w-28 text-sm font-medium relative overflow-hidden transition-all duration-300 ${
                  isSelected(country) 
                    ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8a76e4] hover:to-[#6E59A5] text-white shadow-lg border-transparent" 
                    : "bg-gradient-to-r from-white to-[#f8f8fa] hover:from-[#f0f0f5] hover:to-[#e8e8f0] text-gray-700 border border-[#e2e2f2] shadow-sm"
                } hover:scale-105 hover:shadow-xl`}
                disabled={disabled}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Globe className={`h-4 w-4 ${isSelected(country) ? "text-white" : "text-[#9b87f5]/70"}`} />
                  <span>{fullName}</span>
                </span>
                {isSelected(country) && (
                  <span className="absolute inset-0 bg-white/10 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CountryButtonSelect;
