
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSelectionData = (selectedCountry: string, selectedIndustries: string[]) => {
  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("SBI Ranking Scores 2011-2025")
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
        .from("SBI Ranking Scores 2011-2025")
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
        .from("SBI Ranking Scores 2011-2025")
        .select('Brand, industry, Country, Year, Score, "Row ID"')
        .eq('Country', selectedCountry)
        .not('Brand', 'is', null);
      
      if (selectedIndustries.length > 0) {
        query = query.in('industry', selectedIndustries);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data;
    },
    enabled: !!selectedCountry
  });

  return { countries, industries, brands };
};
