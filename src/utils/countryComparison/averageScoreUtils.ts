
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches average scores from the "SBI Average Scores" table
 * Returns a map of country -> year -> average score
 */
export const fetchAverageScores = async (
  countries: string[]
): Promise<Map<string, Map<number, number>>> => {
  console.log("Fetching average scores from 'SBI Average Scores' table for countries:", countries);
  
  try {
    // Query the SBI Average Scores table for selected countries
    const { data, error } = await supabase
      .from("SBI Average Scores")
      .select("*")
      .in("country", countries);
      
    if (error) {
      console.error("Error fetching average scores:", error);
      return new Map();
    }
    
    if (!data || data.length === 0) {
      console.warn("No average scores found for selected countries");
      return new Map();
    }
    
    console.log(`Found ${data.length} average score entries`);
    
    // Organize data by country and year
    const countryYearScores = new Map<string, Map<number, number>>();
    
    data.forEach(entry => {
      if (!entry.country || entry.year === null || entry.score === null) {
        return;
      }
      
      const country = entry.country;
      const year = Number(entry.year);
      const score = Number(entry.score);
      
      if (!countryYearScores.has(country)) {
        countryYearScores.set(country, new Map());
      }
      
      countryYearScores.get(country)!.set(year, score);
      console.log(`Average score for ${country}, ${year}: ${score}`);
    });
    
    return countryYearScores;
  } catch (err) {
    console.error("Exception fetching average scores:", err);
    return new Map();
  }
};

/**
 * Gets the average score for a specific country and year
 * Returns null if no data is available
 */
export const getAverageScore = (
  averageScores: Map<string, Map<number, number>>,
  country: string,
  year: number
): number | null => {
  if (!averageScores.has(country)) {
    return null;
  }
  
  const yearScores = averageScores.get(country)!;
  if (!yearScores.has(year)) {
    return null;
  }
  
  return yearScores.get(year)!;
};
