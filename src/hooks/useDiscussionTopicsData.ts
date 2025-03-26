
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
      
      // Add console logs to debug if data is being returned with discussion_topic values
      console.log("Discussion topics fetched:", data);
      
      // Filter out any rows with empty discussion_topic values
      const validTopics = data?.filter(item => 
        item.discussion_topic && 
        item.discussion_topic.trim() !== ''
      ) || [];
      
      console.log("Valid discussion topics:", validTopics);
      console.log("Unique discussion topics:", [...new Set(validTopics.map(item => item.discussion_topic))]);
      
      return validTopics;
    },
    enabled: !!country, // Only run the query if country is provided
  });
};

// Function to fetch all countries' data at once
export const fetchAllDiscussionTopicsData = async (countries: string[]): Promise<DiscussionTopicData[]> => {
  if (!countries.length) return [];
  
  try {
    // Add debugging log
    console.log("Fetching topics for countries:", countries);
    
    const { data, error } = await supabase
      .from('SBI_Discussion_Topics_Geography')
      .select('*')
      .in('country', countries);
    
    if (error) {
      console.error('Error fetching all discussion topics:', error);
      throw new Error(`Failed to fetch all discussion topics: ${error.message}`);
    }
    
    // Filter out any rows with empty discussion_topic values
    const validTopics = data?.filter(item => 
      item.discussion_topic && 
      item.discussion_topic.trim() !== ''
    ) || [];
    
    // Debug log to check data
    console.log("All discussion topics data count:", validTopics.length);
    console.log("Sample valid discussion topics:", validTopics.slice(0, 3));
    
    return validTopics;
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
