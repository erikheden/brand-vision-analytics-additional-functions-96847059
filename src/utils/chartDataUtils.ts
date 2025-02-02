import { supabase } from "@/integrations/supabase/client";
import { BAR_COLOR } from "./constants";

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
  console.log("Starting processChartData with scores:", scores);
  console.log("Standardized mode:", standardized);

  // If not standardized, just return the raw scores
  if (!standardized) {
    const rawData = scores.reduce((acc: ChartDataPoint[], score) => {
      const existingPoint = acc.find(point => point.year === score.Year);
      if (existingPoint) {
        existingPoint[score.Brand] = score.Score;
      } else {
        const newPoint: ChartDataPoint = { year: score.Year };
        newPoint[score.Brand] = score.Score;
        acc.push(newPoint);
      }
      return acc;
    }, []).sort((a, b) => a.year - b.year);

    console.log("Returning raw data:", rawData);
    return rawData;
  }

  // For standardized scores, we need all scores for the country
  const country = scores[0]?.Country;
  console.log("Processing country:", country);
  
  if (!country) {
    console.log("No country found in scores");
    return [];
  }

  // Get all scores for the country
  const { data: allScores, error } = await supabase
    .from("NEW SBI Ranking Scores 2011-2024")
    .select("*")
    .eq("Country", country)
    .not('Score', 'is', null);

  if (error) {
    console.error("Error fetching all scores:", error);
    return [];
  }

  console.log("All scores fetched for country:", allScores?.length);

  if (!allScores || allScores.length === 0) {
    console.log("No scores found for country");
    return [];
  }

  // Group all scores by year
  const scoresByYear = allScores.reduce((acc: { [key: number]: number[] }, score) => {
    if (score.Year && score.Score !== null && score.Score !== 0) {
      if (!acc[score.Year]) {
        acc[score.Year] = [];
      }
      acc[score.Year].push(score.Score);
    }
    return acc;
  }, {});

  console.log("Scores grouped by year:", scoresByYear);

  // Calculate market statistics for each year
  const marketStats = Object.entries(scoresByYear).reduce((acc: { [key: number]: { mean: number; stdDev: number } }, [year, yearScores]) => {
    const mean = yearScores.reduce((sum, score) => sum + score, 0) / yearScores.length;
    const variance = yearScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / yearScores.length;
    const stdDev = Math.sqrt(variance);
    
    acc[parseInt(year)] = { mean, stdDev };
    return acc;
  }, {});

  console.log("Market statistics by year:", marketStats);

  // Now standardize the selected brands' scores using market statistics
  const standardizedData = scores.reduce((acc: ChartDataPoint[], score) => {
    console.log(`Processing score for ${score.Brand} in year ${score.Year}`);
    
    if (!score.Year || score.Score === null || score.Score === 0) {
      console.log(`Skipping invalid score for ${score.Brand} in ${score.Year}`);
      return acc;
    }

    const stats = marketStats[score.Year];
    if (!stats || stats.stdDev === 0) {
      console.log(`No valid market stats for year ${score.Year}`);
      return acc;
    }

    const existingPoint = acc.find(point => point.year === score.Year);
    const standardizedScore = (score.Score - stats.mean) / stats.stdDev;

    console.log(`Standardizing score for ${score.Brand} in ${score.Year}:`, {
      originalScore: score.Score,
      mean: stats.mean,
      stdDev: stats.stdDev,
      standardizedScore
    });

    if (existingPoint) {
      existingPoint[score.Brand] = standardizedScore;
    } else {
      const newPoint: ChartDataPoint = { year: score.Year };
      newPoint[score.Brand] = standardizedScore;
      acc.push(newPoint);
    }
    return acc;
  }, []).sort((a, b) => a.year - b.year);

  console.log("Final standardized data:", standardizedData);
  return standardizedData;
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