import { useState } from "react";
import { BrandData } from "@/types/brand";

export const useSelectionState = (
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const handleIndustryToggle = (industry: string, brands: BrandData[]) => {
    if (selectedIndustry === industry) {
      // If clicking the same industry, deselect it and clear brands
      setSelectedIndustry("");
      setSelectedBrands([]);
    } else {
      // Select new industry and update brands
      setSelectedIndustry(industry);
      
      // Get all brands for the selected industry
      const industryBrands = brands
        .filter(item => item.industry === industry)
        .map(item => item.Brand)
        .filter((brand): brand is string => brand !== null);
      
      // Update selected brands with unique values
      setSelectedBrands([...new Set(industryBrands)]);
    }
  };

  return {
    selectedIndustry,
    setSelectedIndustry,
    handleIndustryToggle
  };
};