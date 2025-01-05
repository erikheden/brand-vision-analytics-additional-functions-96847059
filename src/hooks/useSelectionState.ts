import { useState } from "react";
import { BrandData } from "@/integrations/supabase/types";

export const useSelectionState = (
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const handleIndustryToggle = (industry: string, brands: BrandData[]) => {
    // If clicking the same industry, deselect it
    if (selectedIndustry === industry) {
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
      
      // Update selected brands
      setSelectedBrands([...new Set(industryBrands)]);
    }
  };

  return {
    selectedIndustry,
    setSelectedIndustry,
    handleIndustryToggle
  };
};