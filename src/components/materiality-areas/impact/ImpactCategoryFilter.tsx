
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ImpactCategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  isLoading: boolean;
}

const ImpactCategoryFilter: React.FC<ImpactCategoryFilterProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  isLoading
}) => {
  return (
    <>
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        Select Categories
      </Label>
      <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
              disabled={isLoading}
            />
            <Label 
              htmlFor={`category-${category}`}
              className="text-sm cursor-pointer"
            >
              {category}
            </Label>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImpactCategoryFilter;
