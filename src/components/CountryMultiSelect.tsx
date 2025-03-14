import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getFullCountryName, normalizeCountry } from "@/components/CountrySelect";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CountryMultiSelectProps {
  countries: string[];
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
}

const CountryMultiSelect = ({
  countries,
  selectedCountries,
  setSelectedCountries,
}: CountryMultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const toggleCountry = (country: string) => {
    const normalizedCountry = normalizeCountry(country);
    
    // If already selected, remove it
    if (selectedCountries.includes(normalizedCountry)) {
      setSelectedCountries(selectedCountries.filter(c => c !== normalizedCountry));
    } 
    // Otherwise add it
    else {
      setSelectedCountries([...selectedCountries, normalizedCountry]);
    }
  };

  return (
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
            : "Select countries..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="w-full">
          <CommandInput placeholder="Search countries..." className="h-9" />
          <CommandList>
            <CommandEmpty>No countries found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-60">
                {countries.map((country) => {
                  const normalizedCountry = normalizeCountry(country);
                  const isSelected = selectedCountries.includes(normalizedCountry);
                  
                  return (
                    <CommandItem
                      key={normalizedCountry}
                      value={normalizedCountry}
                      onSelect={() => toggleCountry(normalizedCountry)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isSelected ? "bg-[#34502b]/10" : ""
                      )}
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-[#34502b]",
                        isSelected ? "bg-[#34502b] text-white" : "opacity-50"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{getFullCountryName(normalizedCountry)}</span>
                    </CommandItem>
                  );
                })}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryMultiSelect;
