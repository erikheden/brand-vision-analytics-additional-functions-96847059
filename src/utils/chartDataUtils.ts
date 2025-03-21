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
  const hasStats = countryYearStats && countryYearStats.size > 0;
  
  if (standardized && !hasStats) {
    console.warn("Standardization requested but no country-year statistics available - falling back to estimated standardization");
  }
  
  console.log(`Processing chart data with ${scores.length} selected data points, standardized = ${standardized}`);
  console.log(`Country-year statistics available: ${hasStats ? 'Yes' : 'No'}`);
  
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
      // Try to get country-year statistics for standardization
      let yearStats: { mean: number; stdDev: number; count: number } | null = null;
      
      if (hasStats && countryYearStats.has(country)) {
        const countryStats = countryYearStats.get(country);
        if (countryStats && countryStats.has(yearNum)) {
          yearStats = countryStats.get(yearNum);
          console.log(`Using statistics for ${country}/${yearNum}: mean=${yearStats.mean.toFixed(2)}, stdDev=${yearStats.stdDev.toFixed(2)}, count=${yearStats.count}`);
        }
      }
      
      // If we have valid statistics with sufficient data points
      if (yearStats && yearStats.count >= 2 && yearStats.stdDev > 0) {
        // Standardize each score against the year statistics
        yearScores.forEach(score => {
          if (score.Score === null || score.Score === 0) {
            result[score.Brand] = 0;
            return;
          }
          
          // Standardize score using our utility function
          const standardizedScore = standardizeScore(score.Score, yearStats!.mean, yearStats!.stdDev);
          
          if (standardizedScore !== null) {
            result[score.Brand] = standardizedScore;
            console.log(`Standardized ${score.Brand} for ${yearNum}: ${score.Score} → ${standardizedScore.toFixed(2)} (mean=${yearStats!.mean.toFixed(2)}, stdDev=${yearStats!.stdDev.toFixed(2)})`);
          } else {
            // Keep raw score if standardization failed
            console.warn(`Failed to standardize score for ${score.Brand} in ${yearNum}, using raw value`);
            result[score.Brand] = score.Score;
          }
        });
      } else {
        // Use simplified standardization with estimated parameters if proper statistics aren't available
        console.warn(`No valid statistics for ${country}/${yearNum}, using estimated standardization`);
        
        // Calculate basic statistics from the year's scores
        const scoresForYear = yearScores.map(s => s.Score).filter(s => s !== null && s > 0) as number[];
        
        if (scoresForYear.length >= 2) {
          // Calculate mean
          const sum = scoresForYear.reduce((a, b) => a + b, 0);
          const mean = sum / scoresForYear.length;
          
          // Estimate stdDev as a percentage of the mean (simplified approach)
          const estimatedStdDev = Math.max(mean * 0.15, 1); // At least 1 to avoid division issues
          
          console.log(`Using estimated stats for ${country}/${yearNum}: mean=${mean.toFixed(2)}, estimatedStdDev=${estimatedStdDev.toFixed(2)}`);
          
          // Standardize each score
          yearScores.forEach(score => {
            if (score.Score === null || score.Score === 0) {
              result[score.Brand] = 0;
              return;
            }
            
            // Use standardizeScore for consistency
            const standardizedScore = standardizeScore(score.Score, mean, estimatedStdDev);
            
            if (standardizedScore !== null) {
              result[score.Brand] = standardizedScore;
            } else {
              // Keep raw score if standardization failed
              result[score.Brand] = score.Score;
            }
          });
        } else {
          console.warn(`Not enough scores to standardize for ${country}/${yearNum}, using raw scores`);
          // Add raw scores as fallback
          yearScores.forEach(score => {
            result[score.Brand] = score.Score;
          });
        }
      }
    } else {
      // Add raw scores when not standardizing
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
