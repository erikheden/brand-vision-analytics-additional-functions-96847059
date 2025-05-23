
import { useState, useMemo, useEffect } from 'react';
import { useVHOData, VHOData } from '@/hooks/useVHOData';
import { useToast } from '@/components/ui/use-toast';

export interface MaterialityFilters {
  selectedCountry: string;
  selectedCategory: string;
  selectedFactors: string[];
}

export function useMaterialityFilters(country: string = "") {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>(country);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["hygiene_factor", "more_of"]);
  
  // Update selectedCountry when country prop changes
  useEffect(() => {
    if (country) {
      setSelectedCountry(country);
    }
  }, [country]);
  
  const { data: vhoData = [], isLoading, error } = useVHOData(selectedCountry);
  
  // Extract unique categories
  const categories = useMemo(() => {
    if (!vhoData.length) return [];
    const uniqueCategories = [...new Set(vhoData.map(item => item.category))].sort();
    console.log("Extracted categories:", uniqueCategories);
    return uniqueCategories;
  }, [vhoData]);
  
  // Filter data based on selections
  const filteredData = useMemo(() => {
    if (!vhoData.length) return [];
    
    let filtered = vhoData;
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedFactors.length > 0) {
      filtered = filtered.filter(item => selectedFactors.includes(item.type_of_factor));
    }
    
    return filtered;
  }, [vhoData, selectedCategory, selectedFactors]);
  
  // Reset category when country changes
  useEffect(() => {
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
    selectedCategory,
    selectedFactors,
    vhoData,
    filteredData,
    isLoading,
    error,
    
    // Derived data
    categories,
    
    // Actions
    setSelectedCategory,
    handleCountryChange,
    toggleFactor
  };
}
