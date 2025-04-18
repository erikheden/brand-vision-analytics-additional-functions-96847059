
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import CountryButtonSelect from '@/components/CountryButtonSelect';

interface SidebarControlsProps {
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  terms: string[];
  selectedTerms: string[];
  onTermToggle: (term: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  isLoading: boolean;
}

const SidebarControls: React.FC<SidebarControlsProps> = ({
  selectedCountry,
  onCountryChange,
  terms,
  selectedTerms,
  onTermToggle,
  onSelectAll,
  onClearAll,
  isLoading,
  countries
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border-2 border-[#34502b]/20 shadow-md">
      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#34502b]">Select Country</Label>
        <CountryButtonSelect
          selectedCountry={selectedCountry}
          onCountryChange={onCountryChange}
          countries={countries}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-[#34502b]">
            Select Sustainability Terms
          </Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 text-xs text-[#34502b]/70 hover:text-[#34502b]"
              onClick={onSelectAll}
              disabled={isLoading}
            >
              Select all
            </Button>
            {selectedTerms.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 text-xs text-[#34502b]/70 hover:text-[#34502b] flex items-center gap-1"
                onClick={onClearAll}
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-4 text-center text-gray-500 text-sm animate-pulse">
            Loading terms...
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {terms.map((term) => (
                <div
                  key={term}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors hover:bg-[#34502b]/5 ${
                    selectedTerms.includes(term) ? 'bg-[#34502b]/10' : ''
                  }`}
                  onClick={() => onTermToggle(term)}
                >
                  {selectedTerms.includes(term) ? (
                    <CheckSquare className="h-4 w-4 text-[#34502b]" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-800">{term}</span>
                </div>
              ))}
              
              {terms.length === 0 && (
                <div className="py-4 text-center text-gray-500 text-sm">
                  No terms available for this country
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        
        {selectedTerms.length > 0 && (
          <div className="pt-2">
            <Label className="text-xs text-gray-500 block mb-2">Selected terms:</Label>
            <div className="flex flex-wrap gap-1">
              {selectedTerms.map((term) => (
                <Badge 
                  key={term} 
                  variant="outline" 
                  className="bg-[#34502b]/10 text-[#34502b] border-[#34502b]/20"
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarControls;
