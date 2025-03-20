
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getFullCountryName } from "@/components/CountrySelect";
import { normalizeIndustryName } from "@/utils/industry/industryNormalization";

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
        
        // Map to normalize industry names and then group by normalized name
        const industryMap = new Map<string, string>();
        
        combinedData.forEach(item => {
          if (!item.industry) return;
          
          const normalizedName = normalizeIndustryName(item.industry);
          
          // Only add if we haven't seen this normalized name yet,
          // or if the current one starts with a capital letter and the stored one doesn't
          if (!industryMap.has(normalizedName) || 
              (item.industry.charAt(0) === item.industry.charAt(0).toUpperCase() && 
               industryMap.get(normalizedName)?.charAt(0) !== industryMap.get(normalizedName)?.charAt(0)?.toUpperCase())) {
            industryMap.set(normalizedName, item.industry);
          }
        });
        
        // Extract unique industries with preferred capitalization
        const uniqueIndustries = Array.from(industryMap.values()).sort();
        
        console.log("Unique industries after normalization:", uniqueIndustries);
        
        return uniqueIndustries;
      } catch (err) {
        console.error("Exception in industries query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry
  });
};
