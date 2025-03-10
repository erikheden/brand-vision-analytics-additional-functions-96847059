
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";

export const useChartData = (selectedCountry: string, selectedBrands: string[]) => {
  return useQuery({
    queryKey: ["scores", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) return [];
      
      console.log("Fetching chart data for country:", selectedCountry, "and brands:", selectedBrands);
      
      try {
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .eq("Country", selectedCountry)
          .in("Brand", selectedBrands)
          .order('Year', { ascending: true }); // Ensure data is ordered by year
        
        if (error) {
          console.error("Error fetching scores:", error);
          throw error;
        }
        
        console.log("All fetched chart data:", data);
        console.log("Data for 2025:", data?.filter(d => d.Year === 2025));
        
        // If no data is found, return an empty array
        if (data.length === 0) {
          console.warn("No chart data found for the selected brands and country.");
          return [];
        }
        
        return data as BrandData[];
      } catch (err) {
        console.error("Exception in chart data query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry && selectedBrands.length > 0
  });
};
