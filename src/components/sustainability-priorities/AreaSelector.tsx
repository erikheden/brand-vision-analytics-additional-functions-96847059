
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AreaSelectorProps {
  areas: string[];
  selectedAreas: string[];
  onChange: (areas: string[]) => void;
  onClearAreas?: () => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({ 
  areas, 
  selectedAreas,
  onChange,
  onClearAreas
}) => {
  const handleAreaToggle = (area: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedAreas, area]);
    } else {
      onChange(selectedAreas.filter(a => a !== area));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-[#34502b]">
          Filter by Sustainability Areas
        </Label>
        
        {selectedAreas.length > 0 && onClearAreas && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs text-[#34502b]/70 hover:text-[#34502b] flex items-center gap-1"
            onClick={onClearAreas}
            type="button"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[180px] rounded-md border border-[#34502b]/20 p-2">
        <div className="space-y-2 pr-4">
          {areas.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={`area-${area}`}
                checked={selectedAreas.includes(area)}
                onCheckedChange={(checked) => handleAreaToggle(area, checked === true)}
              />
              <label
                htmlFor={`area-${area}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {area}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AreaSelector;
