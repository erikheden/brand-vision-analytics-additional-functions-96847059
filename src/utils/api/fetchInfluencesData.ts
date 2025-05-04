
import { InfluencesResponse } from '@/hooks/sustainability-influences';
import { getInfluencesData } from './getInfluencesData';

// Use type re-export without the duplicated definition
export type { InfluencesResponse };

export const fetchInfluencesData = async (country: string): Promise<InfluencesResponse> => {
  try {
    // Ensure country code is uppercase for consistent querying
    const normalizedCountry = country.toUpperCase();
    console.log(`Fetching influences data for country: ${normalizedCountry}`);
    
    // Use our utility function directly instead of an API call
    return await getInfluencesData(normalizedCountry);
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
