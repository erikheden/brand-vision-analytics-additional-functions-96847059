
// Types for Sustainability Influences data
export interface InfluenceData {
  year: number;
  percentage: number;
  country: string;
  english_label_short: string; // This represents the 'medium' field from the database
}

export interface InfluencesResponse {
  data: InfluenceData[];
  years: number[];
  influences: string[];
}
