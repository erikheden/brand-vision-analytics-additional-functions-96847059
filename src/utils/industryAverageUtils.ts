
// This utility calculates industry averages for comparison with individual brands

interface BrandData {
  Year: number;
  Brand: string;
  Score: number;
  Country: string;
  industry?: string | null;
  "Row ID"?: number;
  Projected?: boolean;
}

interface BrandScore {
  brand: string;
  score: number;
  year: number;
  industry: string | null;
}

/**
 * Normalizes industry names to handle minor formatting differences
 */
export const normalizeIndustryName = (industry: string): string => {
  // Standardize common variations
  return industry
    .trim()
    .replace(/&/g, '&')  // Standardize ampersands
    .replace(/,\s+/g, ', ') // Standardize commas
    .replace(/\s+/g, ' '); // Remove extra spaces
};

/**
 * Calculates the industry average scores by year for comparison
 * Using ALL brands in the database for each industry, completely independent of selected brands
 */
export const calculateIndustryAverages = (scores: BrandData[], selectedBrands: string[]): Record<number, Record<string, number>> => {
  if (!scores || scores.length === 0) return {};

  // Group all scores by industry and year
  const industryScoresByYear: Record<string, Record<number, BrandScore[]>> = {};
  
  // Get all unique industries present in the data
  const allIndustries = new Set<string>();
  scores.forEach(score => {
    if (score.industry) {
      // Normalize industry names to handle potential formatting inconsistencies
      const normalizedIndustry = normalizeIndustryName(score.industry);
      allIndustries.add(normalizedIndustry);
    }
  });
  
  // Process ALL scores regardless of selected brands
  scores.forEach(score => {
    if (!score.industry) return;
    
    // Normalize industry name for consistency
    const normalizedIndustry = normalizeIndustryName(score.industry);
    
    if (!industryScoresByYear[normalizedIndustry]) {
      industryScoresByYear[normalizedIndustry] = {};
    }
    
    const year = score.Year;
    if (!industryScoresByYear[normalizedIndustry][year]) {
      industryScoresByYear[normalizedIndustry][year] = [];
    }
    
    industryScoresByYear[normalizedIndustry][year].push({
      brand: score.Brand,
      score: score.Score,
      year: score.Year,
      industry: normalizedIndustry
    });
  });
  
  // Calculate averages by industry and year
  const industryAveragesByYear: Record<number, Record<string, number>> = {};
  
  Object.entries(industryScoresByYear).forEach(([industry, yearScores]) => {
    Object.entries(yearScores).forEach(([year, scores]) => {
      const numYear = parseInt(year);
      if (!industryAveragesByYear[numYear]) {
        industryAveragesByYear[numYear] = {};
      }
      
      // Calculate average score for this industry and year
      const validScores = scores.filter(s => s.score !== null && s.score !== undefined);
      if (validScores.length > 0) {
        const sum = validScores.reduce((acc, curr) => acc + curr.score, 0);
        industryAveragesByYear[numYear][industry] = sum / validScores.length;
      }
    });
  });
  
  return industryAveragesByYear;
};

/**
 * Gets the industry for a specific brand from the scores data
 */
export const getBrandIndustry = (scores: BrandData[], brand: string): string | null => {
  const brandData = scores.find(score => score.Brand === brand);
  return brandData?.industry ? normalizeIndustryName(brandData.industry) : null;
};

/**
 * Calculates the performance delta between a brand and its industry average
 * Positive values mean the brand is outperforming its industry
 */
export const calculatePerformanceDelta = (
  brandScore: number | undefined,
  industryAverage: number | undefined
): number | null => {
  if (brandScore === undefined || industryAverage === undefined) {
    return null;
  }
  return brandScore - industryAverage;
};

/**
 * Returns a percentage difference between a brand's score and its industry average
 * Positive values mean the brand is outperforming its industry
 */
export const calculatePerformancePercentage = (
  brandScore: number | undefined,
  industryAverage: number | undefined
): number | null => {
  if (brandScore === undefined || industryAverage === undefined || industryAverage === 0) {
    return null;
  }
  return ((brandScore - industryAverage) / industryAverage) * 100;
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

/**
 * Calculate industry average performance over time
 */
export const getIndustryPerformanceOverTime = (
  scores: BrandData[],
  industry: string
): Record<number, number> => {
  const normalizedTargetIndustry = normalizeIndustryName(industry);
  const yearlyScores: Record<number, number[]> = {};
  
  // Group scores by year
  scores.forEach(score => {
    if (score.industry && normalizeIndustryName(score.industry) !== normalizedTargetIndustry) return;
    
    const year = score.Year;
    if (!yearlyScores[year]) {
      yearlyScores[year] = [];
    }
    
    if (score.Score !== null && score.Score !== undefined) {
      yearlyScores[year].push(score.Score);
    }
  });
  
  // Calculate average for each year
  const yearlyAverages: Record<number, number> = {};
  
  Object.entries(yearlyScores).forEach(([year, scores]) => {
    if (scores.length > 0) {
      const sum = scores.reduce((acc, score) => acc + score, 0);
      yearlyAverages[parseInt(year)] = sum / scores.length;
    }
  });
  
  return yearlyAverages;
};
