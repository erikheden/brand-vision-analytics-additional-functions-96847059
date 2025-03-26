
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AreaSelectorProps {
  areas: string[];
  selectedAreas: string[];
  onChange: (areas: string[]) => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({ areas, selectedAreas, onChange }) => {
  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      onChange(selectedAreas.filter(a => a !== area));
    } else {
      onChange([...selectedAreas, area]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAreas.length === areas.length) {
      onChange([]);
    } else {
      onChange([...areas]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Card className="bg-white border-2 border-[#34502b]/20 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg text-[#34502b]">Sustainability Areas</CardTitle>
            <CardDescription>
              Select areas to display in the trend chart
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedAreas.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-[#34502b]/70 hover:text-[#34502b] flex items-center gap-1"
                onClick={handleClearAll}
              >
                <X className="h-3 w-3" />
                Clear all
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs font-medium bg-[#34502b]/10 text-[#34502b] px-2 py-1 rounded hover:bg-[#34502b]/20 transition-colors"
              onClick={handleSelectAll}
            >
              {selectedAreas.length === areas.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {areas.map(area => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox 
                  id={`area-${area}`}
                  checked={selectedAreas.includes(area)}
                  onCheckedChange={() => handleAreaToggle(area)}
                  className="border-[#34502b]/50 data-[state=checked]:bg-[#34502b] data-[state=checked]:border-[#34502b]"
                />
                <label 
                  htmlFor={`area-${area}`}
                  className="text-sm text-[#34502b] leading-tight cursor-pointer"
                >
                  {area}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AreaSelector;
