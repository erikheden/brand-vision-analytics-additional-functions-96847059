interface Score {
  Year: number;
  Brand: string;
  Score: number;
  Country: string;
  industry?: string | null;
  "Row ID"?: number;
}

interface YearRange {
  earliest: number;
  latest: number;
}

interface ChartDataPoint {
  year: number;
  [key: string]: number;
}

export const calculateYearRange = (scores: Score[]): YearRange => {
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  if (validScores.length === 0) {
    return { earliest: new Date().getFullYear(), latest: new Date().getFullYear() };
  }

  return validScores.reduce((range, score) => ({
    earliest: Math.min(range.earliest, score.Year),
    latest: Math.max(range.latest, score.Year)
  }), { earliest: Infinity, latest: -Infinity });
};

export const processChartData = async (scores: Score[], standardized: boolean = false): Promise<ChartDataPoint[]> => {
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  // Group scores by year
  const yearGroups = validScores.reduce((acc: { [key: number]: Score[] }, score) => {
    const year = score.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(score);
    return acc;
  }, {});

  if (!standardized) {
    return Object.entries(yearGroups).map(([year, yearScores]) => {
      const yearNum = parseInt(year);
      const result: ChartDataPoint = { year: yearNum };
      yearScores.forEach(score => {
        result[score.Brand] = score.Score;
      });
      return result;
    }).sort((a, b) => a.year - b.year);
  }

  // For standardized scores, we need to fetch all brands' scores for each year
  const { data: allScores } = await supabase
    .from("NEW SBI Ranking Scores 2011-2024")
    .select("*")
    .eq("Country", scores[0].Country); // Use the same country as the selected scores

  // Calculate market-wide statistics per year
  const marketStats = (allScores || []).reduce((acc: { [key: number]: { scores: number[], mean?: number, stdDev?: number } }, score) => {
    if (score.Score !== null && score.Score !== 0 && score.Year) {
      if (!acc[score.Year]) {
        acc[score.Year] = { scores: [] };
      }
      acc[score.Year].scores.push(score.Score);
    }
    return acc;
  }, {});

  // Calculate mean and standard deviation for each year
  Object.keys(marketStats).forEach(year => {
    const yearScores = marketStats[parseInt(year)].scores;
    const mean = yearScores.reduce((sum, score) => sum + score, 0) / yearScores.length;
    const variance = yearScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / yearScores.length;
    const stdDev = Math.sqrt(variance);
    
    marketStats[parseInt(year)].mean = mean;
    marketStats[parseInt(year)].stdDev = stdDev;
  });

  // Apply market-wide standardization to selected brands
  return Object.entries(yearGroups).map(([year, yearScores]) => {
    const yearNum = parseInt(year);
    const result: ChartDataPoint = { year: yearNum };
    const stats = marketStats[yearNum];

    if (stats && stats.mean !== undefined && stats.stdDev !== undefined && stats.stdDev !== 0) {
      yearScores.forEach(score => {
        result[score.Brand] = (score.Score - stats.mean!) / stats.stdDev!;
      });
    } else {
      // Fallback to raw scores if we can't calculate standardized scores
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