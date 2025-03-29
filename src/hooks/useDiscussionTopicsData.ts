
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DiscussionTopicData {
  row_id?: number;
  country: string;
  discussion_topic: string;
  year: number;
  percentage: number;
}

export const useDiscussionTopicsData = (country: string) => {
  return useQuery({
    queryKey: ['discussion-topics', country],
    queryFn: async (): Promise<DiscussionTopicData[]> => {
      if (!country) return [];
      
      console.log("Fetching discussion topics for country:", country);
      
      try {
        // Make query case-insensitive for country code
        const { data, error } = await supabase
          .from('SBI_Discussion_Topics')
          .select('*')
          .ilike('country', country);
        
        if (error) {
          console.error('Error fetching discussion topics:', error);
          throw new Error(`Failed to fetch discussion topics: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          console.log(`No discussion topics found for country: ${country}`);
          return [];
        }
        
        // Add console logs to debug if data is being returned with discussion_topic values
        console.log("Discussion topics fetched count:", data.length);
        
        // Filter out any rows with empty discussion_topic values
        const validTopics = data
          .filter(item => item && item.discussion_topic && item.discussion_topic.trim() !== '')
          .map(item => ({
            ...item,
            // Convert country code to consistent case if needed
            country: item.country || country,
            // Ensure percentage is a number and multiply by 1 to convert string to number if needed
            percentage: typeof item.percentage === 'number' ? item.percentage : 
                       typeof item.percentage === 'string' ? parseFloat(item.percentage) : 0
          }));
        
        console.log("Valid discussion topics count:", validTopics.length);
        console.log("Sample topics:", validTopics.slice(0, 3));
        
        return validTopics;
      } catch (err) {
        console.error('Exception in useDiscussionTopicsData:', err);
        return [];
      }
    },
    enabled: !!country, // Only run the query if country is provided
  });
};

// Function to fetch all countries' data at once
export const fetchAllDiscussionTopicsData = async (countries: string[]): Promise<DiscussionTopicData[]> => {
  if (!countries || countries.length === 0) return [];
  
  try {
    // Add debugging log
    console.log("Fetching topics for countries:", countries);
    
    // Prepare array of countries in both lowercase and uppercase for matching
    const countryVariants = countries.flatMap(country => [
      country, 
      country.toLowerCase(), 
      country.toUpperCase()
    ]);
    
    // Get all data first - we'll filter client-side to be more flexible
    const { data, error } = await supabase
      .from('SBI_Discussion_Topics')
      .select('*');
      
    if (error) {
      console.error('Error fetching all discussion topics:', error);
      throw new Error(`Failed to fetch all discussion topics: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("No discussion topics data found in the database");
      return [];
    }
    
    console.log(`Fetched ${data.length} total discussion topic records`);
    
    // Filter for the countries we want (case-insensitive)
    const filteredData = data.filter(item => {
      if (!item.country) return false;
      
      const normalizedCountry = item.country.toLowerCase();
      return countries.some(country => 
        country.toLowerCase() === normalizedCountry
      );
    });
    
    // Filter out any rows with empty discussion_topic values
    const validTopics = filteredData
      .filter(item => item && item.discussion_topic && item.discussion_topic.trim() !== '')
      .map(item => ({
        ...item,
        // Ensure percentage is a number
        percentage: typeof item.percentage === 'number' ? item.percentage : 
                   typeof item.percentage === 'string' ? parseFloat(item.percentage) : 0
      }));
    
    // Debug log to check data
    console.log("Filtered discussion topics data count:", validTopics.length);
    if (validTopics.length > 0) {
      console.log("Sample valid discussion topics:", validTopics.slice(0, 3));
      console.log("Countries in dataset:", [...new Set(validTopics.map(item => item.country))]);
      console.log("Years in dataset:", [...new Set(validTopics.map(item => item.year))]);
    }
    
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
    queryFn: () => fetchAllDiscussionTopicsData(countries || []),
    enabled: countries && countries.length > 0,
  });
};
