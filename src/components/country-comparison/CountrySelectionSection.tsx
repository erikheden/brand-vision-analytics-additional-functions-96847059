
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, X } from "lucide-react";
import { getFullCountryName } from "../CountrySelect";
import CountryButtonSelect from "@/components/CountryButtonSelect";

interface CountrySelectionSectionProps {
  countries: string[];
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
}

const CountrySelectionSection = ({
  countries,
  selectedCountries,
  setSelectedCountries
}: CountrySelectionSectionProps) => {
  const handleToggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2 text-[#34502b]">
        <Globe className="h-5 w-5" />
        Select Countries to Compare
      </h3>
      
      <CountryButtonSelect
        countries={countries}
        selectedCountries={selectedCountries}
        onCountryChange={handleToggleCountry}
      />
      
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
          {selectedCountries.map((country) => (
            <Badge 
              key={country} 
              className="bg-[#34502b]/10 text-[#34502b] hover:bg-[#34502b]/20 px-3 py-1"
            >
              {getFullCountryName(country)}
              <button 
                className="ml-2 hover:text-[#34502b]/70 transition-colors"
                onClick={() => setSelectedCountries(selectedCountries.filter(c => c !== country))}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedCountries.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-[#34502b]/70 hover:text-[#34502b] transition-colors"
              onClick={() => setSelectedCountries([])}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelectionSection;
