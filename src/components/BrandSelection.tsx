
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Check, Search } from "lucide-react";
import BrandCheckbox from "./BrandCheckbox";
import { useState, useEffect } from "react";
import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

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
  const [searchQuery, setSearchQuery] = useState("");
  
  // Force refresh when brands change to ensure proper normalization
  useEffect(() => {
    console.log("Brands for selection:", brands);
  }, [brands]);
  
  // Calculate the number of rows needed based on total brands and 4 columns
  const numColumns = 4;
  
  // Reorganize brands into column-first order
  const reorganizeBrandsIntoColumns = (brands: string[]) => {
    const result: string[] = new Array(brands.length);
    const itemsPerColumn = Math.ceil(brands.length / numColumns);
    
    for (let i = 0; i < brands.length; i++) {
      // Calculate position in the grid
      const column = Math.floor(i / itemsPerColumn);
      const row = i % itemsPerColumn;
      const newIndex = row * numColumns + column;
      
      // Only set if the index is valid
      if (newIndex < brands.length) {
        result[newIndex] = brands[i];
      }
    }
    
    return result.filter(brand => brand !== undefined);
  };

  const columnOrderedBrands = reorganizeBrandsIntoColumns(brands);
  
  // Filter brands based on search query, using normalized comparison for better matching
  const filteredBrands = columnOrderedBrands.filter(brand => {
    const normalizedBrand = normalizeBrandName(brand);
    const normalizedQuery = normalizeBrandName(searchQuery);
    return normalizedBrand.includes(normalizedQuery);
  });

  const handleSelectAll = () => {
    // If no brands are selected, select all filtered brands
    if (selectedBrands.length === 0) {
      filteredBrands.forEach(brand => {
        onBrandToggle(brand, true);
      });
    } else {
      // If any brands are selected, clear all
      onClearBrands();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Select Brands</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="text-sm"
        >
          {selectedBrands.length === 0 ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Select all
            </>
          ) : (
            <>
              <X className="h-4 w-4 mr-1" />
              Clear all
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-6 max-h-[300px] overflow-y-auto">
        {filteredBrands.map((brand) => (
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
