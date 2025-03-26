
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

// Function to fetch all countries' data at once
export const fetchAllDiscussionTopicsData = async (countries: string[]): Promise<DiscussionTopicData[]> => {
  if (!countries.length) return [];
  
  try {
    const { data, error } = await supabase
      .from('SBI_Discussion_Topics_Geography')
      .select('*')
      .in('country', countries);
    
    if (error) {
      console.error('Error fetching all discussion topics:', error);
      throw new Error(`Failed to fetch all discussion topics: ${error.message}`);
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching all discussion topics:', err);
    throw err;
  }
};

// Hook to get all countries' data
export const useAllDiscussionTopicsData = (countries: string[]) => {
  return useQuery({
    queryKey: ['all-discussion-topics', countries],
    queryFn: () => fetchAllDiscussionTopicsData(countries),
    enabled: countries.length > 0,
  });
};
