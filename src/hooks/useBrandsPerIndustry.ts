
import { useMemo } from 'react';
import { normalizeIndustryName } from '@/utils/industry/industryNormalization';

/**
 * Hook to count the number of brands per industry
 */
export const useBrandsPerIndustry = (marketData: any[], comparisonYear: number) => {
  return useMemo(() => {
    const counts: Record<string, number> = {};
    const uniqueBrands = new Set<string>();
    
    marketData.forEach((score: any) => {
      if (score.industry && score.Year === comparisonYear) {
        // Normalize industry name
        const normalizedIndustry = normalizeIndustryName(score.industry);
        
        // Only count unique brands per industry
        const brandKey = `${score.Brand}-${normalizedIndustry}`;
        if (!uniqueBrands.has(brandKey)) {
          uniqueBrands.add(brandKey);
          
          if (!counts[normalizedIndustry]) {
            counts[normalizedIndustry] = 0;
          }
          counts[normalizedIndustry]++;
        }
      }
    });
    
    console.log("Brands per industry:", counts);
    return counts;
  }, [marketData, comparisonYear]);
};
