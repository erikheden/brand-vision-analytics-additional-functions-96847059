import { useState } from "react";

export const useSelectionState = (
  setSelectedBrands: (brands: string[]) => void
) => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const handleIndustryToggle = (industry: string, brands: any[]) => {
    setSelectedIndustries(prev => {
      const isSelected = prev.includes(industry);
      const newIndustries = isSelected
        ? prev.filter(i => i !== industry)
        : [...prev, industry];
      
      // Get all brands for the selected industry
      const industryBrands = brands
        .filter(item => item.industry === industry)
        .map(item => item.Brand);
      
      // Update selected brands based on industry selection
      if (isSelected) {
        // Remove brands from this industry
        setSelectedBrands(current => 
          current.filter(brand => !industryBrands.includes(brand))
        );
      } else {
        // Add all brands from this industry
        setSelectedBrands(current => {
          const newBrands = new Set([...current, ...industryBrands]);
          return Array.from(newBrands);
        });
      }
      
      return newIndustries;
    });
  };

  return {
    selectedIndustries,
    setSelectedIndustries,
    handleIndustryToggle
  };
};