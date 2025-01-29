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
  // Query for selected brand scores
  const brandScores = useQuery({
    queryKey: ["scores", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) return [];
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select("*")
        .eq("Country", selectedCountry)
        .in("Brand", selectedBrands)
        .order('Year', { ascending: true });
      
      if (error) throw error;
      return data as Score[];
    },
    enabled: !!selectedCountry && selectedBrands.length > 0
  });

  // Calculate market averages from ALL brands in the country for each year
  // This query is now independent of the selected brands/industries
  const marketAverages = useQuery({
    queryKey: ["marketAverages", selectedCountry], // Only depends on country
    queryFn: async () => {
      if (!selectedCountry) return [];
      console.log('Calculating market averages for country:', selectedCountry);
      
      // Query all scores for the country without any brand/industry filtering
      const { data, error } = await supabase
        .from("SBI Average Scores")
        .select('*')
        .eq('country', selectedCountry.toLowerCase()) // Convert to lowercase to match DB
        .order('year', { ascending: true });
      
      if (error) {
        console.error('Error fetching market averages:', error);
        throw error;
      }

      // Map the data to the expected format, using correct column names
      const marketAverages: MarketAverage[] = data.map(row => ({
        year: row['year'],  // Using bracket notation to ensure we get the right property
        score: row['score']
      }));

      console.log('Market averages for country:', marketAverages);
      return marketAverages;
    },
    enabled: !!selectedCountry
  });

  return {
    data: brandScores.data || [],
    marketAverages: marketAverages.data || []
  };
};