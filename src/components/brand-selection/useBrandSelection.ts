
import { useState, useEffect } from "react";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { reorganizeBrandsIntoColumns } from "./brandColumnUtils";

export const useBrandSelection = (
  brands: string[],
  selectedBrands: string[],
  onBrandToggle: (brand: string, checked: boolean) => void,
  onBatchToggle?: (brands: string[], checked: boolean) => void,
  onClearBrands: () => void
) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    console.log("Brands for selection:", brands);
  }, [brands]);
  
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
      // If all visible brands are selected, deselect them all at once
      if (onBatchToggle) {
        // Use the batch toggle if available
        const brandsToDeselect = currentlyVisibleBrands.filter(brand => 
          selectedBrands.includes(brand)
        );
        onBatchToggle(brandsToDeselect, false);
      } else {
        // Fallback to one-by-one if batch toggle not available
        const newSelectedBrands = selectedBrands.filter(brand => 
          !currentlyVisibleBrands.includes(brand)
        );
        
        if (newSelectedBrands.length === 0) {
          onClearBrands();
        } else {
          // Clear and then add all remaining brands back
          onClearBrands();
          newSelectedBrands.forEach(brand => {
            onBrandToggle(brand, true);
          });
        }
      }
    } else {
      // Select all visible brands at once
      if (onBatchToggle) {
        // Use batch toggle if available
        const brandsToAdd = filteredBrands.filter(brand => 
          !selectedBrands.includes(brand)
        );
        onBatchToggle(brandsToAdd, true);
      } else {
        // First clear, then add all brands in one batch
        const allBrands = [...selectedBrands];
        
        // Add all the new visible brands
        filteredBrands.forEach(brand => {
          if (!allBrands.includes(brand)) {
            allBrands.push(brand);
          }
        });
        
        // Clear everything first
        onClearBrands();
        
        // Then add all brands
        console.log("Adding all brands in one batch:", allBrands.length);
        
        // Use a timeout to ensure the clear operation completes first
        setTimeout(() => {
          allBrands.forEach(brand => {
            onBrandToggle(brand, true);
          });
        }, 0);
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

  return {
    searchQuery,
    setSearchQuery,
    filteredBrands,
    handleSelectAll,
    allVisibleSelected,
    someVisibleSelected,
    selectedVisibleBrandsCount
  };
};
