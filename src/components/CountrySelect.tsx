
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface CountrySelectProps {
  selectedCountry: string;
  countries: string[];
  onCountryChange: (country: string) => void;
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

const CountrySelect = ({
  selectedCountry,
  countries,
  onCountryChange,
}: CountrySelectProps) => {
  // Log when countries are loaded or changed
  useEffect(() => {
    console.log("CountrySelect rendered with countries:", countries);
  }, [countries]);

  return (
    <div className="space-y-2">
      <Label>Select Country</Label>
      <Select value={selectedCountry} onValueChange={onCountryChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Choose a country">
            {selectedCountry ? getFullCountryName(selectedCountry) : "Choose a country"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {countries && countries.length > 0 ? (
            countries.map((country) => (
              <SelectItem key={country} value={country}>
                {getFullCountryName(country)}
              </SelectItem>
            ))
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
