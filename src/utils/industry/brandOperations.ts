
import { BrandData } from '@/types/brand';
import { normalizeIndustryName } from './normalizeIndustry';

/**
 * Gets the industry for a specific brand from the scores data
 */
export const getBrandIndustry = (scores: BrandData[], brand: string): string | null => {
  const brandData = scores.find(score => score.Brand === brand);
  return brandData?.industry ? normalizeIndustryName(brandData.industry) : null;
};

/**
 * Get all unique industries from the scores data
 */
export const getAllIndustries = (scores: BrandData[]): string[] => {
  const industries = new Set<string>();
  
  scores.forEach(score => {
    if (score.industry) {
      industries.add(normalizeIndustryName(score.industry));
    }
  });
  
  return Array.from(industries).sort();
};

/**
 * Get all brands in a specific industry
 */
export const getBrandsInIndustry = (scores: BrandData[], industry: string): string[] => {
  const normalizedTargetIndustry = normalizeIndustryName(industry);
  const brands = new Set<string>();
  
  scores.forEach(score => {
    if (score.industry && normalizeIndustryName(score.industry) === normalizedTargetIndustry && score.Brand) {
      brands.add(score.Brand);
    }
  });
  
  return Array.from(brands).sort();
};
