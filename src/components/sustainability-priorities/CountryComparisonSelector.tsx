
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFullCountryName } from '@/components/CountrySelect';

interface CountryComparisonSelectorProps {
  availableCountries: string[];
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
}

const CountryComparisonSelector: React.FC<CountryComparisonSelectorProps> = ({
  availableCountries,
  selectedCountries,
  onCountriesChange
}) => {
  const [open, setOpen] = useState(false);

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      onCountriesChange(selectedCountries.filter(c => c !== country));
    } else {
      onCountriesChange([...selectedCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    onCountriesChange(selectedCountries.filter(c => c !== country));
  };

  const clearAll = () => {
    onCountriesChange([]);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border-[#34502b]/30 text-left font-normal"
          >
            {selectedCountries.length > 0
              ? `${selectedCountries.length} ${selectedCountries.length === 1 ? "country" : "countries"} selected`
              : "Compare countries..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search countries..." className="h-9" />
            <CommandEmpty>No countries found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {availableCountries.map((country) => {
                const isSelected = selectedCountries.includes(country);
                return (
                  <CommandItem
                    key={country}
                    value={country}
                    onSelect={() => toggleCountry(country)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border border-[#34502b]",
                      isSelected ? "bg-[#34502b] text-white" : "opacity-50"
                    )}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{getFullCountryName(country)}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCountries.map((country) => (
            <Badge 
              key={country} 
              variant="outline"
              className="bg-[#34502b]/10 text-[#34502b] hover:bg-[#34502b]/20 px-3 py-1"
            >
              {getFullCountryName(country)}
              <button 
                className="ml-2 hover:text-red-500"
                onClick={() => removeCountry(country)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedCountries.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-[#34502b]/70 hover:text-[#34502b]"
              onClick={clearAll}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryComparisonSelector;
