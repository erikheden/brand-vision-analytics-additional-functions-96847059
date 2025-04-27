
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const handleInfluenceChange = (influence: string) => {
    console.log(`Toggling influence: ${influence}, current state: ${selectedInfluences.includes(influence)}`);
    
    if (selectedInfluences.includes(influence)) {
      onChange(selectedInfluences.filter(item => item !== influence));
    } else {
      onChange([...selectedInfluences, influence]);
    }
  };

  const handleSelectAll = () => {
    if (selectedInfluences.length === influences.length) {
      onChange([]);
      console.log("Deselecting all influences");
    } else {
      onChange([...influences]);
      console.log("Selecting all influences:", influences);
    }
  };

  if (!influences || influences.length === 0) {
    return (
      <Card className="p-4 bg-white shadow">
        <div className="text-center text-gray-500 py-4">
          No influence factors available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-700">Influence Factors</h3>
        <p className="text-xs text-gray-500">Select factors to show in trend chart</p>
      </div>
      
      <div className="mb-2">
        <Button
          onClick={handleSelectAll}
          variant="outline"
          size="sm"
          className="text-xs text-[#34502b] hover:bg-[#34502b]/10 w-full justify-center"
          type="button"
        >
          {selectedInfluences.length === influences.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      
      <ScrollArea className="h-[300px] pr-2">
        <div className="space-y-2">
          {influences.map((influence) => (
            <div key={influence} className="flex items-center space-x-2">
              <Checkbox
                id={`influence-${influence}`}
                checked={selectedInfluences.includes(influence)}
                onCheckedChange={() => handleInfluenceChange(influence)}
              />
              <Label
                htmlFor={`influence-${influence}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {influence}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default InfluenceSelector;
