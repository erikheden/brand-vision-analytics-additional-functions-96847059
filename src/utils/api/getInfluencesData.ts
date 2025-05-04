import { supabase } from '@/integrations/supabase/client';
import { InfluenceData, InfluencesResponse } from '@/hooks/sustainability-influences';
import { sampleInfluencesData } from '@/hooks/sustainability-influences/sampleData';

export interface InfluencesResponse {
  data: InfluenceData[];
  years: number[];
  influences: string[];
}

export const getInfluencesData = async (country: string): Promise<InfluencesResponse> => {  
  try {
    // Convert country code to uppercase for consistency
    const countryCode = country.toUpperCase();
    
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('SBI_influences')
      .select('*')
      .eq('country', countryCode)
      .order('year', { ascending: true });
    
    if (error) {
      console.error('Error fetching sustainability influences data:', error);
      throw error;
    }
    
    // Map the database fields to our interface
    const mappedData = data.map(item => ({
      year: item.year,
      percentage: item.percentage,
      country: item.country,
      english_label_short: item.medium // Map 'medium' from DB to 'english_label_short' for component compatibility
    })) as InfluenceData[];
    
    // If no data is returned from the database, use sample data
    if (mappedData.length === 0) {
      const fallbackData = sampleInfluencesData[countryCode] || [];
      
      // Extract years and influences
      const years = [...new Set(fallbackData.map(item => item.year))].sort((a, b) => a - b);
      const influences = [...new Set(fallbackData.map(item => item.english_label_short))].sort();
      
      return { 
        data: fallbackData,
        years,
        influences
      };
    }
    
    // Extract years and influences
    const years = [...new Set(mappedData.map(item => item.year))].sort((a, b) => a - b);
    const influences = [...new Set(mappedData.map(item => item.english_label_short))].sort();
    
    return { 
      data: mappedData,
      years,
      influences
    };
  } catch (error) {
    console.error('Exception in influences API:', error);
    
    // Fallback to sample data
    const fallbackData = sampleInfluencesData[country.toUpperCase()] || [];
    const years = [...new Set(fallbackData.map(item => item.year))].sort((a, b) => a - b);
    const influences = [...new Set(fallbackData.map(item => item.english_label_short))].sort();
    
    return { 
      data: fallbackData,
      years,
      influences
    };
  }
};
