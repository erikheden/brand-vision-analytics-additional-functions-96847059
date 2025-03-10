
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSelectionData = (selectedCountry: string, selectedIndustries: string[]) => {
  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      // Debugging the countries query
      console.log("Fetching countries from database");
      
      const { data, error } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select('Country')
        .not('Country', 'eq', null);
      
      if (error) {
        console.error("Error fetching countries:", error);
        throw error;
      }
      
      console.log("Countries raw data:", data);
      
      // Extract unique countries and sort them
      const uniqueCountries = [...new Set(data.map(item => item.Country))].sort();
      console.log("Unique countries:", uniqueCountries);
      
      return uniqueCountries;
    }
  });

  const { data: industries = [] } = useQuery({
    queryKey: ["industries", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      
      console.log("Fetching industries for country:", selectedCountry);
      
      const { data, error } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select('industry')
        .eq('Country', selectedCountry)
        .not('industry', 'eq', null);
      
      if (error) {
        console.error("Error fetching industries:", error);
        throw error;
      }
      
      console.log("Industries raw data:", data);
      
      // Extract unique industries and sort them
      const uniqueIndustries = [...new Set(data.map(item => item.industry))].sort();
      console.log("Unique industries:", uniqueIndustries);
      
      return uniqueIndustries;
    },
    enabled: !!selectedCountry
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands", selectedCountry, selectedIndustries],
    queryFn: async () => {
      if (!selectedCountry) return [];
      
      console.log("Fetching brands for country:", selectedCountry, "and industries:", selectedIndustries);
      
      let query = supabase
        .from("SBI Ranking Scores 2011-2025")
        .select('Brand, industry, Country, Year, Score, "Row ID"')
        .eq('Country', selectedCountry)
        .not('Brand', 'eq', null);
      
      if (selectedIndustries.length > 0) {
        query = query.in('industry', selectedIndustries);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching brands:", error);
        throw error;
      }
      
      console.log("Brands data count:", data.length);
      
      return data;
    },
    enabled: !!selectedCountry
  });

  return { countries, industries, brands };
};
