
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MultiCountryData } from "./useMultiCountryChartData";

/**
 * Hook to fetch all market data for the selected countries (not just selected brands)
 * This is used for standardization calculations
 */
export const useMarketData = (selectedCountries: string[]) => {
  return useQuery({
    queryKey: ["market-data", selectedCountries],
    queryFn: async () => {
      if (!selectedCountries.length) {
        return null;
      }

      try {
        const result: MultiCountryData = {};
        const averageScores = new Map<string, Map<number, number>>();
        
        // Fetch data for each country
        for (const country of selectedCountries) {
          // Fetch all brands for this country
          const { data, error } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select("*")
            .eq("Country", country);

          if (error) {
            console.error(`Error fetching market data for ${country}:`, error);
            continue;
          }

          result[country] = data || [];
          
          // Fetch average scores for this country
          const { data: avgData, error: avgError } = await supabase
            .from("SBI Average Scores")
            .select("*")
            .eq("country", country);
            
          if (avgError) {
            console.error(`Error fetching average scores for ${country}:`, avgError);
          } else if (avgData?.length) {
            const countryAverages = new Map<number, number>();
            avgData.forEach(item => {
              if (item.year && item.score) {
                countryAverages.set(item.year, item.score);
              }
            });
            averageScores.set(country, countryAverages);
          }
        }
        
        // Attach average scores to the result
        Object.defineProperty(result, 'averageScores', {
          value: averageScores,
          enumerable: false
        });
        
        return result;
      } catch (error) {
        console.error("Error fetching market data:", error);
        return null;
      }
    },
    enabled: selectedCountries.length > 0,
  });
};
