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

  // Calculate market averages from all brands in the country for each year
  const marketAverages = useQuery({
    queryKey: ["calculatedMarketAverages", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      console.log('Calculating market averages for country:', selectedCountry);
      
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select("Year, Score")
        .eq("Country", selectedCountry)
        .not("Score", "is", null);
      
      if (error) {
        console.error('Error fetching scores for average calculation:', error);
        throw error;
      }

      // Group scores by year and calculate average
      const averagesByYear = data.reduce((acc: { [key: number]: number[] }, curr) => {
        if (curr.Year && curr.Score) {
          if (!acc[curr.Year]) {
            acc[curr.Year] = [];
          }
          acc[curr.Year].push(curr.Score);
        }
        return acc;
      }, {});

      // Calculate average for each year
      const marketAverages: MarketAverage[] = Object.entries(averagesByYear).map(([year, scores]) => ({
        year: parseInt(year),
        score: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }));

      console.log('Calculated market averages:', marketAverages);
      return marketAverages;
    },
    enabled: !!selectedCountry
  });

  return {
    data: brandScores.data || [],
    marketAverages: marketAverages.data || []
  };
};