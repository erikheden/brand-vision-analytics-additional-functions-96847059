
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
  if (!industry) return '';
  
  // Standardize common variations
  return industry
    .trim()
    .replace(/&/g, '&')  // Standardize ampersands
    .replace(/,\s+/g, ', ') // Standardize commas
    .replace(/\s+/g, ' ') // Remove extra spaces
    .replace(/cafes/i, 'Cafés') // Standardize "Cafes" to "Cafés"
    .replace(/take-?away/i, 'Take-away'); // Standardize takeaway variations
};

/**
 * Calculates the industry average scores by year for comparison
 * Using ALL brands in the database for each industry, completely independent of selected brands
 */
export const calculateIndustryAverages = (scores: BrandData[], selectedBrands: string[]): Record<number, Record<string, number>> => {
  if (!scores || scores.length === 0) return {};

  // Create a map of unique scores to prevent duplicate entries from affecting averages
  const uniqueScoreMap = new Map<string, BrandScore>();
  
  // Process ALL scores regardless of selected brands
  scores.forEach(score => {
    if (!score.industry || score.Score === null || score.Score === undefined) return;
    
    // Normalize industry name for consistency
    const normalizedIndustry = normalizeIndustryName(score.industry);
    
    // Create a unique key for each brand-year-industry combination
    const key = `${score.Brand}-${score.Year}-${normalizedIndustry}`;
    
    // Only add if we don't already have this entry (prevents duplicates)
    if (!uniqueScoreMap.has(key)) {
      uniqueScoreMap.set(key, {
        brand: score.Brand,
        score: score.Score,
        year: score.Year,
        industry: normalizedIndustry
      });
    }
  });
  
  // Convert the unique scores map back to an array
  const uniqueScores = Array.from(uniqueScoreMap.values());
  
  // Group all unique scores by industry and year
  const industryScoresByYear: Record<string, Record<number, BrandScore[]>> = {};
  
  uniqueScores.forEach(score => {
    if (!score.industry) return;
    
    if (!industryScoresByYear[score.industry]) {
      industryScoresByYear[score.industry] = {};
    }
    
    const year = score.year;
    if (!industryScoresByYear[score.industry][year]) {
      industryScoresByYear[score.industry][year] = [];
    }
    
    industryScoresByYear[score.industry][year].push(score);
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
        
        // Debug log to see what's being included in the average
        if (numYear === 2025) {
          console.log(`Industry average for ${industry} in ${numYear}: ${industryAveragesByYear[numYear][industry]} (based on ${validScores.length} brands)`);
          console.log(`Brands used in average:`, validScores.map(s => s.brand).sort());
        }
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
