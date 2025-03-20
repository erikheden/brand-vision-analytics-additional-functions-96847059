
import { useState } from "react";
import { BrandData } from "@/types/brand";
import { normalizeIndustryName } from "@/utils/industry/industryNormalization";

export const useSelectionState = (
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const handleIndustryToggle = (industry: string, brands: BrandData[]) => {
    console.log("Handle industry toggle called with:", industry);
    console.log("Current brands data:", brands);
    
    // Normalize the selected industry for comparison
    const normalizedSelectedIndustry = normalizeIndustryName(industry);
    
    // If clicking the currently selected industry, just clear the selection
    if (normalizeIndustryName(selectedIndustry) === normalizedSelectedIndustry) {
      console.log("Clearing industry selection");
      setSelectedIndustry("");
      setSelectedBrands([]);
      return;
    }

    // Get brands for the new industry before changing the selection
    // Important: Compare using normalized industry names
    const industryBrands = brands
      .filter(item => normalizeIndustryName(item.industry || "") === normalizedSelectedIndustry)
      .map(item => item.Brand)
      .filter((brand): brand is string => 
        typeof brand === 'string' && 
        brand !== null && 
        brand.trim() !== ''
      );

    console.log("Filtered brands for industry:", industryBrands);

    // Update both states together
    setSelectedIndustry(industry);
    setSelectedBrands([...new Set(industryBrands)]);
  };

  return {
    selectedIndustry,
    setSelectedIndustry,
    handleIndustryToggle
  };
};
