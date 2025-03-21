
import { useState, useEffect } from 'react';
import { getAverageScore } from '@/utils/countryComparison/averageScoreUtils';

interface UseBrandBarChartDataProps {
  chartData: any[];
  latestYear?: number;
  standardized: boolean;
}

interface BrandBarChartData {
  dataToUse: any[];
  displayYear: number;
  isProjected: boolean;
  country: string;
  averageScore: number | null;
}

export const useBrandBarChartData = ({
  chartData,
  latestYear = 2025,
  standardized
}: UseBrandBarChartDataProps): BrandBarChartData => {
  const [averageScore, setAverageScore] = useState<number | null>(null);
  
  // Filter and determine the data to use
  const data2025 = chartData.filter(point => point.year === 2025);
  const dataToUse = data2025.length > 0 
    ? data2025 
    : chartData.length > 0 
      ? [chartData.reduce((latest, current) => 
          latest.year > current.year ? latest : current, chartData[0])] 
      : [];
      
  const displayYear = dataToUse[0]?.year || latestYear;
  const isProjected = dataToUse[0]?.Projected || false;
  const country = dataToUse[0]?.country || '';
  
  // Calculate average score from official SBI Average Scores table
  useEffect(() => {
    if (chartData.length > 0) {
      const averageScores = (chartData as any).averageScores;
      if (averageScores && country) {
        const countryAvg = getAverageScore(averageScores, country, displayYear);
        setAverageScore(countryAvg);
        console.log(`Bar chart average score for ${country}/${displayYear}:`, countryAvg);
      } else {
        setAverageScore(null);
      }
    } else {
      setAverageScore(null);
    }
  }, [chartData, country, displayYear, standardized]);

  return {
    dataToUse,
    displayYear,
    isProjected,
    country,
    averageScore
  };
};
