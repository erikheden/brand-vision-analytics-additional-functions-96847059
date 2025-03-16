
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getFullCountryName } from "@/components/CountrySelect";

export const useIndustriesQuery = (selectedCountry: string | string[]) => {
  return useQuery({
    queryKey: ["industries", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      
      console.log("Fetching industries for country:", selectedCountry);
      
      try {
        // Handle array of countries
        const countriesToQuery = Array.isArray(selectedCountry) ? selectedCountry : [selectedCountry];
        let combinedData: any[] = [];
        
        // Query for each country
        for (const country of countriesToQuery) {
          if (!country) continue;
          
          // Get the full country name if we have a country code
          const fullCountryName = getFullCountryName(country);
          
          console.log(`Trying both country formats for industries: code=${country}, fullName=${fullCountryName}`);
          
          // Try with country code first
          let { data: codeData, error: codeError } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select('industry')
            .eq('Country', country)
            .not('industry', 'is', null);
          
          if (codeError) {
            console.error(`Error fetching industries with country code for ${country}:`, codeError);
          }
          
          // Try with full name
          let { data: nameData, error: nameError } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select('industry')
            .eq('Country', fullCountryName)
            .not('industry', 'is', null);
          
          if (nameError) {
            console.error(`Error fetching industries with full name for ${fullCountryName}:`, nameError);
          }
          
          // Add results to combined data
          combinedData = [...combinedData, ...(codeData || []), ...(nameData || [])];
        }
        
        console.log("Industries raw data:", combinedData);
        
        // Extract unique industries, filter out nulls, and sort them
        const uniqueIndustries = [...new Set(combinedData.map(item => item.industry).filter(Boolean))].sort();
        console.log("Unique industries:", uniqueIndustries);
        
        return uniqueIndustries;
      } catch (err) {
        console.error("Exception in industries query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry
  });
};
