
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface CountrySelectProps {
  selectedCountry: string;
  countries: string[];
  onCountryChange: (country: string) => void;
}

const countryMapping: { [key: string]: string } = {
  'Se': 'Sweden',
  'No': 'Norway',
  'Dk': 'Denmark',
  'Fi': 'Finland',
  'Nl': 'The Netherlands'
};

const getFullCountryName = (code: string) => {
  return countryMapping[code] || code;
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
        <SelectTrigger>
          <SelectValue placeholder="Choose a country">
            {selectedCountry ? getFullCountryName(selectedCountry) : "Choose a country"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.length > 0 ? (
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
