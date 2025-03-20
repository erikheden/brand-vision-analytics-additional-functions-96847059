
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Check, Search } from "lucide-react";
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
    if (selectedBrands.length === 0) {
      filteredBrands.forEach(brand => {
        // Only select brands that have data (or brands without explicit data info)
        const info = brandsWithDataInfo[brand];
        if (!info || info.hasData) {
          if (!selectedBrands.includes(brand)) {
            onBrandToggle(brand, true);
          }
        }
      });
    } else {
      onClearBrands();
    }
  };

  // Special case handling for hotel brands like Airbnb
  useEffect(() => {
    // If this is a special brand like Airbnb that might be miscategorized in data
    // This ensures brands like Airbnb are always included when their industry is selected
    const specialBrandMappings: Record<string, string[]> = {
      "Hotels": ["Airbnb", "airbnb", "AirBnB"],
      "Hotels & Accommodations": ["Airbnb", "airbnb", "AirBnB"]
    };
    
    // Check if we need to perform special handling
    Object.entries(specialBrandMappings).forEach(([industry, specialBrands]) => {
      // If we're displaying brands and some are already selected (indicating an industry selection)
      if (brands.length > 0 && selectedBrands.length > 0) {
        // Check if we have special brands that should be included
        const missingSpecialBrands = specialBrands.filter(specialBrand => 
          brands.some(brand => normalizeBrandName(brand) === normalizeBrandName(specialBrand)) && 
          !selectedBrands.some(selected => normalizeBrandName(selected) === normalizeBrandName(specialBrand))
        );
        
        // If we found special brands that should be included, add them
        missingSpecialBrands.forEach(missingBrand => {
          const brandToAdd = brands.find(b => normalizeBrandName(b) === normalizeBrandName(missingBrand));
          if (brandToAdd) {
            onBrandToggle(brandToAdd, true);
          }
        });
      }
    });
  }, [brands, selectedBrands, onBrandToggle]);

  const brandsWithDataCount = Object.values(brandsWithDataInfo).filter(info => info.hasData).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Select Brands</Label>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">
            {filteredBrands.length} brands total
          </span>
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
