import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
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
    const result: string[] = new Array(brands.length);
    let index = 0;
    
    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        const originalIndex = row * numColumns + col;
        if (originalIndex < brands.length) {
          result[index] = brands[originalIndex];
          index++;
        }
      }
    }
    
    return result;
  };

  const columnOrderedBrands = reorganizeBrandsIntoColumns(brands);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Select Brands</Label>
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