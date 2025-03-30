
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BehaviourGroup {
  behaviour_group: string;
  country: string;
  year: number;
  percentage: number;
}

export const useBehaviourGroups = (selectedCountry?: string) => {
  return useQuery({
    queryKey: ['behaviour-groups', selectedCountry],
    queryFn: async (): Promise<BehaviourGroup[]> => {
      let query = supabase
        .from('SBI_behaviour_groups')
        .select('*');
      
      if (selectedCountry) {
        query = query.eq('country', selectedCountry);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching behaviour groups:", error);
        throw new Error("Failed to fetch behaviour groups data");
      }

      return data || [];
    },
  });
};

export const useCountriesWithBehaviourData = () => {
  return useQuery({
    queryKey: ['behaviour-groups-countries'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('SBI_behaviour_groups')
        .select('country')
        .order('country');

      if (error) {
        console.error("Error fetching countries:", error);
        throw new Error("Failed to fetch countries data");
      }

      // Filter to get unique countries
      const uniqueCountries = [...new Set(data?.map(item => item.country))];
      return uniqueCountries || [];
    },
  });
};

export const useYearsWithBehaviourData = (selectedCountry?: string) => {
  return useQuery({
    queryKey: ['behaviour-groups-years', selectedCountry],
    queryFn: async (): Promise<number[]> => {
      let query = supabase
        .from('SBI_behaviour_groups')
        .select('year');
      
      if (selectedCountry) {
        query = query.eq('country', selectedCountry);
      }
      
      const { data, error } = await query
        .order('year');

      if (error) {
        console.error("Error fetching years:", error);
        throw new Error("Failed to fetch years data");
      }

      // Filter to get unique years
      const uniqueYears = [...new Set(data?.map(item => Number(item.year)))];
      return uniqueYears || [];
    },
  });
};
