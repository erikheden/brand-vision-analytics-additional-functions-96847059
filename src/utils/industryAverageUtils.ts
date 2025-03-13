
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
 * Calculates the industry average scores by year for comparison
 */
export const calculateIndustryAverages = (scores: BrandData[], selectedBrands: string[]): Record<number, Record<string, number>> => {
  if (!scores || scores.length === 0) return {};

  // Group all scores by industry and year
  const industryScoresByYear: Record<string, Record<number, BrandScore[]>> = {};
  
  // Only process scores that are from the selected brands' industries
  const selectedBrandsIndustries = new Set(
    scores
      .filter(score => selectedBrands.includes(score.Brand))
      .map(score => score.industry)
      .filter(Boolean)
  );
  
  // Group all scores by industry and year
  scores.forEach(score => {
    if (!score.industry || !selectedBrandsIndustries.has(score.industry)) return;
    
    if (!industryScoresByYear[score.industry]) {
      industryScoresByYear[score.industry] = {};
    }
    
    const year = score.Year;
    if (!industryScoresByYear[score.industry][year]) {
      industryScoresByYear[score.industry][year] = [];
    }
    
    industryScoresByYear[score.industry][year].push({
      brand: score.Brand,
      score: score.Score,
      year: score.Year,
      industry: score.industry
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
  return brandData?.industry || null;
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
      industries.add(score.industry);
    }
  });
  
  return Array.from(industries).sort();
};

/**
 * Get all brands in a specific industry
 */
export const getBrandsInIndustry = (scores: BrandData[], industry: string): string[] => {
  const brands = new Set<string>();
  
  scores.forEach(score => {
    if (score.industry === industry && score.Brand) {
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
  const yearlyScores: Record<number, number[]> = {};
  
  // Group scores by year
  scores.forEach(score => {
    if (score.industry !== industry) return;
    
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
