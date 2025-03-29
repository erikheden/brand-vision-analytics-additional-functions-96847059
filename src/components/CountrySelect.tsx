import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  selectedCountry: string;
  countries: string[];
  onCountryChange: (country: string) => void;
  className?: string;
}

// Map of country codes to full names
export const countryMapping: { [key: string]: string } = {
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'NL': 'The Netherlands',
  'se': 'Sweden',
  'no': 'Norway',
  'dk': 'Denmark',
  'fi': 'Finland',
  'nl': 'The Netherlands'
};

// Map of full names back to country codes
export const reverseCountryMapping: { [key: string]: string } = {
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'The Netherlands': 'NL'
};

// Function to get the full country name from a code
export const getFullCountryName = (code: string) => {
  // First check if it's a known code (case-insensitive)
  const upperCode = code.toUpperCase();
  if (countryMapping[upperCode]) {
    return countryMapping[upperCode];
  }
  
  // If it's already a full name, return it
  if (Object.values(countryMapping).includes(code)) {
    return code;
  }
  
  // Otherwise, return the original value
  return code;
};

// Function to get the country code from a full name
export const getCountryCode = (fullName: string) => {
  return reverseCountryMapping[fullName] || fullName;
};

// Function to normalize country code/name to ensure consistent format
export const normalizeCountry = (country: string) => {
  if (!country) return '';
  
  // If it's a known code (case-insensitive), return the uppercase version
  const upperCode = country.toUpperCase();
  if (countryMapping[upperCode]) {
    return upperCode;
  }
  
  // If it's a known full name, return the code
  if (reverseCountryMapping[country]) {
    return reverseCountryMapping[country];
  }
  
  // Otherwise, return as is
  return country;
};

const CountrySelect = ({
  selectedCountry,
  countries,
  onCountryChange,
  className,
}: CountrySelectProps) => {
  // Log when countries are loaded or changed
  useEffect(() => {
    console.log("CountrySelect rendered with countries:", countries);
  }, [countries]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Select Country</Label>
      <Select value={selectedCountry} onValueChange={onCountryChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Choose a country">
            {selectedCountry ? getFullCountryName(selectedCountry) : "Choose a country"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {countries && countries.length > 0 ? (
            countries.map((country) => {
              // Normalize country to ensure consistent display
              const normalizedCountry = normalizeCountry(country);
              return (
                <SelectItem key={normalizedCountry} value={normalizedCountry}>
                  {getFullCountryName(normalizedCountry)}
                </SelectItem>
              );
            })
          ) : (
            <SelectItem value="loading" disabled>
              No countries available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelect;
