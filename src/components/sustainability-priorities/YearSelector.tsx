import React from 'react';
import { Label } from '@/components/ui/label';
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
  // Sort years in descending order
  const sortedYears = [...years].sort((a, b) => b - a);
  return <div className="space-y-2 py-0">
      
      <Select value={selectedYear.toString()} onValueChange={value => onChange(parseInt(value))}>
        <SelectTrigger id="year-select" className="border-[#34502b]/30 focus:ring-[#34502b]/30">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {sortedYears.map(year => <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>)}
        </SelectContent>
      </Select>
    </div>;
};
export default YearSelector;