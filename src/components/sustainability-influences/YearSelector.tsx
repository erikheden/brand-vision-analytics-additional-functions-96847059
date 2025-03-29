
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  years,
  selectedYear,
  onChange
}) => {
  if (years.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-white shadow">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-700">Year</h3>
      </div>
      
      <Select 
        value={selectedYear.toString()} 
        onValueChange={(value) => onChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
};

export default YearSelector;
