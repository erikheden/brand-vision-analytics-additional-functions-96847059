
import { useMemo } from 'react';
import { normalizeIndustryName } from '@/utils/industry/industryNormalization';
import { calculatePerformancePercentage } from '@/utils/industry';

export interface BrandScore {
  brand: string;
  score: number;
  year: number;
  industry: string | null;
}

/**
 * Hook to get the latest scores for each selected brand
 * and sort them by performance percentage
 */
export const useBrandScores = (
  scores: any[],
  selectedBrands: string[],
  comparisonYear: number,
  industryAverages: Record<number, Record<string, number>>
) => {
  return useMemo(() => {
    // Get the latest scores for each selected brand
    const brandScores = selectedBrands.map(brand => {
      const brandScores = scores
        .filter(score => score.Brand === brand && score.Year === comparisonYear)
        .map(score => ({
          brand,
          score: score.Score,
          year: score.Year,
          industry: score.industry ? normalizeIndustryName(score.industry) : null
        }));
      
      return brandScores[0] || null;
    }).filter(Boolean) as BrandScore[];
    
    if (brandScores.length === 0) {
      return [];
    }
    
    // Calculate performance percentages and sort brandScores by percentage (highest to lowest)
    const sortedBrandScores = [...brandScores].sort((a, b) => {
      const industryA = a.industry;
      const industryB = b.industry;
      
      const industryAverageA = industryA && industryAverages[comparisonYear] ? 
        industryAverages[comparisonYear][industryA] : undefined;
      
      const industryAverageB = industryB && industryAverages[comparisonYear] ? 
        industryAverages[comparisonYear][industryB] : undefined;
      
      const percentageA = calculatePerformancePercentage(a.score, industryAverageA) || 0;
      const percentageB = calculatePerformancePercentage(b.score, industryAverageB) || 0;
      
      return percentageB - percentageA; // Sort by highest to lowest
    });
    
    return sortedBrandScores;
  }, [scores, selectedBrands, comparisonYear, industryAverages]);
};
