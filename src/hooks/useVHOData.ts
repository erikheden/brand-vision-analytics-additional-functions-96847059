
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getFullCountryName } from "@/components/CountrySelect";

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
      
      // Get the full country name if we have a country code
      const fullCountryName = getFullCountryName(selectedCountry);
      console.log(`Using country name for query: ${fullCountryName}`);
      
      // Try both country code and full name formats
      let { data: codeData, error: codeError } = await supabase
        .from("SBI_VHO_2021-2024")
        .select("*")
        .eq("country", selectedCountry)
        .eq("year", 2024);

      if (codeError) {
        console.error("Error fetching VHO data with country code:", codeError);
      }
      
      // If no data found with code, try with full country name
      if (!codeData || codeData.length === 0) {
        console.log(`No data found with country code, trying full name: ${fullCountryName}`);
        const { data: nameData, error: nameError } = await supabase
          .from("SBI_VHO_2021-2024")
          .select("*")
          .eq("country", fullCountryName)
          .eq("year", 2024);

        if (nameError) {
          console.error("Error fetching VHO data with full country name:", nameError);
          throw nameError;
        }
        
        if (nameData && nameData.length > 0) {
          console.log(`Fetched ${nameData.length} VHO records for ${fullCountryName}`);
          return nameData as VHOData[];
        }
      } else {
        console.log(`Fetched ${codeData.length} VHO records for ${selectedCountry}`);
        return codeData as VHOData[];
      }
      
      console.log("No VHO data found for the selected country");
      return [];
    },
    enabled: !!selectedCountry,
  });
};
