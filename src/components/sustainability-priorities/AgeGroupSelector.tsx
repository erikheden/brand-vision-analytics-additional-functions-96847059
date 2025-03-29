
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AgeGroup } from "@/hooks/useGeneralMaterialityData";
import { Skeleton } from "@/components/ui/skeleton";

interface AgeGroupSelectorProps {
  ageGroups: AgeGroup[];
  selectedAgeId: number | null;
  onChange: (ageId: number | null) => void;
  isLoading: boolean;
}

const AgeGroupSelector: React.FC<AgeGroupSelectorProps> = ({
  ageGroups,
  selectedAgeId,
  onChange,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card className="p-4 bg-white shadow">
        <Label className="block mb-2 text-sm font-medium text-gray-700">
          Age Group
        </Label>
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </Card>
    );
  }

  if (ageGroups.length === 0) {
    return null;
  }

  const handleChange = (value: string) => {
    if (value === "general") {
      onChange(null);
    } else {
      onChange(parseInt(value, 10));
    }
  };

  return (
    <Card className="p-4 bg-white shadow">
      <Label className="block mb-2 text-sm font-medium text-gray-700">
        Age Group
      </Label>
      <RadioGroup
        value={selectedAgeId === null ? "general" : selectedAgeId.toString()}
        onValueChange={handleChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="general" id="general" />
          <Label
            htmlFor="general"
            className="text-sm cursor-pointer font-medium"
          >
            General Population
          </Label>
        </div>

        {ageGroups.map((ageGroup) => (
          <div key={ageGroup.age_id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={ageGroup.age_id.toString()}
              id={`age-${ageGroup.age_id}`}
            />
            <Label
              htmlFor={`age-${ageGroup.age_id}`}
              className="text-sm cursor-pointer"
            >
              {ageGroup.age_group}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
};

export default AgeGroupSelector;
