
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
  // Get average scores if available (added by useChartData to the scores array)
  const averageScores = (scores as any).averageScores;
  const hasAverageScores = averageScores && averageScores.size > 0;
  
  if (standardized && !hasAverageScores) {
    console.warn("Standardization requested but no average scores available - falling back to estimated standardization");
  }
  
  console.log(`Processing chart data with ${scores.length} selected data points, standardized = ${standardized}`);
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

    if (standardized) {
      // Calculate year averages for standardization
      let yearAverage = 0;
      
      // First, try to get average from the official averages
      if (hasAverageScores) {
        for (const [countryKey, yearMap] of averageScores.entries()) {
          if ((countryKey === country || countryKey.toLowerCase() === country.toLowerCase()) && 
              yearMap.has(yearNum)) {
            yearAverage = yearMap.get(yearNum) || 0;
            console.log(`Using official average for ${country}/${yearNum}: ${yearAverage.toFixed(2)}`);
            break;
          }
        }
      }
      
      // If no official average, calculate from the selected brands
      if (yearAverage === 0) {
        const validScoresForYear = yearScores.filter(s => s.Score !== null && s.Score > 0);
        const sum = validScoresForYear.reduce((sum, score) => sum + score.Score, 0);
        if (validScoresForYear.length > 0) {
          yearAverage = sum / validScoresForYear.length;
          console.log(`Using calculated average for ${country}/${yearNum}: ${yearAverage.toFixed(2)} (from ${validScoresForYear.length} brands)`);
        }
      }
      
      if (yearAverage === 0) {
        console.warn(`No average available for ${country}/${yearNum}, cannot standardize properly`);
        // Add raw scores as fallback
        yearScores.forEach(score => {
          result[score.Brand] = score.Score;
        });
      } else {
        // Calculate standard deviation using a fixed percentage of the mean
        // This is a simplification since we only have the mean
        const estimatedStdDev = yearAverage * 0.15; // Assuming 15% of mean as stdDev
        
        // Standardize each score against the year average
        yearScores.forEach(score => {
          if (score.Score === null || score.Score === 0) {
            result[score.Brand] = 0;
            return;
          }
          
          // Standardize score against year average and estimated stdDev
          const standardizedScore = (score.Score - yearAverage) / estimatedStdDev;
          
          // Cap to reasonable range (-3 to +3 standard deviations)
          const cappedScore = Math.max(-3, Math.min(3, standardizedScore));
          
          console.log(`Standardized ${score.Brand} for ${yearNum}: ${score.Score} → ${cappedScore.toFixed(2)} (avg=${yearAverage.toFixed(2)}, est.stdDev=${estimatedStdDev.toFixed(2)})`);
          
          result[score.Brand] = cappedScore;
        });
      }
    } else {
      // Add raw scores
      yearScores.forEach(score => {
        result[score.Brand] = score.Score;
      });
    }
    
    // Log the processed data point for debugging
    console.log(`Processed data point for year ${yearNum}: ${Object.keys(result).length - 2} brands, standardized: ${standardized}`);

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
