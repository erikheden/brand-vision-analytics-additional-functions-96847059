
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { normalizeBrandName } from "@/utils/industry/normalizeIndustry";

export const useSelectionData = (selectedCountry: string | string[], selectedIndustries: string[]) => {
  const { data: countries = [], error: countriesError } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      console.log("Fetching countries from database");
      
      try {
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select('Country')
          .not('Country', 'is', null);
        
        if (error) {
          console.error("Error fetching countries:", error);
          throw error;
        }
        
        console.log("Countries raw data:", data);
        
        // Extract unique countries, filter out nulls, and sort them
        const uniqueCountries = [...new Set(data.map(item => item.Country).filter(Boolean))].sort();
        console.log("Unique countries:", uniqueCountries);
        
        return uniqueCountries;
      } catch (err) {
        console.error("Exception in countries query:", err);
        return [];
      }
    }
  });

  // Log countries error if present
  if (countriesError) {
    console.error("Countries query error:", countriesError);
  }

  const { data: industries = [] } = useQuery({
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

  const { data: brands = [] } = useQuery({
    queryKey: ["brands", selectedCountry, selectedIndustries],
    queryFn: async () => {
      if (!selectedCountry) return [];
      
      console.log("Fetching brands for country:", selectedCountry, "and industries:", selectedIndustries);
      
      try {
        // Handle array of countries
        const countriesToQuery = Array.isArray(selectedCountry) ? selectedCountry : [selectedCountry];
        let allBrands: BrandData[] = [];
        
        // Query for each country
        for (const country of countriesToQuery) {
          if (!country) continue;
          
          // Get the full country name if we have a country code
          const fullCountryName = getFullCountryName(country);
          
          console.log(`Querying brands for country: code=${country}, fullName=${fullCountryName}`);
          
          // Try with country code first
          let codeQuery = supabase
            .from("SBI Ranking Scores 2011-2025")
            .select('Brand, industry, Country, Year, Score, "Row ID"')
            .eq('Country', country)
            .not('Brand', 'is', null);
          
          if (selectedIndustries.length > 0) {
            codeQuery = codeQuery.in('industry', selectedIndustries);
          }
          
          let { data: codeData, error: codeError } = await codeQuery;
          
          if (codeError) {
            console.error(`Error fetching brands with country code for ${country}:`, codeError);
          }
          
          // Try with full name
          let fullNameQuery = supabase
            .from("SBI Ranking Scores 2011-2025")
            .select('Brand, industry, Country, Year, Score, "Row ID"')
            .eq('Country', fullCountryName)
            .not('Brand', 'is', null);
          
          if (selectedIndustries.length > 0) {
            fullNameQuery = fullNameQuery.in('industry', selectedIndustries);
          }
          
          let { data: nameData, error: nameError } = await fullNameQuery;
          
          if (nameError) {
            console.error(`Error fetching brands with full name for ${fullCountryName}:`, nameError);
          }
          
          // Add results to combined data
          allBrands = [...allBrands, ...(codeData || []), ...(nameData || [])];
        }
        
        console.log(`Fetched ${allBrands.length} brands for ${countriesToQuery.join(', ')}:`, 
          allBrands.slice(0, 5).map(b => ({ 
            brand: b.Brand, 
            country: b.Country,
            normalized: b.Brand ? normalizeBrandName(b.Brand) : null
          }))
        );
        
        return allBrands as BrandData[];
      } catch (err) {
        console.error("Exception in brands query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry
  });

  return { countries, industries, brands };
};
