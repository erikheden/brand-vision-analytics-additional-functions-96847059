
import { useState, useEffect } from "react";
import { useBrandSelection } from "./brand-selection/useBrandSelection";
import BrandSelectionHeader from "./brand-selection/BrandSelectionHeader";
import SearchInput from "./brand-selection/SearchInput";
import BrandSelectionGrid from "./brand-selection/BrandSelectionGrid";

interface BrandSelectionProps {
  brands: string[];
  selectedBrands: string[];
  selectedCountries: string[];
  brandsWithDataInfo?: Record<string, { hasData: boolean, countries: string[] }>;
  onBrandToggle: (brand: string, checked: boolean) => void;
  onClearBrands: () => void;
  // Add a new batch toggle prop that can handle multiple brands at once
  onBatchToggle?: (brands: string[], checked: boolean) => void;
}

const BrandSelection = ({
  brands,
  selectedBrands,
  selectedCountries,
  brandsWithDataInfo = {},
  onBrandToggle,
  onClearBrands,
  onBatchToggle
}: BrandSelectionProps) => {
  const {
    searchQuery,
    setSearchQuery,
    filteredBrands,
    handleSelectAll,
    allVisibleSelected,
    someVisibleSelected,
    selectedVisibleBrandsCount
  } = useBrandSelection(
    brands,
    selectedBrands,
    onBrandToggle,
    onBatchToggle,
    onClearBrands
  );

  return (
    <div className="space-y-4">
      <BrandSelectionHeader
        filteredBrandsCount={filteredBrands.length}
        selectedVisibleBrandsCount={selectedVisibleBrandsCount}
        allVisibleSelected={allVisibleSelected}
        someVisibleSelected={someVisibleSelected}
        onSelectAll={handleSelectAll}
      />
      
      <SearchInput 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <BrandSelectionGrid
        filteredBrands={filteredBrands}
        selectedBrands={selectedBrands}
        brandsWithDataInfo={brandsWithDataInfo}
        onBrandToggle={onBrandToggle}
      />
    </div>
  );
};

export default BrandSelection;
