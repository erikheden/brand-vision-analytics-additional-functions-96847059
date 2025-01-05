import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import CountrySelect from "./CountrySelect";
import BrandSelection from "./BrandSelection";
import IndustryTags from "./IndustryTags";
import { useState } from "react";

interface SelectionPanelProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

const SelectionPanel = ({
  selectedCountry,
  setSelectedCountry,
  selectedBrands,
  setSelectedBrands,
}: SelectionPanelProps) => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select('Country')
        .not('Country', 'is', null);
      
      if (error) throw error;
      
      const uniqueCountries = [...new Set(data.map(item => item.Country))].sort();
      return uniqueCountries;
    }
  });

  const { data: industries = [] } = useQuery({
    queryKey: ["industries", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select('industry')
        .eq('Country', selectedCountry)
        .not('industry', 'is', null);
      
      if (error) throw error;
      
      const uniqueIndustries = [...new Set(data.map(item => item.industry))].sort();
      return uniqueIndustries;
    },
    enabled: !!selectedCountry
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands", selectedCountry, selectedIndustries],
    queryFn: async () => {
      if (!selectedCountry) return [];
      let query = supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select('Brand, industry')
        .eq('Country', selectedCountry)
        .not('Brand', 'is', null);
      
      if (selectedIndustries.length > 0) {
        query = query.in('industry', selectedIndustries);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      const uniqueBrands = [...new Set(data.map(item => item.Brand))].sort();
      return data;
    },
    enabled: !!selectedCountry
  });

  const handleClearBrands = () => {
    setSelectedBrands([]);
  };

  const handleBrandToggle = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleIndustryToggle = (industry: string) => {
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
        const newBrands = new Set([...selectedBrands, ...industryBrands]);
        setSelectedBrands(Array.from(newBrands));
      }
      
      return newIndustries;
    });
  };

  // Get unique brand names from the brands data
  const uniqueBrandNames = [...new Set(brands.map(item => item.Brand))].sort();

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <CountrySelect
          selectedCountry={selectedCountry}
          countries={countries}
          onCountryChange={(country) => {
            setSelectedCountry(country);
            setSelectedBrands([]);
            setSelectedIndustries([]);
          }}
        />

        {selectedCountry && (
          <>
            <IndustryTags
              industries={industries}
              selectedIndustries={selectedIndustries}
              onIndustryToggle={handleIndustryToggle}
            />
            <BrandSelection
              brands={uniqueBrandNames}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              onClearBrands={handleClearBrands}
            />
          </>
        )}
      </div>
    </Card>
  );
};

export default SelectionPanel;