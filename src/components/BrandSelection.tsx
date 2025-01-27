import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, CheckSquare } from "lucide-react";
import BrandCheckbox from "./BrandCheckbox";

interface BrandSelectionProps {
  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string, checked: boolean) => void;
  onClearBrands: () => void;
}

const BrandSelection = ({
  brands,
  selectedBrands,
  onBrandToggle,
  onClearBrands,
}: BrandSelectionProps) => {
  // Calculate the number of rows needed based on total brands and 4 columns
  const numColumns = 4;
  const numRows = Math.ceil(brands.length / numColumns);
  
  // Reorganize brands into column-first order
  const reorganizeBrandsIntoColumns = (brands: string[]) => {
    const sortedBrands = [...brands].sort();
    const result: string[] = new Array(brands.length);
    const itemsPerColumn = Math.ceil(sortedBrands.length / numColumns);
    
    for (let i = 0; i < sortedBrands.length; i++) {
      // Calculate position in the grid
      const column = Math.floor(i / itemsPerColumn);
      const row = i % itemsPerColumn;
      const newIndex = row * numColumns + column;
      
      result[newIndex] = sortedBrands[i];
    }
    
    return result.filter(brand => brand !== undefined);
  };

  const columnOrderedBrands = reorganizeBrandsIntoColumns(brands);

  const handleSelectAll = () => {
    // Select all brands that aren't already selected
    const brandsToAdd = brands.filter(brand => !selectedBrands.includes(brand));
    brandsToAdd.forEach(brand => onBrandToggle(brand, true));
  };

  const allBrandsSelected = brands.length > 0 && brands.every(brand => selectedBrands.includes(brand));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Select Brands</Label>
        <div className="flex gap-2">
          {!allBrandsSelected && brands.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-sm"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              Select all
            </Button>
          )}
          {selectedBrands.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearBrands}
              className="text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
        {columnOrderedBrands.map((brand) => (
          <BrandCheckbox
            key={brand}
            brand={brand}
            isChecked={selectedBrands.includes(brand)}
            onCheckedChange={(checked) => onBrandToggle(brand, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandSelection;