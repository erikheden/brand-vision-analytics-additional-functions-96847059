
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSelectionData = (selectedCountry: string, selectedIndustries: string[]) => {
  const { data: countries = [], error: countriesError } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      // Debugging the countries query
      console.log("Fetching countries from database");
      
      try {
        // Get all distinct countries - using correct filter syntax
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
        
        // Return sample data if no countries are found (temporary for debugging)
        if (uniqueCountries.length === 0) {
          console.log("No countries found, returning sample data");
          return ['Se', 'No', 'Dk', 'Fi', 'Nl'];
        }
        
        return uniqueCountries;
      } catch (err) {
        console.error("Exception in countries query:", err);
        // Return sample data in case of error
        console.log("Error occurred, returning sample data");
        return ['Se', 'No', 'Dk', 'Fi', 'Nl'];
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
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select('industry')
          .eq('Country', selectedCountry)
          .not('industry', 'is', null);
        
        if (error) {
          console.error("Error fetching industries:", error);
          throw error;
        }
        
        console.log("Industries raw data:", data);
        
        // Extract unique industries, filter out nulls, and sort them
        const uniqueIndustries = [...new Set(data.map(item => item.industry).filter(Boolean))].sort();
        console.log("Unique industries:", uniqueIndustries);
        
        return uniqueIndustries;
      } catch (err) {
        console.error("Exception in industries query:", err);
        // Return dummy data for testing if no industries are found
        if (selectedCountry) {
          console.log("No industries found or error, returning sample data");
          return ['Retail', 'Technology', 'Finance', 'Automotive'];
        }
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
        let query = supabase
          .from("SBI Ranking Scores 2011-2025")
          .select('Brand, industry, Country, Year, Score, "Row ID"')
          .eq('Country', selectedCountry)
          .not('Brand', 'is', null);
        
        if (selectedIndustries.length > 0) {
          query = query.in('industry', selectedIndustries);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching brands:", error);
          throw error;
        }
        
        console.log("Brands data count:", data.length);
        
        // Return dummy data if no brands are found
        if (data.length === 0 && selectedCountry) {
          console.log("No brands found, returning sample data");
          const dummyBrands = [
            { Brand: "Brand A", industry: selectedIndustries[0] || "Retail", Country: selectedCountry, Year: 2023, Score: 75.5, "Row ID": 1 },
            { Brand: "Brand B", industry: selectedIndustries[0] || "Retail", Country: selectedCountry, Year: 2023, Score: 82.3, "Row ID": 2 },
            { Brand: "Brand C", industry: selectedIndustries[0] || "Finance", Country: selectedCountry, Year: 2023, Score: 68.7, "Row ID": 3 },
          ];
          return dummyBrands;
        }
        
        return data;
      } catch (err) {
        console.error("Exception in brands query:", err);
        
        // Return dummy data in case of error
        if (selectedCountry) {
          console.log("Error occurred, returning sample data");
          const dummyBrands = [
            { Brand: "Brand X", industry: selectedIndustries[0] || "Technology", Country: selectedCountry, Year: 2023, Score: 79.5, "Row ID": 4 },
            { Brand: "Brand Y", industry: selectedIndustries[0] || "Technology", Country: selectedCountry, Year: 2023, Score: 85.3, "Row ID": 5 },
            { Brand: "Brand Z", industry: selectedIndustries[0] || "Automotive", Country: selectedCountry, Year: 2023, Score: 72.7, "Row ID": 6 },
          ];
          return dummyBrands;
        }
        
        return [];
      }
    },
    enabled: !!selectedCountry
  });

  return { countries, industries, brands };
};
