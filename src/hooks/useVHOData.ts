
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VHOData {
  row_id: number;
  type_of_factor: string;
  category: string;
  industry: string;
  country: string;
  priority_percentage: number;
  year: number;
  vho_area: string;
}

export const useVHOData = (selectedCountry: string) => {
  return useQuery({
    queryKey: ["vhoData", selectedCountry],
    queryFn: async (): Promise<VHOData[]> => {
      // If no country is selected, return empty array
      if (!selectedCountry) {
        console.log("No country selected for VHO data");
        return [];
      }

      console.log(`Fetching VHO data for country: ${selectedCountry}`);
      
      const { data, error } = await supabase
        .from("SBI_VHO_2021-2024")
        .select("*")
        .eq("country", selectedCountry)
        .eq("year", 2024); // Currently only using 2024 data

      if (error) {
        console.error("Error fetching VHO data:", error);
        throw error;
      }

      console.log(`Fetched ${data.length} VHO records for ${selectedCountry}`);
      return data as VHOData[];
    },
    enabled: !!selectedCountry,
  });
};
