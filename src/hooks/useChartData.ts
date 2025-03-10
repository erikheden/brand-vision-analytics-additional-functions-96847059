
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { countryMapping, getFullCountryName } from "@/components/CountrySelect";

export const useChartData = (selectedCountry: string, selectedBrands: string[]) => {
  return useQuery({
    queryKey: ["scores", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) return [];
      
      console.log("Fetching chart data for country:", selectedCountry, "and brands:", selectedBrands);
      
      try {
        // Get the full country name if we have a country code
        const fullCountryName = getFullCountryName(selectedCountry);
        
        // First try with the country code
        let { data: dataWithCode, error: errorWithCode } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .eq("Country", selectedCountry)
          .in("Brand", selectedBrands)
          .order('Year', { ascending: true });
        
        // If no data or error, try with the full country name
        if ((errorWithCode || dataWithCode.length === 0) && selectedCountry !== fullCountryName) {
          console.log("No data found with country code, trying with full name:", fullCountryName);
          const { data: dataWithFullName, error: errorWithFullName } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select("*")
            .eq("Country", fullCountryName)
            .in("Brand", selectedBrands)
            .order('Year', { ascending: true });
          
          if (errorWithFullName) {
            console.error("Error fetching scores with full country name:", errorWithFullName);
            throw errorWithFullName;
          }
          
          dataWithCode = [...(dataWithCode || []), ...(dataWithFullName || [])];
        }
        
        const data = dataWithCode;
        console.log("All fetched chart data:", data);
        
        // If no data is found, return an empty array
        if (data.length === 0) {
          console.warn("No chart data found for the selected brands and country.");
          return [];
        }
        
        // Check if we have 2025 data
        const has2025Data = data.some(item => item.Year === 2025);
        console.log("Has 2025 data:", has2025Data);
        
        // If we don't have 2025 data, create projected data for 2025
        if (!has2025Data) {
          console.log("Generating projected 2025 data");
          // For each brand, find the latest year data and use it to project 2025
          const brandsLatestData = selectedBrands.map(brand => {
            const brandData = data.filter(item => item.Brand === brand);
            // Get the most recent year with valid data for this brand
            const latestData = brandData
              .filter(item => item.Score !== null && item.Score !== 0)
              .sort((a, b) => b.Year - a.Year)[0];
            
            if (latestData) {
              // Create a projected entry for 2025
              return {
                ...latestData,
                "Row ID": -1, // Use a dummy row ID
                Year: 2025,
                Score: latestData.Score, // Using same score as latest year as projection
                Projected: true // Add flag to indicate this is projected data
              };
            }
            return null;
          }).filter(Boolean);
          
          console.log("Projected 2025 data:", brandsLatestData);
          
          // Add the projected data to our result
          return [...data, ...brandsLatestData] as BrandData[];
        }
        
        return data as BrandData[];
      } catch (err) {
        console.error("Exception in chart data query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry && selectedBrands.length > 0
  });
};
