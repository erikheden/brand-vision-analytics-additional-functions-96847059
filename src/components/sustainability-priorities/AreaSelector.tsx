
import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AreaSelectorProps {
  areas: string[];
  selectedAreas: string[];
  onChange: (areas: string[]) => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({ areas, selectedAreas, onChange }) => {
  const [open, setOpen] = React.useState(false);

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      onChange(selectedAreas.filter(a => a !== area));
    } else {
      onChange([...selectedAreas, area]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange([...areas]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Filter Sustainability Areas</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearAll} disabled={selectedAreas.length === 0}>
            Clear All
          </Button>
          <Button variant="outline" size="sm" onClick={selectAll} disabled={selectedAreas.length === areas.length}>
            Select All
          </Button>
        </div>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedAreas.length > 0
              ? `${selectedAreas.length} area${selectedAreas.length > 1 ? 's' : ''} selected`
              : "Select areas..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search areas..." />
            <CommandEmpty>No area found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {areas.map((area) => (
                <CommandItem
                  key={area}
                  value={area}
                  onSelect={() => toggleArea(area)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedAreas.includes(area) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {area}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedAreas.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedAreas.map(area => (
            <Badge key={area} variant="secondary" className="flex items-center gap-1">
              {area}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleArea(area)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaSelector;
