import { standardizeScore } from '@/utils/countryChartDataUtils';

interface Score {
  Year: number;
  Brand: string;
  Score: number;
  Country: string;
  industry?: string | null;
  "Row ID"?: number;
  Projected?: boolean;
}

interface ChartDataPoint {
  year: number;
  Projected?: boolean;
  country?: string;
  [key: string]: number | boolean | string | undefined;
}

// Updated to return an array of years instead of YearRange object
export const calculateYearRange = (scores: Score[]): number[] => {
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  if (validScores.length === 0) {
    return [new Date().getFullYear() - 5, new Date().getFullYear()];
  }

  // Extract unique years and sort them
  const years = [...new Set(validScores.map(score => score.Year))].sort((a, b) => a - b);
  
  // Ensure we show at least up to 2025
  if (years.length > 0 && years[years.length - 1] < 2025) {
    years.push(2025);
  }
  
  return years;
};

export const processChartData = (scores: Score[], standardized: boolean = false): ChartDataPoint[] => {
  // Get statistics if available (added by useChartData to the scores array)
  const countryYearStats = (scores as any).countryYearStats;
  
  console.log(`Processing chart data with ${scores.length} selected data points, standardized parameter = ${standardized} (ignored)`);
  console.log(`Country-year statistics available: ${countryYearStats && countryYearStats.size > 0 ? 'Yes' : 'No'}`);
  
  // Group scores by year and country
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  // Group by year
  const yearGroups: { [key: number]: Score[] } = {};
  
  validScores.forEach(score => {
    const year = score.Year;
    if (!yearGroups[year]) {
      yearGroups[year] = [];
    }
    yearGroups[year].push(score);
  });

  // Get country from the first valid score (should be the same for all scores)
  const country = validScores.length > 0 ? validScores[0].Country : '';

  const processedPoints = Object.entries(yearGroups).map(([year, yearScores]) => {
    const yearNum = parseInt(year);
    const result: ChartDataPoint = { 
      year: yearNum, 
      country  // Ensure country is always included in the result
    };
    
    // Check if this is projected data
    const hasProjectedData = yearScores.some(score => score.Projected);
    if (hasProjectedData) {
      result.Projected = true;
    }

    // Always add raw scores since we're removing standardization
    yearScores.forEach(score => {
      result[score.Brand] = score.Score;
    });
    
    // Log the processed data point for debugging
    console.log(`Processed data point for year ${yearNum}: ${Object.keys(result).length - 2} brands`);

    return result;
  }).sort((a, b) => a.year - b.year);

  return processedPoints;
};

export const getBrandColors = () => [
  '#b7c895',
  '#dadada',
  '#f0d2b0',
  '#bce2f3',
  '#7c9457',
  '#dd8c57',
  '#6ec0dc',
  '#1d1d1b',
  '#34502b',
  '#09657b'
];

export const createChartConfig = (selectedBrands: string[]) => {
  const brandColors = getBrandColors();
  return Object.fromEntries(
    selectedBrands.map((brand, index) => [
      brand,
      {
        label: brand,
        color: brandColors[index % brandColors.length]
      }
    ])
  );
};
