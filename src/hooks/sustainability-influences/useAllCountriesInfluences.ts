
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
        // Ensure country code is uppercase for consistent querying
        const countryCode = country.toUpperCase();
        console.log(`Fetching data for country code: ${countryCode}`);
        
        const { data, error } = await supabase
          .from('SBI_influences')
          .select('*')
          .eq('country', countryCode)
          .order('year', { ascending: true });
        
        if (error) {
          console.error(`Error fetching influences for country ${country}:`, error);
          result[country] = sampleInfluencesData[country] || generateSampleDataForCountry(country);
          return;
        }
        
        console.log(`Got ${data?.length || 0} raw records for ${country}`);
        
        // Map the database fields to our interface
        const mappedData = data.map(item => ({
          year: item.year,
          percentage: item.percentage,
          country: item.country,
          // Keep both fields for backward compatibility - some components use medium, others use english_label_short
          english_label_short: item.medium,
          medium: item.medium
        })) as InfluenceData[];
        
        console.log(`Mapped ${mappedData.length} data points for ${country}`);
        
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
    
    // Log the data we're returning
    console.log(`Returning data for ${Object.keys(result).length} countries:`, Object.keys(result));
    for (const country of Object.keys(result)) {
      console.log(`Country ${country}: ${result[country].length} data points`);
      if (result[country].length > 0) {
        const years = [...new Set(result[country].map(item => item.year))].sort();
        const media = [...new Set(result[country].map(item => item.medium || item.english_label_short))];
        console.log(`  Years: ${years.join(', ')}`);
        console.log(`  Media types: ${media.join(', ')}`);
      }
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
