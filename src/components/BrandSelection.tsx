
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Check, Search, CheckCheck } from "lucide-react";
import BrandCheckbox from "./BrandCheckbox";
import { useState, useEffect } from "react";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

interface BrandSelectionProps {
  brands: string[];
  selectedBrands: string[];
  selectedCountries: string[];
  brandsWithDataInfo?: Record<string, { hasData: boolean, countries: string[] }>;
  onBrandToggle: (brand: string, checked: boolean) => void;
  onClearBrands: () => void;
}

const BrandSelection = ({
  brands,
  selectedBrands,
  selectedCountries,
  brandsWithDataInfo = {},
  onBrandToggle,
  onClearBrands,
}: BrandSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    console.log("Brands for selection:", brands);
  }, [brands]);
  
  const numColumns = 4;
  
  const reorganizeBrandsIntoColumns = (brands: string[]) => {
    const sortedBrands = [...brands].sort((a, b) => a.localeCompare(b));
    
    const result: string[] = new Array(sortedBrands.length);
    const itemsPerColumn = Math.ceil(sortedBrands.length / numColumns);
    
    for (let i = 0; i < sortedBrands.length; i++) {
      const column = Math.floor(i / itemsPerColumn);
      const row = i % itemsPerColumn;
      const newIndex = row * numColumns + column;
      
      if (newIndex < sortedBrands.length) {
        result[newIndex] = sortedBrands[i];
      }
    }
    
    return result.filter(brand => brand !== undefined);
  };

  const columnOrderedBrands = reorganizeBrandsIntoColumns(brands);
  
  const filteredBrands = columnOrderedBrands.filter(brand => {
    const normalizedBrand = normalizeBrandName(brand);
    const normalizedQuery = normalizeBrandName(searchQuery);
    return normalizedBrand.includes(normalizedQuery);
  });

  const handleSelectAll = () => {
    const currentlyVisibleBrands = filteredBrands;
    
    const allVisibleBrandsSelected = filteredBrands.every(brand => 
      selectedBrands.includes(brand)
    );
    
    if (allVisibleBrandsSelected) {
      // If all visible brands are selected, deselect them
      const newSelectedBrands = selectedBrands.filter(brand => 
        !currentlyVisibleBrands.includes(brand)
      );
      
      if (newSelectedBrands.length === 0) {
        onClearBrands();
      } else {
        // Create a new array of brands to select
        const brandsToDeselect = currentlyVisibleBrands.filter(brand => 
          selectedBrands.includes(brand)
        );
        
        // Pass the complete new selection state rather than triggering individual toggles
        const updatedSelection = selectedBrands.filter(brand => 
          !brandsToDeselect.includes(brand)
        );
        
        // Update with the new selection all at once
        onClearBrands();
        if (updatedSelection.length > 0) {
          updatedSelection.forEach(brand => {
            onBrandToggle(brand, true);
          });
        }
      }
    } else {
      // Select all visible brands at once
      const brandsToAdd = filteredBrands.filter(brand => 
        !selectedBrands.includes(brand)
      );
      
      // Add all the new brands at once
      if (brandsToAdd.length > 0) {
        const newSelection = [...selectedBrands, ...brandsToAdd];
        
        // Clear first to avoid duplicate callbacks
        onClearBrands();
        
        // Then add all brands in the new selection
        newSelection.forEach(brand => {
          onBrandToggle(brand, true);
        });
      }
    }
  };

  useEffect(() => {
    const specialBrandMappings: Record<string, string[]> = {
      "Hotels": ["Airbnb", "airbnb", "AirBnB"],
      "Hotels & Accommodations": ["Airbnb", "airbnb", "AirBnB"]
    };
    
    Object.entries(specialBrandMappings).forEach(([industry, specialBrands]) => {
      if (brands.length > 0 && selectedBrands.length > 0) {
        const missingSpecialBrands = specialBrands.filter(specialBrand => 
          brands.some(brand => normalizeBrandName(brand) === normalizeBrandName(specialBrand)) && 
          !selectedBrands.some(selected => normalizeBrandName(selected) === normalizeBrandName(specialBrand))
        );
        
        missingSpecialBrands.forEach(missingBrand => {
          const brandToAdd = brands.find(b => normalizeBrandName(b) === normalizeBrandName(missingBrand));
          if (brandToAdd) {
            onBrandToggle(brandToAdd, true);
          }
        });
      }
    });
  }, [brands, selectedBrands, onBrandToggle]);

  const allVisibleSelected = filteredBrands.length > 0 && 
    filteredBrands.every(brand => selectedBrands.includes(brand));
  const someVisibleSelected = filteredBrands.some(brand => selectedBrands.includes(brand));
  
  const selectedVisibleBrandsCount = filteredBrands.filter(brand => 
    selectedBrands.includes(brand)
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Select Brands</Label>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">
            {filteredBrands.length} brands total
            {selectedVisibleBrandsCount > 0 && ` (${selectedVisibleBrandsCount} selected)`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-sm"
          >
            {allVisibleSelected ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Deselect all
              </>
            ) : (
              <>
                <CheckCheck className="h-4 w-4 mr-1" />
                {someVisibleSelected ? 'Select all visible' : 'Select all'}
              </>
            )}
          </Button>
        </div>
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
        {filteredBrands.map((brand) => {
          const dataInfo = brandsWithDataInfo[brand];
          const hasData = !dataInfo || dataInfo.hasData;
          
          return (
            <div key={brand} className="flex items-center">
              <BrandCheckbox
                brand={brand}
                isChecked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => onBrandToggle(brand, checked)}
                className={!hasData ? "opacity-70" : ""}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandSelection;
