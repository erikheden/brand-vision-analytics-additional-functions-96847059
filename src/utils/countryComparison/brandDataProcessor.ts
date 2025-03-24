
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { createProjections } from "./marketDataUtils";

/**
 * Process brand data to deduplicate and clean
 */
export const processBrandData = (
  combinedData: BrandData[]
): BrandData[] => {
  if (!combinedData || combinedData.length === 0) return [];
  
  // Organize by Brand and Year to handle duplicates
  const uniqueEntries = new Map<string, BrandData>();
  
  combinedData.forEach(entry => {
    if (!entry.Brand || !entry.Year) return;
    
    const key = `${entry.Brand}-${entry.Year}`;
    
    // If we haven't seen this combination before, or if this entry has a higher score
    if (!uniqueEntries.has(key) || 
        (entry.Score && uniqueEntries.get(key)?.Score && entry.Score > uniqueEntries.get(key)!.Score!)) {
      uniqueEntries.set(key, entry);
    }
  });
  
  return Array.from(uniqueEntries.values());
};

/**
 * Enhances brand data with market averages and projections
 */
export const enhanceBrandData = async (
  brandData: BrandData[],
  selectedBrands: string[],
  country: string,
  fullCountryName: string
): Promise<BrandData[]> => {
  if (brandData.length === 0) return [];
  
  // Add projections for 2025 if missing
  const projectedData = createProjections(brandData, selectedBrands);
  
  // Try to get market average scores to include
  try {
    // Get market average data
    let { data: averageData, error: averageError } = await supabase
      .from("SBI Average Scores")
      .select("*")
      .or(`country.eq.${country},country.eq.${fullCountryName}`)
      .order('year', { ascending: true });
    
    if (averageError) {
      console.error("Error fetching average scores:", averageError);
    } else if (averageData && averageData.length > 0) {
      console.log(`Found ${averageData.length} market average records for ${country}`);
      
      // Add market average data as special entries
      const marketAverages = averageData.map(avgData => ({
        "Row ID": -100 - avgData.year, // Use negative IDs for average data
        Year: avgData.year,
        Brand: "Market Average",
        Country: country,
        Score: avgData.score,
        industry: "All Industries",
        IsMarketAverage: true
      }));
      
      // Combine all data
      return [...brandData, ...projectedData, ...marketAverages];
    }
  } catch (err) {
    console.error("Exception fetching market averages:", err);
  }
  
  // Return data with projections but without averages if we couldn't get them
  return [...brandData, ...projectedData];
};
