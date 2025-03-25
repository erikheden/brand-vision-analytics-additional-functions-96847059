
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { toast } from "sonner";

export const useChartData = (selectedCountry: string, selectedBrands: string[]) => {
  return useQuery({
    queryKey: ["chart-data", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) {
        return [];
      }

      try {
        // Fetch data for the selected brands in the selected country
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .eq("Country", selectedCountry)
          .in("Brand", selectedBrands);

        if (error) {
          throw error;
        }

        // Additionally fetch average scores for the selected country
        const { data: avgData, error: avgError } = await supabase
          .from("SBI Average Scores")
          .select("*")
          .eq("country", selectedCountry);

        if (avgError) {
          console.error("Error fetching average scores:", avgError);
        }

        // Create a Map of average scores by year
        const averageScores = new Map<string, Map<number, number>>();
        if (avgData && avgData.length > 0) {
          const countryAverages = new Map<number, number>();
          avgData.forEach(item => {
            if (item.year && item.score) {
              countryAverages.set(item.year, item.score);
            }
          });
          averageScores.set(selectedCountry, countryAverages);
        }

        // Attach average scores to the result array
        const result = [...(data || [])] as BrandData[] & { averageScores?: Map<string, Map<number, number>> };
        Object.defineProperty(result, 'averageScores', {
          value: averageScores,
          enumerable: false
        });

        return result;
      } catch (error) {
        console.error("Error fetching chart data:", error);
        toast.error("Failed to fetch chart data");
        return [];
      }
    },
    enabled: !!selectedCountry && selectedBrands.length > 0,
  });
};
