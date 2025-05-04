
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { InfluenceData, InfluencesResponse } from "./types";
import { sampleInfluencesData } from "./sampleData";

export function useSingleCountryInfluences(country: string) {
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sustainabilityInfluences', country],
    queryFn: async () => {
      if (!country) {
        console.log("No country provided to useSingleCountryInfluences");
        return [];
      }
      
      // Convert country code to uppercase for consistency
      const countryCode = country.toUpperCase();
      console.log(`Fetching sustainability influences for country: ${countryCode}`);
      
      try {
        const { data, error } = await supabase
          .from('SBI_influences')
          .select('*')
          .eq('country', countryCode)
          .order('year', { ascending: true });
        
        if (error) {
          console.error('Error fetching sustainability influences data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load sustainability influences data',
            variant: 'destructive',
          });
          throw error;
        }
        
        console.log(`Raw data from database for ${countryCode}:`, data);
        
        // Map the database fields to our interface
        const mappedData = data.map(item => ({
          year: item.year,
          percentage: item.percentage,
          country: item.country,
          english_label_short: item.medium // Map 'medium' from DB to 'english_label_short' for component compatibility
        })) as InfluenceData[];
        
        console.log(`Mapped ${mappedData.length} records for country ${countryCode}`);
        
        // Log the years from the data to help debug
        if (mappedData.length > 0) {
          const years = [...new Set(mappedData.map(item => item.year))].sort((a, b) => a - b);
          console.log(`Years available in data for ${countryCode}:`, years);
          
          // Count records per year for debugging
          years.forEach(year => {
            const yearData = mappedData.filter(item => item.year === year);
            console.log(`${countryCode} - Year ${year}: ${yearData.length} records`);
          });
        }
        
        // If no data is returned from the database, use sample data
        if (mappedData.length === 0) {
          console.log(`No data found for ${countryCode} in database, using sample data`);
          return sampleInfluencesData[countryCode] || [];
        }
        
        return mappedData;
      } catch (err) {
        console.error('Exception in useSingleCountryInfluences:', err);
        console.log(`Falling back to sample data for ${countryCode}`);
        return sampleInfluencesData[countryCode] || [];
      }
    },
    enabled: !!country,
  });
  
  // Extract unique years
  const years = data && data.length > 0 
    ? [...new Set(data.map(item => item.year))].sort((a, b) => a - b)
    : [];
  
  // Log years for debugging
  if (years.length > 0) {
    console.log(`Years extracted for charts for ${country}:`, years);
  } else {
    console.log(`No years extracted for ${country}`);
  }
  
  // Extract unique influence factors (which are stored in the 'medium' field in the database)
  const influences = data && data.length > 0
    ? [...new Set(data.map(item => item.english_label_short))].sort()
    : [];
  
  // Log influences for debugging
  if (influences.length > 0) {
    console.log(`Influences extracted for ${country}:`, influences);
  } else {
    console.log(`No influences extracted for ${country}`);
  }
  
  return {
    data: data || [],
    years,
    influences,
    isLoading,
    error
  };
}
