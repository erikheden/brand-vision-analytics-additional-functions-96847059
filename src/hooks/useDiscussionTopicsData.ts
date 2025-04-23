
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export interface DiscussionTopicData {
  row_id?: number;
  country: string;
  discussion_topic: string;
  year: number;
  percentage: number;
  geography?: string; // Added optional geography field
}

export const useDiscussionTopicsData = (country: string) => {
  return useQuery({
    queryKey: ['discussion-topics', country],
    queryFn: async (): Promise<DiscussionTopicData[]> => {
      if (!country) return [];
      
      console.log("Fetching discussion topics for country:", country);
      
      try {
        // Normalize country code to uppercase
        const normalizedCountry = country.toUpperCase();
        
        // Make query case-insensitive for country code
        const { data, error } = await supabase
          .from('SBI_Discussion_Topics')
          .select('*')
          .ilike('country', normalizedCountry);
        
        if (error) {
          console.error('Error fetching discussion topics:', error);
          throw new Error(`Failed to fetch discussion topics: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          console.log(`No discussion topics found for country: ${normalizedCountry}`);
          return [];
        }
        
        // Add console logs to debug if data is being returned with discussion_topic values
        console.log("Discussion topics fetched count:", data.length);
        
        // Filter out any rows with empty discussion_topic values
        const validTopics = data
          .filter(item => item && item.discussion_topic && item.discussion_topic.trim() !== '')
          .map(item => ({
            ...item,
            // Ensure country code is consistent (uppercase)
            country: normalizedCountry,
            // Ensure percentage is a number between 0-1 for consistent handling
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
    
    // Normalize all country codes to uppercase
    const normalizedCountries = countries.map(country => country.toUpperCase());
    
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
      
      const normalizedItemCountry = item.country.toUpperCase();
      return normalizedCountries.includes(normalizedItemCountry);
    });
    
    // Filter out any rows with empty discussion_topic values
    const validTopics = filteredData
      .filter(item => item && item.discussion_topic && item.discussion_topic.trim() !== '')
      .map(item => ({
        ...item,
        // Ensure country code is consistent (uppercase)
        country: item.country.toUpperCase(),
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
  // Normalize country codes to uppercase
  const normalizedCountries = useMemo(() => {
    return countries.map(country => country.toUpperCase());
  }, [countries]);
  
  return useQuery({
    queryKey: ['all-discussion-topics', normalizedCountries],
    queryFn: () => fetchAllDiscussionTopicsData(normalizedCountries || []),
    enabled: normalizedCountries && normalizedCountries.length > 0,
  });
};
