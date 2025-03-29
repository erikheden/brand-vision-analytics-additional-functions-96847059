
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TermSelectorProps {
  terms: string[];
  selectedTerms: string[];
  onChange: (terms: string[]) => void;
}

const TermSelector: React.FC<TermSelectorProps> = ({ terms, selectedTerms, onChange }) => {
  // Toggle a single term
  const handleToggle = (term: string) => {
    if (selectedTerms.includes(term)) {
      onChange(selectedTerms.filter(t => t !== term));
    } else {
      onChange([...selectedTerms, term]);
    }
  };

  // Select all terms
  const handleSelectAll = () => {
    onChange([...terms]);
  };

  // Clear all selected terms
  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Card className="p-4 bg-white shadow-sm border">
      <div className="flex justify-between items-center mb-3">
        <Label className="text-sm font-medium">Select Terms</Label>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAll}
            className="text-xs h-7 px-2"
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAll}
            className="text-xs h-7 px-2"
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2">
        {terms.map((term) => (
          <div key={term} className="flex items-center space-x-2">
            <Checkbox 
              id={`term-${term}`} 
              checked={selectedTerms.includes(term)}
              onCheckedChange={() => handleToggle(term)}
            />
            <Label 
              htmlFor={`term-${term}`} 
              className="text-sm cursor-pointer"
            >
              {term}
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TermSelector;
