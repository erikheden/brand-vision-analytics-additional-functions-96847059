
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import { getInfluencesData, InfluencesResponse } from './getInfluencesData';

// Use 'export type' for type re-exports when isolatedModules is enabled
export type { InfluencesResponse };

export const fetchInfluencesData = async (country: string): Promise<InfluencesResponse> => {
  try {
    // Use our utility function directly instead of an API call
    return await getInfluencesData(country);
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
