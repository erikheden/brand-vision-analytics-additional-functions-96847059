
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';

export interface InfluencesApiResponse {
  data: InfluenceData[];
  years: number[];
  influences: string[];
}

export const fetchInfluencesData = async (country: string): Promise<InfluencesApiResponse> => {
  try {
    const response = await fetch(`/api/influences?country=${country}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching data for ${country}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch influences data for ${country}:`, error);
    // Return empty data structure on error
    return {
      data: [],
      years: [],
      influences: []
    };
  }
};
