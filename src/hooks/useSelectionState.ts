
import { useState } from "react";
import { BrandData } from "@/types/brand";

export const useSelectionState = (
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const handleIndustryToggle = (industry: string, brands: BrandData[]) => {
    console.log("Handle industry toggle called with:", industry);
    console.log("Current brands data:", brands);
    
    // If clicking the currently selected industry, just clear the selection
    if (selectedIndustry === industry) {
      console.log("Clearing industry selection");
      setSelectedIndustry("");
      setSelectedBrands([]);
      return;
    }

    // Get brands for the new industry before changing the selection
    const industryBrands = brands
      .filter(item => item.industry === industry)
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
