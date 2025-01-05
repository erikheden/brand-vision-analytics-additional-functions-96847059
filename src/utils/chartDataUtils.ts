interface YearRange {
  earliest: number;
  latest: number;
}

interface ChartDataPoint {
  year: number;
  [key: string]: number;
}

export const calculateYearRange = (scores: any[]): YearRange => {
  return scores.reduce((range, score) => {
    return {
      earliest: Math.min(range.earliest, score.Year),
      latest: Math.max(range.latest, score.Year)
    };
  }, { earliest: Infinity, latest: -Infinity });
};

export const processChartData = (scores: any[]): ChartDataPoint[] => {
  return scores.reduce((acc: ChartDataPoint[], score) => {
    const year = score.Year;
    const existingYear = acc.find(item => item.year === year);
    
    if (existingYear) {
      existingYear[score.Brand] = score.Score;
    } else {
      const newDataPoint = { year } as ChartDataPoint;
      newDataPoint[score.Brand] = score.Score;
      acc.push(newDataPoint);
    }
    return acc;
  }, []).sort((a, b) => a.year - b.year);
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