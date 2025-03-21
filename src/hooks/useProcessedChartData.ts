
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
      console.log("Processing chart data");
      console.log("Raw scores before processing:", scores.slice(0, 3));
      
      // Get average scores to attach to processed data
      const averageScores = scores.averageScores;
      const hasAverageScores = averageScores && typeof averageScores.get === 'function' && averageScores.size > 0;
      
      if (hasAverageScores) {
        console.log("Average scores found in raw data:", 
          Array.from(averageScores.entries()).map(([country, yearMap]) => 
            `${country}: ${Array.from(yearMap.entries()).length} years`
          )
        );
      } else {
        console.log("No average scores found in raw data");
      }
      
      // Always use non-standardized processing (ignore standardized parameter)
      const data = processChartData(scores, false) as ScoresArray;
      console.log("Processed data sample:", data.slice(0, 3));
      
      // Copy metadata to processed data for access in child components
      if (hasAverageScores) {
        console.log("Attaching average scores to processed data");
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
  }, [scores]);

  return processedData;
};
