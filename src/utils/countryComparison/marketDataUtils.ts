
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { normalizeBrandName, getPreferredBrandName } from "@/utils/industry/normalizeIndustry";

/**
 * Fetches all brands data for a country (for market statistics calculation)
 * Uses improved normalization to deduplicate brands
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
  const combinedData = [
    ...(allBrandsDataWithCode || []),
    ...(allBrandsDataWithFullName || [])
  ];
  
  // Group by normalized brand name and year
  const brandData = new Map<string, Map<number, BrandData[]>>();
  
  combinedData.forEach(entry => {
    if (!entry.Brand || entry.Year === null) return;
    
    const normalizedBrand = normalizeBrandName(entry.Brand.toString());
    const year = Number(entry.Year);
    
    if (!brandData.has(normalizedBrand)) {
      brandData.set(normalizedBrand, new Map());
    }
    
    const yearMap = brandData.get(normalizedBrand)!;
    
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    
    yearMap.get(year)!.push(entry);
  });
  
  // Process each group to select the best variant
  const finalData: BrandData[] = [];
  
  brandData.forEach((yearMap, normalizedBrand) => {
    yearMap.forEach((entries, year) => {
      // Find preferred brand name among the variants for this normalized brand
      const brandVariants = entries.map(e => e.Brand?.toString() || '');
      const preferredName = getPreferredBrandName(brandVariants, normalizedBrand);
      
      // Select the entry with the preferred brand name, or the first one if not found
      const preferredEntry = entries.find(e => e.Brand === preferredName) || entries[0];
      
      // Add the preferred entry to the final data set
      finalData.push(preferredEntry);
    });
  });
  
  return finalData;
};

/**
 * Creates projected data for 2025 if needed
 * Uses the most recent year's data for projection
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
      // Get the most recent year with valid data for this brand
      const latestData = item.brandEntries
        .filter(entry => entry.Score !== null && entry.Score !== 0)
        .sort((a, b) => (b.Year || 0) - (a.Year || 0))[0];
      
      if (latestData) {
        console.log(`Creating projected 2025 data for ${item.brand} based on ${latestData.Year} data (Score: ${latestData.Score})`);
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
