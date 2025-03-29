
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory
}) => {
  return (
    <div className="space-y-2">
      <Label>Select Category</Label>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Choose a category">
            {selectedCategory || "All categories"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          <SelectItem value="all_categories">All categories</SelectItem>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="loading" disabled>
              No categories available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
