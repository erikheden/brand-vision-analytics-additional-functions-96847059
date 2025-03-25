
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BrandData } from "@/types/brand";

// Define the type for multi-country data
export type MultiCountryData = Record<string, BrandData[]> & {
  averageScores?: Map<string, Map<number, number>>;
};

export const useMultiCountryChartData = (
  selectedCountries: string[],
  selectedBrands: string[]
) => {
  return useQuery({
    queryKey: ["multi-country-data", selectedCountries, selectedBrands],
    queryFn: async () => {
      if (!selectedCountries.length || !selectedBrands.length) {
        return {} as MultiCountryData;
      }

      try {
        const result: MultiCountryData = {};
        const averageScores = new Map<string, Map<number, number>>();
        
        // Fetch data for each country
        for (const country of selectedCountries) {
          const { data, error } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select("*")
            .eq("Country", country)
            .in("Brand", selectedBrands);

          if (error) {
            console.error(`Error fetching data for ${country}:`, error);
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
        console.error("Error fetching multi-country data:", error);
        toast.error("Failed to fetch multi-country data");
        return {} as MultiCountryData;
      }
    },
    enabled: selectedCountries.length > 0 && selectedBrands.length > 0,
  });
};
