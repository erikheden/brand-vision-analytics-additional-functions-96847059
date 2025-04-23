
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';

export const getTopTermsByPercentage = (
  data: Record<string, KnowledgeData[]>,
  countries: string[],
  terms: string[],
  year: number,
  limit: number
): string[] => {
  // If no data or no countries, return empty array
  if (!data || Object.keys(data).length === 0 || !countries || countries.length === 0) {
    console.log('No data or countries available for top terms calculation');
    return [];
  }
  
  // Create a map to store average percentage for each term
  const termPercentages: Record<string, { sum: number; count: number; terms: string[] }> = {};
  
  // Calculate average percentage for each term across countries
  countries.forEach(country => {
    const countryData = data[country] || [];
    console.log(`Processing country ${country} with ${countryData.length} data points`);
    
    const yearData = countryData.filter(item => item.year === year);
    console.log(`Found ${yearData.length} items for year ${year}`);
    
    yearData.forEach(item => {
      if (!termPercentages[item.term]) {
        termPercentages[item.term] = { sum: 0, count: 0, terms: [] };
      }
      termPercentages[item.term].sum += item.percentage;
      termPercentages[item.term].count += 1;
      termPercentages[item.term].terms.push(`${country}-${item.year}-${item.percentage}`);
    });
  });
  
  // If no data was found, return empty array
  if (Object.keys(termPercentages).length === 0) {
    console.log('No term percentages found for the selected year:', year);
    return [];
  }
  
  // Log the term data for debugging
  Object.entries(termPercentages).forEach(([term, data]) => {
    console.log(`Term: ${term}, Avg: ${data.sum/data.count}, Datapoints: ${data.terms.join(', ')}`);
  });
  
  // Calculate average and sort terms by average percentage
  const termAverages = Object.entries(termPercentages)
    .map(([term, data]) => ({
      term,
      average: data.sum / data.count
    }))
    .sort((a, b) => b.average - a.average);
  
  console.log(`Found ${termAverages.length} terms with percentages, selecting top ${Math.min(limit, termAverages.length)}`);
  
  // Return top terms (limit to available terms if fewer than requested)
  return termAverages.slice(0, Math.min(limit, termAverages.length)).map(item => item.term);
};

// Helper function to normalize country codes for consistent handling
export const normalizeCountryCode = (code: string): string => {
  return code.toUpperCase();
};
