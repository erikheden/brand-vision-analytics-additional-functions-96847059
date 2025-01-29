import { useState } from "react";
import { BrandData } from "@/types/brand";

export const useSelectionState = (
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const handleIndustryToggle = (industry: string, brands: BrandData[]) => {
    // If clicking the currently selected industry, clear the selection
    if (selectedIndustry === industry) {
      setSelectedIndustry("");
      setSelectedBrands([]);
      return;
    }

    // Get all brands for the new industry
    const industryBrands = brands
      .filter(item => item.industry === industry)
      .map(item => item.Brand)
      .filter((brand): brand is string => brand !== null);

    // Update both states together - always select all brands for the new industry
    setSelectedIndustry(industry);
    setSelectedBrands([...new Set(industryBrands)]);
  };

  return {
    selectedIndustry,
    setSelectedIndustry,
    handleIndustryToggle
  };
};