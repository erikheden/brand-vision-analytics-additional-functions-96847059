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
        .select('Brand')
        .eq('Country', selectedCountry)
        .not('Brand', 'is', null);
      
      if (selectedIndustries.length > 0) {
        query = query.in('industry', selectedIndustries);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      const uniqueBrands = [...new Set(data.map(item => item.Brand))].sort();
      return uniqueBrands;
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
      const newIndustries = prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry];
      
      // Clear selected brands that are no longer visible due to industry filter
      if (newIndustries.length > 0) {
        setSelectedBrands(current => 
          current.filter(brand => 
            brands.includes(brand)
          )
        );
      }
      
      return newIndustries;
    });
  };

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
              brands={brands}
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