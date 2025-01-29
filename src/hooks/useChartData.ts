import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Score {
  year: number;
  score: number;
  country: string;
}

export const useChartData = (selectedCountry: string) => {
  return useQuery({
    queryKey: ["average-scores", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from("SBI Average Scores")
        .select("*")
        .eq("country", selectedCountry)
        .order('year', { ascending: true });
      
      if (error) throw error;
      return data as Score[];
    },
    enabled: !!selectedCountry
  });
};