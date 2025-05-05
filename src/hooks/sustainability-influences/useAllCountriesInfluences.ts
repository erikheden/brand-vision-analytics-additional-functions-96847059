import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InfluenceData } from "./types";
import { sampleInfluencesData, generateSampleDataForCountry } from "./sampleData";

export async function fetchAllInfluencesData(countries: string[]): Promise<Record<string, InfluenceData[]>> {
  if (!countries || countries.length === 0) return {};
  
  try {
    console.log("Fetching influences for countries:", countries);
    
    // Initialize result object with empty arrays for each country
    const result: Record<string, InfluenceData[]> = {};
    
    // Fetch data for each country in parallel
    await Promise.all(countries.map(async (country) => {
      try {
        const { data, error } = await supabase
          .from('SBI_influences')
          .select('*')
          .eq('country', country.toUpperCase())
          .order('year', { ascending: true });
        
        if (error) {
          console.error(`Error fetching influences for country ${country}:`, error);
          result[country] = sampleInfluencesData[country] || generateSampleDataForCountry(country);
          return;
        }
        
        // Map the database fields to our interface
        const mappedData = data.map(item => ({
          year: item.year,
          percentage: item.percentage,
          country: item.country,
          // Keep both fields for backward compatibility - some components use medium, others use english_label_short
          english_label_short: item.medium,
          medium: item.medium
        })) as InfluenceData[];
        
        // If no data returned from database, use sample data
        if (mappedData.length === 0) {
          console.log(`No data found for ${country} in database, using sample data`);
          result[country] = sampleInfluencesData[country] || generateSampleDataForCountry(country);
        } else {
          result[country] = mappedData;
        }
      } catch (err) {
        console.error(`Exception fetching influences for ${country}:`, err);
        result[country] = sampleInfluencesData[country] || generateSampleDataForCountry(country);
      }
    }));
    
    // If we still have no data, use sample data as fallback
    if (Object.keys(result).length === 0) {
      console.log("No data found in database for any country, using sample data");
      return countries.reduce((acc, country) => {
        acc[country] = sampleInfluencesData[country] || generateSampleDataForCountry(country);
        return acc;
      }, {} as Record<string, InfluenceData[]>);
    }
    
    return result;
  } catch (err) {
    console.error('Exception in fetchAllInfluencesData:', err);
    
    // Return sample data as fallback
    return countries.reduce((acc, country) => {
      acc[country] = sampleInfluencesData[country] || generateSampleDataForCountry(country);
      return acc;
    }, {} as Record<string, InfluenceData[]>);
  }
}

export function useAllCountriesInfluences(countries: string[]) {
  return useQuery({
    queryKey: ['all-sustainability-influences', countries],
    queryFn: () => fetchAllInfluencesData(countries || []),
    enabled: countries && countries.length > 0,
  });
}
