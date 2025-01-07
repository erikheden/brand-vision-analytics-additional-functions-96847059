interface YearRange {
  earliest: number;
  latest: number;
}

interface ChartDataPoint {
  year: number;
  [key: string]: number;
}

export const calculateYearRange = (scores: any[]): YearRange => {
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  if (validScores.length === 0) {
    return { earliest: new Date().getFullYear(), latest: new Date().getFullYear() };
  }

  return validScores.reduce((range, score) => ({
    earliest: Math.min(range.earliest, score.Year),
    latest: Math.max(range.latest, score.Year)
  }), { earliest: Infinity, latest: -Infinity });
};

export const processChartData = (scores: any[]): ChartDataPoint[] => {
  const validScores = scores.filter(score => score.Score !== null && score.Score !== 0);
  
  const yearGroups = validScores.reduce((acc: { [key: number]: any }, score) => {
    const year = score.Year;
    if (!acc[year]) {
      acc[year] = { year };
    }
    acc[year][score.Brand] = score.Score;
    return acc;
  }, {});

  return Object.values(yearGroups).sort((a: any, b: any) => a.year - b.year);
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
