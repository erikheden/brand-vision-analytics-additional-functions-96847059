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
  
  // Group scores by year
  const yearGroups = validScores.reduce((acc: { [key: number]: Score[] }, score) => {
    const year = score.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(score);
    return acc;
  }, {});

  return Object.entries(yearGroups).map(([year, yearScores]) => {
    const yearNum = parseInt(year);
    const result: ChartDataPoint = { year: yearNum };

    if (standardized) {
      // Calculate mean and standard deviation for the year
      const scores = yearScores.map(s => s.Score);
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
      const stdDev = Math.sqrt(variance);

      // Add standardized scores
      yearScores.forEach(score => {
        if (stdDev === 0) {
          result[score.Brand] = 0;
        } else {
          result[score.Brand] = (score.Score - mean) / stdDev;
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
