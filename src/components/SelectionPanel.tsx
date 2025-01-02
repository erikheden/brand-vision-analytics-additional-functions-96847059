import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import CountrySelect from "./CountrySelect";
import BrandSelection from "./BrandSelection";

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

  const { data: brands = [] } = useQuery({
    queryKey: ["brands", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select('Brand')
        .eq('Country', selectedCountry)
        .not('Brand', 'is', null);
      
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <CountrySelect
          selectedCountry={selectedCountry}
          countries={countries}
          onCountryChange={setSelectedCountry}
        />

        {selectedCountry && (
          <BrandSelection
            brands={brands}
            selectedBrands={selectedBrands}
            onBrandToggle={handleBrandToggle}
            onClearBrands={handleClearBrands}
          />
        )}
      </div>
    </Card>
  );
};

export default SelectionPanel;