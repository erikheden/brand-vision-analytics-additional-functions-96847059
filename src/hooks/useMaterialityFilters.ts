
import { useState, useMemo, useEffect } from 'react';
import { useVHOData, VHOData } from '@/hooks/useVHOData';
import { useToast } from '@/components/ui/use-toast';

export interface MaterialityFilters {
  selectedCountry: string;
  selectedIndustry: string;
  selectedCategory: string;
  selectedFactors: string[];
}

export function useMaterialityFilters() {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["hygiene_factor"]);
  
  const { data: vhoData = [], isLoading, error } = useVHOData(selectedCountry);
  
  // Extract unique industries
  const industries = useMemo(() => {
    if (!vhoData.length) return [];
    const uniqueIndustries = [...new Set(vhoData.map(item => item.industry))].sort();
    console.log("Extracted industries:", uniqueIndustries);
    return uniqueIndustries;
  }, [vhoData]);
  
  // Extract unique categories for the selected industry
  const categories = useMemo(() => {
    if (!vhoData.length || !selectedIndustry) return [];
    const uniqueCategories = [...new Set(
      vhoData
        .filter(item => item.industry === selectedIndustry)
        .map(item => item.category)
    )].sort();
    console.log("Extracted categories for", selectedIndustry, ":", uniqueCategories);
    return uniqueCategories;
  }, [vhoData, selectedIndustry]);
  
  // Check if we have distinct categories (different from industry)
  const hasDistinctCategories = useMemo(() => {
    if (!vhoData.length || !selectedIndustry) return false;
    // Get unique categories for the selected industry
    const uniqueCategories = [...new Set(
      vhoData
        .filter(item => item.industry === selectedIndustry)
        .map(item => item.category)
    )];
    
    // If we have more than one category or the category is different from the industry name
    return uniqueCategories.length > 1 || 
           (uniqueCategories.length === 1 && uniqueCategories[0] !== selectedIndustry);
  }, [vhoData, selectedIndustry]);
  
  // Filter data based on selections
  const filteredData = useMemo(() => {
    if (!vhoData.length || !selectedIndustry) return [];
    
    let filtered = vhoData.filter(item => item.industry === selectedIndustry);
    
    if (hasDistinctCategories && selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedFactors.length > 0) {
      filtered = filtered.filter(item => selectedFactors.includes(item.type_of_factor));
    }
    
    return filtered;
  }, [vhoData, selectedIndustry, selectedCategory, selectedFactors, hasDistinctCategories]);
  
  // Reset category when industry changes
  useEffect(() => {
    setSelectedCategory("");
  }, [selectedIndustry]);
  
  // Reset industry when country changes
  useEffect(() => {
    setSelectedIndustry("");
    setSelectedCategory("");
  }, [selectedCountry]);
  
  // Handle country selection with toast notification
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    toast({
      title: "Country Selected",
      description: `Showing materiality areas for ${country}`,
      duration: 3000,
    });
  };
  
  // Toggle a factor selection
  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => {
      if (prev.includes(factor)) {
        // Don't remove if it's the only factor left
        if (prev.length === 1) return prev;
        return prev.filter(f => f !== factor);
      } else {
        return [...prev, factor];
      }
    });
  };

  return {
    // State
    selectedCountry,
    selectedIndustry, 
    selectedCategory,
    selectedFactors,
    vhoData,
    filteredData,
    isLoading,
    error,
    
    // Derived data
    industries,
    categories,
    hasDistinctCategories,
    
    // Actions
    setSelectedIndustry,
    setSelectedCategory,
    handleCountryChange,
    toggleFactor
  };
}
