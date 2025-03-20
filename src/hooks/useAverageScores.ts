
import { useEffect, useState } from 'react';
import { getAverageScore } from '@/utils/countryComparison/averageScoreUtils';

/**
 * Hook to extract yearly average scores from chart data
 */
export const useAverageScores = (
  chartData: any[],
  country: string,
  standardized: boolean
) => {
  const [yearlyAverages, setYearlyAverages] = useState<{year: number, average: number}[]>([]);
  
  // Extract average scores for each year
  useEffect(() => {
    if (chartData.length > 0 && !standardized && country) {
      // Check if averageScores are attached to the chart data
      const averageScores = (chartData as any).averageScores;
      
      if (averageScores) {
        // Get all years from the chart data
        const years = chartData.map(point => point.year);
        const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
        
        // Get average score for each year
        const averagesByYear = uniqueYears.map(year => {
          const avgScore = getAverageScore(averageScores, country, year);
          return {year, average: avgScore !== null ? avgScore : 0};
        }).filter(item => item.average > 0);
        
        setYearlyAverages(averagesByYear);
        console.log("Yearly average scores for line chart:", averagesByYear);
      } else {
        setYearlyAverages([]);
      }
    } else {
      setYearlyAverages([]);
    }
  }, [chartData, country, standardized]);

  return yearlyAverages;
};
