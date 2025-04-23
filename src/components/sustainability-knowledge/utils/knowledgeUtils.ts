
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';

export const getTopTermsByPercentage = (
  data: Record<string, KnowledgeData[]>,
  countries: string[],
  terms: string[],
  year: number,
  limit: number
): string[] => {
  // Create a map to store average percentage for each term
  const termPercentages: Record<string, { sum: number; count: number }> = {};
  
  // Calculate average percentage for each term across countries
  countries.forEach(country => {
    const countryData = data[country] || [];
    const yearData = countryData.filter(item => item.year === year);
    
    yearData.forEach(item => {
      if (!termPercentages[item.term]) {
        termPercentages[item.term] = { sum: 0, count: 0 };
      }
      termPercentages[item.term].sum += item.percentage;
      termPercentages[item.term].count += 1;
    });
  });
  
  // Calculate average and sort terms by average percentage
  const termAverages = Object.entries(termPercentages)
    .map(([term, data]) => ({
      term,
      average: data.sum / data.count
    }))
    .sort((a, b) => b.average - a.average);
  
  // Return top terms
  return termAverages.slice(0, limit).map(item => item.term);
};

