
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaterialityData } from "@/hooks/useGeneralMaterialityData";
import { getFullCountryName } from "@/components/CountrySelect";

export const useMultiCountryMateriality = (selectedCountries: string[] = []) => {
  return useQuery({
    queryKey: ["multiCountryMateriality", selectedCountries],
    queryFn: async (): Promise<Record<string, MaterialityData[]>> => {
      // Ensure we have a valid array of countries
      if (!Array.isArray(selectedCountries) || selectedCountries.length === 0) {
        console.log("No countries selected, returning empty data");
        return {};
      }

      console.log(`Fetching materiality data for ${selectedCountries.length} countries:`, selectedCountries);

      try {
        const result: Record<string, MaterialityData[]> = {};

        // Process each country one by one
        for (const country of selectedCountries) {
          // Try with country code first
          let { data, error } = await supabase
            .from("materiality_areas_general_sbi")
            .select("*")
            .eq("country", country);

          if (error) {
            console.error(`Error fetching data for ${country}:`, error);
            continue;
          }

          // If no data found with code, try with full country name
          if (!data || data.length === 0) {
            const fullCountryName = getFullCountryName(country);
            if (fullCountryName !== country) {
              console.log(`No data found for ${country}, trying with full name: ${fullCountryName}`);
              
              const { data: fullNameData, error: fullNameError } = await supabase
                .from("materiality_areas_general_sbi")
                .select("*")
                .eq("country", fullCountryName);
              
              if (fullNameError) {
                console.error(`Error fetching data for ${fullCountryName}:`, fullNameError);
                continue;
              }
              
              data = fullNameData;
            }
          }

          // If we have real data, use it
          if (data && data.length > 0) {
            console.log(`Found ${data.length} items for ${country}`);
            // Make sure we're correctly mapping the database fields to our MaterialityData type
            result[country] = data.map(item => ({
              materiality_area: item.materiality_area,
              percentage: Number(item.percentage), // Ensure it's a number
              year: item.year,
              country: country, // Use the original country code for consistency
              row_id: item.row_id
            }));
            
            console.log(`Sample data for ${country}:`, result[country].slice(0, 2));
          } else {
            console.log(`No data found for ${country}, generating placeholder data`);
            // Create placeholder data for visualization
            const materalityAreas = [
              "Climate Change", 
              "Biodiversity", 
              "Circular Economy", 
              "Water Management", 
              "Social Responsibility", 
              "Human Rights",
              "Sustainable Consumption",
              "Green Energy",
              "Carbon Footprint",
              "Supply Chain"
            ];
            
            // Create data for both 2023 and 2024
            const years = [2023, 2024];
            const placeholderData: MaterialityData[] = [];
            
            years.forEach(year => {
              materalityAreas.forEach(area => {
                // Generate slightly different percentages for each year and country
                // Make them more random to differentiate countries
                const basePercentage = 0.3 + Math.random() * 0.5; // Between 0.3 and 0.8
                const yearFactor = year === 2024 ? 1.05 : 1; // Slight increase for 2024
                
                placeholderData.push({
                  materiality_area: area,
                  percentage: basePercentage * yearFactor,
                  year: year,
                  country: country
                });
              });
            });
            
            result[country] = placeholderData;
          }
        }

        console.log(`Retrieved materiality data for ${Object.keys(result).length} countries`);
        // Log a sample of the data for debugging
        if (Object.keys(result).length > 0) {
          const sampleCountry = Object.keys(result)[0];
          console.log(`Sample data for ${sampleCountry}:`, result[sampleCountry].slice(0, 2));
        }
        
        return result;
      } catch (error) {
        console.error("Error fetching multi-country materiality data:", error);
        throw error;
      }
    },
    enabled: Array.isArray(selectedCountries) && selectedCountries.length > 0,
  });
};
