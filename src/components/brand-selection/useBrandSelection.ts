import { useState, useEffect } from "react";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { reorganizeBrandsIntoColumns } from "./brandColumnUtils";

const filterBrands = (brands: string[], searchQuery: string): string[] => {
  return brands.filter(brand => {
    const normalizedBrand = normalizeBrandName(brand);
    const normalizedQuery = normalizeBrandName(searchQuery);
    return normalizedBrand.includes(normalizedQuery);
  });
};

const handleSpecialBrands = (
  brands: string[], 
  selectedBrands: string[], 
  onBrandToggle: (brand: string, checked: boolean) => void
) => {
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
};

const getBatchSelectionState = (filteredBrands: string[], selectedBrands: string[]) => {
  const allVisibleSelected = filteredBrands.length > 0 && 
    filteredBrands.every(brand => selectedBrands.includes(brand));
  
  const someVisibleSelected = filteredBrands.some(brand => selectedBrands.includes(brand));
  
  const selectedVisibleBrandsCount = filteredBrands.filter(brand => 
    selectedBrands.includes(brand)
  ).length;
  
  return { allVisibleSelected, someVisibleSelected, selectedVisibleBrandsCount };
};

export const useBrandSelection = (
  brands: string[],
  selectedBrands: string[],
  onBrandToggle: (brand: string, checked: boolean) => void,
  onClearBrands: () => void,
  onBatchToggle?: (brands: string[], checked: boolean) => void
) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    console.log("Brands for selection:", brands);
  }, [brands]);
  
  const columnOrderedBrands = reorganizeBrandsIntoColumns(brands);
  const filteredBrands = filterBrands(columnOrderedBrands, searchQuery);

  const handleSelectAll = () => {
    const allVisibleBrandsSelected = filteredBrands.every(brand => 
      selectedBrands.includes(brand)
    );
    
    if (allVisibleBrandsSelected) {
      handleBatchDeselection(filteredBrands, selectedBrands);
    } else {
      handleBatchSelection(filteredBrands, selectedBrands);
    }
  };
  
  const handleBatchDeselection = (brandsToConsider: string[], currentlySelected: string[]) => {
    const brandsToDeselect = brandsToConsider.filter(brand => 
      currentlySelected.includes(brand)
    );
    
    if (onBatchToggle) {
      onBatchToggle(brandsToDeselect, false);
    } else {
      const brandsToKeepSelected = currentlySelected.filter(brand => 
        !brandsToConsider.includes(brand)
      );
      
      if (brandsToKeepSelected.length === 0) {
        onClearBrands();
      } else {
        onClearBrands();
        setTimeout(() => {
          brandsToKeepSelected.forEach(brand => {
            onBrandToggle(brand, true);
          });
        }, 0);
      }
    }
  };
  
  const handleBatchSelection = (brandsToConsider: string[], currentlySelected: string[]) => {
    const brandsToAdd = brandsToConsider.filter(brand => 
      !currentlySelected.includes(brand)
    );
    
    if (onBatchToggle) {
      onBatchToggle(brandsToAdd, true);
    } else {
      const allBrands = [...currentlySelected];
      
      brandsToConsider.forEach(brand => {
        if (!allBrands.includes(brand)) {
          allBrands.push(brand);
        }
      });
      
      onClearBrands();
      
      console.log("Adding all brands in one batch:", allBrands.length);
      
      setTimeout(() => {
        allBrands.forEach(brand => {
          onBrandToggle(brand, true);
        });
      }, 0);
    }
  };

  useEffect(() => {
    handleSpecialBrands(brands, selectedBrands, onBrandToggle);
  }, [brands, selectedBrands, onBrandToggle]);

  const { 
    allVisibleSelected, 
    someVisibleSelected, 
    selectedVisibleBrandsCount 
  } = getBatchSelectionState(filteredBrands, selectedBrands);

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
