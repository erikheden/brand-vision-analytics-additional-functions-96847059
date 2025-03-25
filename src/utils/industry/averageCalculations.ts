
import { BrandData } from '@/types/brand';
import { BrandScore, IndustryAverages } from './types';
import { normalizeIndustryName } from './normalizeIndustry';

/**
 * Calculates the industry average scores by year for comparison
 * Using ALL brands in the database for each industry, completely independent of selected brands
 */
export const calculateIndustryAverages = (scores: BrandData[]): IndustryAverages => {
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
  const industryAveragesByYear: IndustryAverages = {};
  
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
