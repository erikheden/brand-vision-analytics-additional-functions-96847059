
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";

export const useChartData = (selectedCountry: string, selectedBrands: string[]) => {
  return useQuery({
    queryKey: ["scores", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) return [];
      
      console.log("Fetching chart data for country:", selectedCountry, "and brands:", selectedBrands);
      
      try {
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .eq("Country", selectedCountry)
          .in("Brand", selectedBrands)
          .order('Year', { ascending: true }); // Ensure data is ordered by year
        
        if (error) {
          console.error("Error fetching scores:", error);
          throw error;
        }
        
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
