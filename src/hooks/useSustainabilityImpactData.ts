import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ImpactData {
  row_id: number;
  country: string;
  year: number;
  category: string;
  impact_level: string;
  percentage: number;
}

export const useSustainabilityImpactData = (country: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sustainabilityImpactData', country],
    queryFn: async () => {
      console.log(`Fetching data for country: ${country}`);
      try {
        const { data, error } = await supabase
          .from('SBI_purchasing_decision_industries')
          .select('*')
          .eq('country', country);

        if (error) {
          console.error(`Error fetching data for country ${country}:`, error);
          throw error;
        }

        console.log(`Fetched ${data?.length || 0} rows for ${country}`);
        return data as ImpactData[];
      } catch (error) {
        console.error(`Error in useSustainabilityImpactData for ${country}:`, error);
        throw error;
      }
    },
    enabled: !!country,
  });

  const processedData: Record<string, Record<string, Record<string, number>>> = {};

  data?.forEach((item) => {
    if (!processedData[item.category]) {
      processedData[item.category] = {};
    }

    if (!processedData[item.category][item.year]) {
      processedData[item.category][item.year] = {};
    }

    processedData[item.category][item.year][item.impact_level] = item.percentage;
  });

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map(item => item.category)));
  }, [data]);

  const impactLevels = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map(item => item.impact_level)));
  }, [data]);

  const years = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map(item => item.year))).sort((a, b) => a - b);
  }, [data]);

  // Define a function to get data for a specific country
  const getCountryData = async (countryCode: string) => {
    console.log(`Fetching data for country: ${countryCode}`);
    try {
      // Make the query to get data for the specified country
      const { data: countryData, error } = await supabase
        .from('SBI_purchasing_decision_industries')
        .select('*')
        .eq('country', countryCode);

      if (error) {
        console.error(`Error fetching data for country ${countryCode}:`, error);
        throw error;
      }

      console.log(`Fetched ${countryData?.length || 0} rows for ${countryCode}`);

      // Process the country data the same way as in the main hook
      const processedCountryData: Record<string, Record<string, Record<string, number>>> = {};
      
      countryData?.forEach((item) => {
        if (!processedCountryData[item.category]) {
          processedCountryData[item.category] = {};
        }
        
        if (!processedCountryData[item.category][item.year]) {
          processedCountryData[item.category][item.year] = {};
        }
        
        processedCountryData[item.category][item.year][item.impact_level] = item.percentage;
      });

      return { 
        data: countryData as ImpactData[], 
        processedData: processedCountryData 
      };
    } catch (error) {
      console.error(`Error in getCountryData for ${countryCode}:`, error);
      throw error;
    }
  };

  // Return the existing hook data plus the new function
  return {
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    getCountryData
  };
};
