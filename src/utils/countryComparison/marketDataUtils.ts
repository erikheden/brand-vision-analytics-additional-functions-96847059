
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";

/**
 * Fetches all brands data for a country (for market statistics calculation)
 */
export const fetchAllBrandsData = async (
  country: string,
  fullCountryName: string
): Promise<BrandData[]> => {
  // Get market data with country code
  let { data: allBrandsDataWithCode } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("*")
    .eq("Country", country)
    .order('Year', { ascending: true });
    
  // Get market data with full country name
  let { data: allBrandsDataWithFullName } = await supabase
    .from("SBI Ranking Scores 2011-2025")
    .select("*")
    .eq("Country", fullCountryName)
    .order('Year', { ascending: true });
  
  // Combine the results
  return [
    ...(allBrandsDataWithCode || []),
    ...(allBrandsDataWithFullName || [])
  ];
};

/**
 * Creates projected data for 2025 if needed
 */
export const createProjections = (
  finalData: BrandData[],
  selectedBrands: string[]
): BrandData[] => {
  const yearDataByBrand = selectedBrands.map(brand => {
    const brandEntries = finalData.filter(item => item.Brand === brand);
    const has2025 = brandEntries.some(item => item.Year === 2025);
    return { brand, has2025, brandEntries };
  });
  
  const projectedData = yearDataByBrand
    .filter(item => !item.has2025 && item.brandEntries.length > 0)
    .map(item => {
      const latestData = item.brandEntries
        .filter(entry => entry.Score !== null && entry.Score !== 0)
        .sort((a, b) => (b.Year || 0) - (a.Year || 0))[0];
      
      if (latestData) {
        return {
          ...latestData,
          "Row ID": -1,
          Year: 2025,
          Score: latestData.Score,
          Projected: true
        };
      }
      return null;
    })
    .filter(Boolean) as BrandData[];
  
  return projectedData;
};
