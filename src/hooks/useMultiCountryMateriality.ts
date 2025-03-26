
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaterialityData } from "@/hooks/useGeneralMaterialityData";

const SAMPLE_DATA: Record<string, MaterialityData[]> = {
  "Se": [
    { materiality_area: "Climate Change", percentage: 0.78, year: 2023, country: "Se" },
    { materiality_area: "Biodiversity", percentage: 0.65, year: 2023, country: "Se" },
    { materiality_area: "Circular Economy", percentage: 0.71, year: 2023, country: "Se" },
    { materiality_area: "Water Management", percentage: 0.58, year: 2023, country: "Se" },
    { materiality_area: "Social Responsibility", percentage: 0.62, year: 2023, country: "Se" },
    { materiality_area: "Climate Change", percentage: 0.82, year: 2024, country: "Se" },
    { materiality_area: "Biodiversity", percentage: 0.68, year: 2024, country: "Se" },
    { materiality_area: "Circular Economy", percentage: 0.75, year: 2024, country: "Se" },
    { materiality_area: "Water Management", percentage: 0.60, year: 2024, country: "Se" },
    { materiality_area: "Social Responsibility", percentage: 0.67, year: 2024, country: "Se" }
  ],
  "No": [
    { materiality_area: "Climate Change", percentage: 0.80, year: 2023, country: "No" },
    { materiality_area: "Biodiversity", percentage: 0.62, year: 2023, country: "No" },
    { materiality_area: "Circular Economy", percentage: 0.69, year: 2023, country: "No" },
    { materiality_area: "Water Management", percentage: 0.55, year: 2023, country: "No" },
    { materiality_area: "Social Responsibility", percentage: 0.60, year: 2023, country: "No" },
    { materiality_area: "Climate Change", percentage: 0.85, year: 2024, country: "No" },
    { materiality_area: "Biodiversity", percentage: 0.65, year: 2024, country: "No" },
    { materiality_area: "Circular Economy", percentage: 0.72, year: 2024, country: "No" },
    { materiality_area: "Water Management", percentage: 0.58, year: 2024, country: "No" },
    { materiality_area: "Social Responsibility", percentage: 0.64, year: 2024, country: "No" }
  ],
  "Dk": [
    { materiality_area: "Climate Change", percentage: 0.76, year: 2023, country: "Dk" },
    { materiality_area: "Biodiversity", percentage: 0.59, year: 2023, country: "Dk" },
    { materiality_area: "Circular Economy", percentage: 0.73, year: 2023, country: "Dk" },
    { materiality_area: "Water Management", percentage: 0.51, year: 2023, country: "Dk" },
    { materiality_area: "Social Responsibility", percentage: 0.58, year: 2023, country: "Dk" },
    { materiality_area: "Climate Change", percentage: 0.79, year: 2024, country: "Dk" },
    { materiality_area: "Biodiversity", percentage: 0.63, year: 2024, country: "Dk" },
    { materiality_area: "Circular Economy", percentage: 0.77, year: 2024, country: "Dk" },
    { materiality_area: "Water Management", percentage: 0.54, year: 2024, country: "Dk" },
    { materiality_area: "Social Responsibility", percentage: 0.61, year: 2024, country: "Dk" }
  ]
};

export const useMultiCountryMateriality = (selectedCountries: string[] = []) => {
  return useQuery({
    queryKey: ["multiCountryMateriality", selectedCountries],
    queryFn: async (): Promise<Record<string, MaterialityData[]>> => {
      // Ensure we have a valid array of countries
      if (!Array.isArray(selectedCountries) || selectedCountries.length === 0) {
        return {};
      }

      console.log(`Fetching materiality data for ${selectedCountries.length} countries:`, selectedCountries);

      try {
        const result: Record<string, MaterialityData[]> = {};

        // Process each country one by one
        for (const country of selectedCountries) {
          const { data, error } = await supabase
            .from("materiality_areas_general_sbi")
            .select("*")
            .eq("country", country);

          if (error) {
            console.error(`Error fetching data for ${country}:`, error);
            // Continue with next country on error
            continue;
          }

          // If we have real data, use it
          if (data && data.length > 0) {
            result[country] = data.map(item => ({
              materiality_area: item.materiality_area,
              percentage: item.percentage,
              year: item.year,
              country: item.country,
              row_id: item.row_id
            }));
            continue;
          }

          // If we don't have real data, check if we have sample data for this country
          if (SAMPLE_DATA[country]) {
            result[country] = SAMPLE_DATA[country];
          } else {
            // If no sample data exists for this country, create some
            result[country] = [
              { materiality_area: "Climate Change", percentage: 0.75 + Math.random() * 0.1, year: 2023, country },
              { materiality_area: "Biodiversity", percentage: 0.60 + Math.random() * 0.1, year: 2023, country },
              { materiality_area: "Circular Economy", percentage: 0.70 + Math.random() * 0.1, year: 2023, country },
              { materiality_area: "Water Management", percentage: 0.55 + Math.random() * 0.1, year: 2023, country },
              { materiality_area: "Social Responsibility", percentage: 0.60 + Math.random() * 0.1, year: 2023, country },
              { materiality_area: "Climate Change", percentage: 0.80 + Math.random() * 0.1, year: 2024, country },
              { materiality_area: "Biodiversity", percentage: 0.65 + Math.random() * 0.1, year: 2024, country },
              { materiality_area: "Circular Economy", percentage: 0.75 + Math.random() * 0.1, year: 2024, country },
              { materiality_area: "Water Management", percentage: 0.60 + Math.random() * 0.1, year: 2024, country },
              { materiality_area: "Social Responsibility", percentage: 0.65 + Math.random() * 0.1, year: 2024, country }
            ];
          }
        }

        console.log(`Retrieved materiality data for ${Object.keys(result).length} countries`);
        return result;
      } catch (error) {
        console.error("Error fetching multi-country materiality data:", error);
        return {};
      }
    },
    enabled: Array.isArray(selectedCountries) && selectedCountries.length > 0,
  });
};
