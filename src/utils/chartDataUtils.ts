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
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  // Group scores by year and country - this should include ALL brands, not just selected ones
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
    const scores = yearCountryScores.map(s => s.Score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    marketStats[yearCountryKey] = { mean, stdDev };
    
    console.log(`Market stats for ${yearCountryKey}: mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)} (based on ${scores.length} scores)`);
  });

  // Now group scores by year for the chart data points
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
          // This is the key change: standardize scores against market mean and stdDev
          result[score.Brand] = (score.Score - stats.mean) / stats.stdDev;
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
