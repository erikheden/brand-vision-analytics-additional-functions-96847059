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
  [key: string]: number | boolean | undefined;
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
  // Get average scores if available (added by useChartData to the scores array)
  const averageScores = (scores as any).averageScores;
  const hasAverageScores = averageScores && averageScores.size > 0;
  
  if (standardized && !hasAverageScores) {
    console.warn("Standardization requested but no average scores available - falling back to raw scores");
  }
  
  console.log(`Processing chart data with ${scores.length} selected data points`);
  console.log(`Average scores available: ${hasAverageScores ? 'Yes' : 'No'}`);
  
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

  return Object.entries(yearGroups).map(([year, yearScores]) => {
    const yearNum = parseInt(year);
    const result: ChartDataPoint = { year: yearNum };
    
    // Check if this is projected data
    const hasProjectedData = yearScores.some(score => score.Projected);
    if (hasProjectedData) {
      result.Projected = true;
    }

    if (standardized && hasAverageScores) {
      // Add standardized scores based on average scores table
      yearScores.forEach(score => {
        const country = score.Country;
        
        // Try to get the average score for this country and year
        const countryAvgMap = averageScores.get(country);
        const averageScore = countryAvgMap?.get(yearNum);
        
        if (!averageScore) {
          console.warn(`No average score found for ${country}/${yearNum}`);
          result[score.Brand] = score.Score;
          return;
        }
        
        // Calculate standard deviation using a fixed percentage of the mean
        // This is a simplification since we only have the mean
        const estimatedStdDev = averageScore * 0.15; // Assuming 15% of mean as stdDev
        
        if (estimatedStdDev === 0) {
          result[score.Brand] = 0;
        } else {
          // Standardize scores against average score and estimated stdDev
          const standardizedScore: number = (score.Score - averageScore) / estimatedStdDev;
          result[score.Brand] = standardizedScore;
          console.log(`Standardized score for ${score.Brand} in ${score.Year}-${score.Country}: ${standardizedScore.toFixed(2)} (score: ${score.Score}, avg: ${averageScore.toFixed(2)}, est.stdDev: ${estimatedStdDev.toFixed(2)})`);
        }
      });
    } else {
      // Add raw scores
      yearScores.forEach(score => {
        result[score.Brand] = score.Score;
      });
    }

    return result;
  }).sort((a, b) => a.year - b.year);
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
