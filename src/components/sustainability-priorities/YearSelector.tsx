
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ years, selectedYear, onChange }) => {
  const sortedYears = [...years].sort((a, b) => b - a); // Sort years descending (newest first)

  return (
    <div className="space-y-2">
      <Label>Select Year</Label>
      <Select value={selectedYear.toString()} onValueChange={(value) => onChange(parseInt(value))}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Choose a year">
            {selectedYear}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {sortedYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelector;
