import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Score {
  Year: number;
  Brand: string;
  Score: number;
}

interface MarketAverage {
  year: number;
  score: number;
}

export const useChartData = (selectedCountry: string, selectedBrands: string[]) => {
  const brandScores = useQuery({
    queryKey: ["scores", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) return [];
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select("*")
        .eq("Country", selectedCountry)
        .in("Brand", selectedBrands);
      
      if (error) throw error;
      return data as Score[];
    },
    enabled: !!selectedCountry && selectedBrands.length > 0
  });

  const marketAverages = useQuery({
    queryKey: ["marketAverages", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from("SBI Average Scores")
        .select("*")
        .eq("country", selectedCountry);
      
      if (error) throw error;
      return data as MarketAverage[];
    },
    enabled: !!selectedCountry
  });

  return {
    data: brandScores.data || [],
    marketAverages: marketAverages.data || []
  };
};