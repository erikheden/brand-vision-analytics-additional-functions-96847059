
import { useState, useEffect } from "react";
import { processChartData } from "@/utils/chartDataUtils";

/**
 * Interface for scores array that may have averageScores as a property
 */
interface ScoresArray extends Array<any> {
  averageScores?: Map<string, Map<number, number>>;
  countryYearStats?: Map<string, Map<number, { mean: number; stdDev: number }>>;
}

/**
 * Hook to process chart data
 */
export const useProcessedChartData = (
  scores: ScoresArray, 
  standardized: boolean = false // Kept for compatibility, but will be ignored
) => {
  const [processedData, setProcessedData] = useState<ScoresArray>([]);
  
  // Process chart data when scores change
  useEffect(() => {
    if (scores.length > 0) {
      // Get average scores to attach to processed data
      const averageScores = scores.averageScores;
      const hasAverageScores = averageScores && typeof averageScores.get === 'function' && averageScores.size > 0;
      
      // Always use non-standardized processing (ignore standardized parameter)
      const data = processChartData(scores, false) as ScoresArray;
      
      // Copy metadata to processed data for access in child components
      if (hasAverageScores) {
        // Set directly as a property rather than using Object.defineProperty
        data.averageScores = averageScores;
      }
      
      // Also copy countryYearStats if available
      if (scores.countryYearStats) {
        data.countryYearStats = scores.countryYearStats;
      }
      
      setProcessedData(data);
    } else {
      setProcessedData([]);
    }
  }, [scores]); // Only depend on scores changing, not standardized

  return processedData;
};
