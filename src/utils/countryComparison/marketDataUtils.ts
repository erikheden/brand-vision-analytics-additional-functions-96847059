
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";

/**
 * Fetches all brands data for a country (for market statistics calculation)
 * Prioritizes capitalized brand names
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
  
  // Remove duplicates by prioritizing capitalized brand names
  const uniqueBrands = new Map<string, Map<number, BrandData>>();
  
  combinedData.forEach(entry => {
    if (!entry.Brand || entry.Year === null) return;
    
    const normalizedBrand = entry.Brand.toLowerCase();
    const year = Number(entry.Year);
    
    if (!uniqueBrands.has(normalizedBrand)) {
      uniqueBrands.set(normalizedBrand, new Map());
    }
    
    const brandYears = uniqueBrands.get(normalizedBrand)!;
    
    if (!brandYears.has(year) || 
        // Prefer capitalized brand names
        (entry.Brand.charAt(0) === entry.Brand.charAt(0).toUpperCase() && 
         brandYears.get(year)?.Brand?.charAt(0) !== brandYears.get(year)?.Brand?.charAt(0)?.toUpperCase())) {
      brandYears.set(year, entry);
    }
  });
  
  // Flatten the map of maps into a single array
  const result: BrandData[] = [];
  uniqueBrands.forEach(brandYears => {
    brandYears.forEach(entry => {
      result.push(entry);
    });
  });
  
  return result;
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
