
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DiscussionTopicData {
  row_id: number;
  country: string;
  geography: string;
  discussion_topic: string;
  year: number;
  percentage: number;
}

export const useDiscussionTopicsData = (country: string) => {
  return useQuery({
    queryKey: ['discussion-topics', country],
    queryFn: async (): Promise<DiscussionTopicData[]> => {
      if (!country) return [];
      
      // Fetch data from the SBI_Discussion_Topics_Geography table
      const { data, error } = await supabase
        .from('SBI_Discussion_Topics_Geography')
        .select('*')
        .eq('country', country);
      
      if (error) {
        console.error('Error fetching discussion topics:', error);
        throw new Error(`Failed to fetch discussion topics: ${error.message}`);
      }
      
      return data || [];
    },
    enabled: !!country, // Only run the query if country is provided
  });
};
