
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      console.log("Fetching countries from database");
      
      try {
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select('Country')
          .not('Country', 'is', null);
        
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
        return [];
      }
    }
  });
};
