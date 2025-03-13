
interface Score {
  Year: number;
  Brand: string;
  Score: number;
  Country: string;
  industry?: string | null;
  "Row ID"?: number;
  Projected?: boolean;
}

interface YearRange {
  earliest: number;
  latest: number;
}

interface ChartDataPoint {
  year: number;
  Projected?: boolean;
  [key: string]: number | boolean | undefined;
}

export const calculateYearRange = (scores: Score[]): YearRange => {
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  if (validScores.length === 0) {
    return { earliest: new Date().getFullYear() - 5, latest: new Date().getFullYear() };
  }

  // Calculate the natural range from the data
  const dataRange = validScores.reduce((range, score) => ({
    earliest: Math.min(range.earliest, score.Year),
    latest: Math.max(range.latest, score.Year)
  }), { earliest: Infinity, latest: -Infinity });
  
  // Ensure we show at least up to 2025
  return {
    earliest: dataRange.earliest,
    latest: Math.max(dataRange.latest, 2025)
  };
};

export const processChartData = (scores: Score[], standardized: boolean = false): ChartDataPoint[] => {
  // First, check if we have market data available (added by useChartData to the scores array)
  const marketData = (scores as any).marketData || [];
  
  // Use either the full market data (if available and standardizing) or just the selected brands
  const dataToUse = standardized && marketData.length > 0 ? marketData : scores;
  console.log(`Processing chart data with ${dataToUse.length} data points (${standardized ? 'using full market data' : 'using selected brands only'})`);
  
  const validScores = dataToUse.filter(score => score.Score !== null && score.Score !== 0);
  
  // Group scores by year and country
  const yearCountryGroups: { [key: string]: Score[] } = {};
  
  validScores.forEach(score => {
    const yearCountryKey = `${score.Year}-${score.Country}`;
    if (!yearCountryGroups[yearCountryKey]) {
      yearCountryGroups[yearCountryKey] = [];
    }
    yearCountryGroups[yearCountryKey].push(score);
  });

  // Calculate market statistics for each year and country
  const marketStats: { [key: string]: { mean: number; stdDev: number } } = {};
  
  Object.entries(yearCountryGroups).forEach(([yearCountryKey, yearCountryScores]) => {
    const scoresValues = yearCountryScores.map(s => s.Score);
    const mean = scoresValues.reduce((sum, score) => sum + score, 0) / scoresValues.length;
    const variance = scoresValues.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scoresValues.length;
    const stdDev = Math.sqrt(variance);
    
    marketStats[yearCountryKey] = { mean, stdDev };
    
    console.log(`Market stats for ${yearCountryKey}: mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)} (based on ${scoresValues.length} scores)`);
  });

  // Now group the SELECTED scores (not market data) by year for the chart data points
  // This way we only visualize the selected brands, but standardize against the full market
  const selectedScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  const yearGroups: { [key: number]: Score[] } = {};
  
  selectedScores.forEach(score => {
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

    if (standardized) {
      // Add standardized scores based on market statistics
      yearScores.forEach(score => {
        const yearCountryKey = `${score.Year}-${score.Country}`;
        const stats = marketStats[yearCountryKey];
        
        if (!stats) {
          console.warn(`No market statistics found for ${yearCountryKey}`);
          result[score.Brand] = 0;
          return;
        }
        
        if (stats.stdDev === 0) {
          result[score.Brand] = 0;
        } else {
          // Standardize scores against market mean and stdDev
          const standardizedScore = (score.Score - stats.mean) / stats.stdDev;
          result[score.Brand] = standardizedScore;
          console.log(`Standardized score for ${score.Brand} in ${score.Year}-${score.Country}: ${standardizedScore.toFixed(2)} (score: ${score.Score}, mean: ${stats.mean.toFixed(2)}, stdDev: ${stats.stdDev.toFixed(2)})`);
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
