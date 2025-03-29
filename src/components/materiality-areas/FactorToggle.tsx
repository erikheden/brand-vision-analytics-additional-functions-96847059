
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

interface FactorToggleProps {
  selectedFactors: string[];
  toggleFactor: (factor: string) => void;
}

const FactorToggle: React.FC<FactorToggleProps> = ({
  selectedFactors,
  toggleFactor
}) => {
  const factorLabels = {
    'hygiene_factor': 'Hygiene Factors',
    'more_of': 'More Of Factors'
  };

  return (
    <div className="space-y-2">
      <Label>Factor Types</Label>
      <div className="flex flex-col gap-2">
        <ToggleGroup type="multiple" variant="outline" className="justify-start">
          <ToggleGroupItem 
            value="hygiene_factor" 
            className={`border ${selectedFactors.includes('hygiene_factor') ? 'bg-[#34502b] text-white' : ''}`}
            onClick={() => toggleFactor('hygiene_factor')}
            data-state={selectedFactors.includes('hygiene_factor') ? 'on' : 'off'}
          >
            {factorLabels['hygiene_factor']}
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="more_of" 
            className={`border ${selectedFactors.includes('more_of') ? 'bg-[#34502b] text-white' : ''}`}
            onClick={() => toggleFactor('more_of')}
            data-state={selectedFactors.includes('more_of') ? 'on' : 'off'}
          >
            {factorLabels['more_of']}
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-gray-500 mt-1">
          {selectedFactors.includes('hygiene_factor') && selectedFactors.includes('more_of') 
            ? 'Showing both factor types' 
            : `Showing ${selectedFactors.includes('hygiene_factor') ? 'Hygiene Factors' : 'More Of Factors'}`}
        </p>
      </div>
    </div>
  );
};

export default FactorToggle;
