
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Score {
  Year: number;
  Brand: string;
  Score: number;
  Country: string;
  industry?: string | null;
  "Row ID"?: number;
}

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
          .in("Brand", selectedBrands);
        
        if (error) {
          console.error("Error fetching scores:", error);
          throw error;
        }
        
        console.log("Chart data count:", data.length);
        console.log("Chart data sample:", data.slice(0, 3));
        
        // Only use sample data as a last resort if no data is found
        if (data.length === 0) {
          console.warn("No real chart data found for the selected brands and country. This is unusual and should be investigated.");
          return [];
        }
        
        return data as Score[];
      } catch (err) {
        console.error("Exception in chart data query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry && selectedBrands.length > 0
  });
};
