
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface InfluenceData {
  year: number;
  percentage: number;
  country: string;
  english_label_short: string;
}

export function useSustainabilityInfluences(country: string) {
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sustainabilityInfluences', country],
    queryFn: async () => {
      if (!country) return [];
      
      const { data, error } = await supabase
        .from('SBI_influences')
        .select('*')
        .eq('country', country)
        .order('year', { ascending: true });
      
      if (error) {
        console.error('Error fetching sustainability influences data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sustainability influences data',
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as InfluenceData[];
    },
    enabled: !!country,
  });
  
  // Extract unique years
  const years = data && data.length > 0 
    ? [...new Set(data.map(item => item.year))].sort((a, b) => a - b)
    : [];
  
  // Extract unique influence factors
  const influences = data && data.length > 0
    ? [...new Set(data.map(item => item.english_label_short))].sort()
    : [];
  
  return {
    data,
    years,
    influences,
    isLoading,
    error
  };
}
