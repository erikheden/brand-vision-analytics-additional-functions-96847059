
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ImpactLevelFilterProps {
  sortedImpactLevels: string[];
  selectedLevels: string[];
  toggleImpactLevel: (level: string) => void;
  isLoading: boolean;
}

const ImpactLevelFilter: React.FC<ImpactLevelFilterProps> = ({
  sortedImpactLevels,
  selectedLevels,
  toggleImpactLevel,
  isLoading
}) => {
  if (sortedImpactLevels.length === 0) {
    return (
      <>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Impact Levels
        </Label>
        <div className="p-4 text-center text-gray-500 text-sm border border-gray-200 rounded-md">
          {isLoading ? "Loading impact levels..." : "No impact levels available"}
        </div>
      </>
    );
  }
  
  return (
    <>
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Impact Levels
      </Label>
      <div className="space-y-2 p-2 border border-gray-200 rounded-md">
        {sortedImpactLevels.map((level) => (
          <div key={level} className="flex items-center space-x-2">
            <Checkbox 
              id={`level-${level}`}
              checked={selectedLevels.includes(level)}
              onCheckedChange={() => toggleImpactLevel(level)}
              disabled={isLoading}
            />
            <Label 
              htmlFor={`level-${level}`}
              className="text-sm cursor-pointer"
            >
              {level}
            </Label>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImpactLevelFilter;
