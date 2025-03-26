
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MaterialityData {
  materiality_area: string;
  percentage: number;
  year: number;
  country: string;
  row_id?: number;
}

// Sample data to use if no real data is available
const SAMPLE_DATA: MaterialityData[] = [
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
];

export const useGeneralMaterialityData = (country: string) => {
  return useQuery({
    queryKey: ["generalMaterialityData", country],
    queryFn: async (): Promise<MaterialityData[]> => {
      if (!country) {
        return [];
      }

      console.log(`Fetching materiality data for country: ${country}`);

      try {
        const { data, error } = await supabase
          .from("materiality_areas_general_sbi")
          .select("*")
          .eq("country", country);

        if (error) {
          console.error("Error fetching materiality data:", error);
          throw new Error(`Failed to fetch materiality data: ${error.message}`);
        }

        console.log(`Retrieved ${data?.length || 0} materiality data records for ${country}`);

        // If we got data, return it
        if (data && data.length > 0) {
          return data.map(item => ({
            materiality_area: item.materiality_area,
            percentage: item.percentage,
            year: item.year,
            country: item.country,
            row_id: item.row_id
          }));
        }
        
        // If we didn't get data, try with full country name
        const fullCountryName = getFullCountryName(country);
        if (fullCountryName !== country) {
          const { data: fullNameData, error: fullNameError } = await supabase
            .from("materiality_areas_general_sbi")
            .select("*")
            .eq("country", fullCountryName);
            
          if (fullNameError) {
            console.error("Error fetching with full country name:", fullNameError);
          } else if (fullNameData && fullNameData.length > 0) {
            console.log(`Retrieved ${fullNameData.length} records using full country name: ${fullCountryName}`);
            return fullNameData.map(item => ({
              materiality_area: item.materiality_area,
              percentage: item.percentage,
              year: item.year,
              country: item.country,
              row_id: item.row_id
            }));
          }
        }
        
        // If we still don't have data, use sample data
        console.log("No real data found, using sample data");
        return SAMPLE_DATA.map(item => ({
          ...item,
          country: country
        }));
      } catch (error) {
        console.error("Exception in materiality data fetch:", error);
        return SAMPLE_DATA.map(item => ({
          ...item,
          country: country
        }));
      }
    },
    enabled: !!country,
  });
};

// Helper function to get full country name from code
const getFullCountryName = (code: string): string => {
  const countryMapping: Record<string, string> = {
    'Se': 'Sweden',
    'No': 'Norway',
    'Dk': 'Denmark',
    'Fi': 'Finland',
    'Nl': 'The Netherlands'
  };
  
  return countryMapping[code] || code;
};
