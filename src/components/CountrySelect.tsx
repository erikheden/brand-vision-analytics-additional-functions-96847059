
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
  'Se': 'Sweden',
  'No': 'Norway',
  'Dk': 'Denmark',
  'Fi': 'Finland',
  'Nl': 'The Netherlands'
};

// Map of full names back to country codes
export const reverseCountryMapping: { [key: string]: string } = {
  'Sweden': 'Se',
  'Norway': 'No',
  'Denmark': 'Dk',
  'Finland': 'Fi',
  'The Netherlands': 'Nl'
};

export const getFullCountryName = (code: string) => {
  return countryMapping[code] || code;
};

export const getCountryCode = (fullName: string) => {
  return reverseCountryMapping[fullName] || fullName;
};

// Function to normalize country code/name to ensure consistent format
export const normalizeCountry = (country: string) => {
  // If it's a known code, return the code
  if (countryMapping[country]) {
    return country;
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
