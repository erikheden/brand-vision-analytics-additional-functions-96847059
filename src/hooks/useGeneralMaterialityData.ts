
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MaterialityData {
  materiality_area: string;
  percentage: number;
  year: number;
  country: string;
  row_id?: number;
}

export const useGeneralMaterialityData = (country: string) => {
  return useQuery({
    queryKey: ["generalMaterialityData", country],
    queryFn: async (): Promise<MaterialityData[]> => {
      if (!country) {
        return [];
      }

      const { data, error } = await supabase
        .from("materiality_areas_general_sbi")
        .select("*")
        .eq("country", country);

      if (error) {
        console.error("Error fetching materiality data:", error);
        throw new Error(`Failed to fetch materiality data: ${error.message}`);
      }

      // Transform the data to match our interface
      return (data || []).map(item => ({
        materiality_area: item.materiality_area,
        percentage: item.percentage,
        year: item.year,
        country: item.country,
        row_id: item.row_id
      }));
    },
    enabled: !!country,
  });
};
