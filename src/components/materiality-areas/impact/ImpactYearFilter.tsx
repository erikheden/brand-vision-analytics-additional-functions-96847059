
import React from "react";
import { Label } from "@/components/ui/label";

interface ImpactYearFilterProps {
  years: number[];
  selectedYear: number | null;
  setSelectedYear: (year: number) => void;
  isLoading: boolean;
}

const ImpactYearFilter: React.FC<ImpactYearFilterProps> = ({
  years,
  selectedYear,
  setSelectedYear,
  isLoading
}) => {
  return (
    <>
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Select Year
      </Label>
      <div className="flex flex-wrap gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
              ${selectedYear === year 
                ? 'bg-[#34502b] text-white' 
                : 'bg-white text-[#34502b] border border-[#34502b]/30 hover:bg-[#34502b]/10'
              }`}
            disabled={isLoading}
          >
            {year}
          </button>
        ))}
      </div>
    </>
  );
};

export default ImpactYearFilter;
