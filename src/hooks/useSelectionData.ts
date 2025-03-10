
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSelectionData = (selectedCountry: string, selectedIndustries: string[]) => {
  const { data: countries = [], error: countriesError } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      // Debugging the countries query
      console.log("Fetching countries from database");
      
      try {
        // Simplify the query as much as possible - just get all records and filter client-side
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select('Country');
        
        if (error) {
          console.error("Error fetching countries:", error);
          throw error;
        }
        
        console.log("Countries raw data:", data);
        
        // Extract unique countries, filter out nulls, and sort them
        const uniqueCountries = [...new Set(data.map(item => item.Country).filter(Boolean))].sort();
        console.log("Unique countries:", uniqueCountries);
        
        return uniqueCountries;
      } catch (err) {
        console.error("Exception in countries query:", err);
        throw err;
      }
    }
  });

  // Log countries error if present
  if (countriesError) {
    console.error("Countries query error:", countriesError);
  }

  const { data: industries = [] } = useQuery({
    queryKey: ["industries", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      
      console.log("Fetching industries for country:", selectedCountry);
      
      try {
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select('industry')
          .eq('Country', selectedCountry);
        
        if (error) {
          console.error("Error fetching industries:", error);
          throw error;
        }
        
        console.log("Industries raw data:", data);
        
        // Extract unique industries, filter out nulls, and sort them
        const uniqueIndustries = [...new Set(data.map(item => item.industry).filter(Boolean))].sort();
        console.log("Unique industries:", uniqueIndustries);
        
        return uniqueIndustries;
      } catch (err) {
        console.error("Exception in industries query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands", selectedCountry, selectedIndustries],
    queryFn: async () => {
      if (!selectedCountry) return [];
      
      console.log("Fetching brands for country:", selectedCountry, "and industries:", selectedIndustries);
      
      try {
        let query = supabase
          .from("SBI Ranking Scores 2011-2025")
          .select('Brand, industry, Country, Year, Score, "Row ID"')
          .eq('Country', selectedCountry);
        
        if (selectedIndustries.length > 0) {
          query = query.in('industry', selectedIndustries);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching brands:", error);
          throw error;
        }
        
        // Filter out null brands in the client side to ensure we get results
        const filteredData = data.filter(item => item.Brand !== null);
        console.log("Brands data count:", filteredData.length);
        
        return filteredData;
      } catch (err) {
        console.error("Exception in brands query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry
  });

  return { countries, industries, brands };
};
