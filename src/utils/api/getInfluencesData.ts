
import { supabase } from '@/integrations/supabase/client';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';

// Sample data to use when no database data is available
const sampleData: Record<string, InfluenceData[]> = {
  "SE": [
    { year: 2021, percentage: 0.35, country: "SE", english_label_short: "TV" },
    { year: 2021, percentage: 0.45, country: "SE", english_label_short: "News Media" },
    { year: 2021, percentage: 0.28, country: "SE", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.22, country: "SE", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.38, country: "SE", english_label_short: "TV" },
    { year: 2022, percentage: 0.42, country: "SE", english_label_short: "News Media" },
    { year: 2022, percentage: 0.32, country: "SE", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.25, country: "SE", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.41, country: "SE", english_label_short: "TV" },
    { year: 2023, percentage: 0.39, country: "SE", english_label_short: "News Media" },
    { year: 2023, percentage: 0.37, country: "SE", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.29, country: "SE", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.43, country: "SE", english_label_short: "TV" },
    { year: 2024, percentage: 0.36, country: "SE", english_label_short: "News Media" },
    { year: 2024, percentage: 0.44, country: "SE", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.32, country: "SE", english_label_short: "Friends & Family" }
  ],
  "NO": [
    { year: 2021, percentage: 0.32, country: "NO", english_label_short: "TV" },
    { year: 2021, percentage: 0.41, country: "NO", english_label_short: "News Media" },
    { year: 2021, percentage: 0.26, country: "NO", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.21, country: "NO", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.34, country: "NO", english_label_short: "TV" },
    { year: 2022, percentage: 0.38, country: "NO", english_label_short: "News Media" },
    { year: 2022, percentage: 0.29, country: "NO", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.24, country: "NO", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.37, country: "NO", english_label_short: "TV" },
    { year: 2023, percentage: 0.36, country: "NO", english_label_short: "News Media" },
    { year: 2023, percentage: 0.33, country: "NO", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.27, country: "NO", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.40, country: "NO", english_label_short: "TV" },
    { year: 2024, percentage: 0.33, country: "NO", english_label_short: "News Media" },
    { year: 2024, percentage: 0.38, country: "NO", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.30, country: "NO", english_label_short: "Friends & Family" }
  ]
};

// Add sample data for other countries
["DK", "FI", "NL"].forEach(country => {
  sampleData[country] = sampleData["SE"].map(item => ({
    ...item,
    country,
    percentage: item.percentage * (0.8 + Math.random() * 0.4) // Add some variation
  }));
});

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
      const fallbackData = sampleData[countryCode] || [];
      
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
    const fallbackData = sampleData[country.toUpperCase()] || [];
    const years = [...new Set(fallbackData.map(item => item.year))].sort((a, b) => a - b);
    const influences = [...new Set(fallbackData.map(item => item.english_label_short))].sort();
    
    return { 
      data: fallbackData,
      years,
      influences
    };
  }
};
