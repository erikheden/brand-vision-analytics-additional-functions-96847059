
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
  if (!years || years.length === 0) {
    return (
      <Card className="p-4 bg-white shadow">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700">Year</h3>
        </div>
        <div className="text-center text-gray-500 py-2">
          No years available
        </div>
      </Card>
    );
  }

  // Sort years in descending order for better UX
  const sortedYears = [...years].sort((a, b) => b - a);
  
  console.log("YearSelector rendering with years:", sortedYears, "and selectedYear:", selectedYear);

  return (
    <Card className="p-4 bg-white shadow">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-700">Year</h3>
      </div>
      
      <Select 
        value={selectedYear.toString()} 
        onValueChange={(value) => {
          const year = parseInt(value, 10);
          console.log(`YearSelector: changing year from ${selectedYear} to ${year}`);
          onChange(year);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {sortedYears.map((year) => (
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
