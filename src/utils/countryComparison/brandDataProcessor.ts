
import { BrandData } from "@/types/brand";
import { fetchAllBrandsData, createProjections } from "./marketDataUtils";

/**
 * Processes and deduplicates the brand data
 */
export const processBrandData = (combinedData: BrandData[]): BrandData[] => {
  // Remove duplicates (same Brand and Year)
  const uniqueEntries = new Map();
  combinedData.forEach(entry => {
    const key = `${entry.Brand}-${entry.Year}`;
    if (!uniqueEntries.has(key) || entry.Score > uniqueEntries.get(key).Score) {
      uniqueEntries.set(key, entry);
    }
  });
  
  return Array.from(uniqueEntries.values());
};

/**
 * Enhance brand data with market context and projections
 */
export const enhanceBrandData = async (
  finalData: BrandData[],
  selectedBrands: string[],
  country: string,
  fullCountryName: string
): Promise<BrandData[]> => {
  try {
    // Get market data for standardization
    const allBrandsData = await fetchAllBrandsData(country, fullCountryName);
    
    // Store market data for standardization
    Object.defineProperty(finalData, 'marketData', {
      value: allBrandsData,
      enumerable: false
    });
    
    // Create projected data for 2025 if needed
    const projectedData = createProjections(finalData, selectedBrands);
    
    return [...finalData, ...projectedData];
  } catch (err) {
    console.error("Error enhancing brand data:", err);
    return finalData;
  }
};
