
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface InfluenceSelectorProps {
  influences: string[];
  selectedInfluences: string[];
  onChange: (influences: string[]) => void;
}

const InfluenceSelector: React.FC<InfluenceSelectorProps> = ({
  influences,
  selectedInfluences,
  onChange
}) => {
  const toggleInfluence = (influence: string) => {
    console.log(`Toggling influence: ${influence}, current state: ${selectedInfluences.includes(influence)}`);
    
    if (selectedInfluences.includes(influence)) {
      onChange(selectedInfluences.filter(i => i !== influence));
    } else {
      onChange([...selectedInfluences, influence]);
    }
  };

  const selectAll = () => {
    onChange([...influences]);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-[#34502b]">Select Influences</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="text-xs"
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {influences.map((influence) => (
            <div key={influence} className="flex items-center space-x-2">
              <Checkbox 
                id={`influence-${influence}`}
                checked={selectedInfluences.includes(influence)}
                onCheckedChange={() => toggleInfluence(influence)}
              />
              <Label 
                htmlFor={`influence-${influence}`}
                className="cursor-pointer"
              >
                {influence}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default InfluenceSelector;
