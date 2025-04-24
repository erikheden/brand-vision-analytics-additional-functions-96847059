
import { useState, useEffect, useRef } from "react";
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
  const prevScoresRef = useRef<string>("");
  
  // Process chart data when scores change
  useEffect(() => {
    // Prevent unnecessary processing by checking if scores actually changed
    if (scores.length === 0) {
      setProcessedData([]);
      return;
    }

    // Create a key based on score IDs to detect changes
    const scoresKey = JSON.stringify(scores.map(s => s.id || s["Row ID"]));
    
    // Skip processing if the data hasn't changed
    if (scoresKey === prevScoresRef.current) {
      return;
    }
    
    // Update our reference for next comparison
    prevScoresRef.current = scoresKey;
    
    // Get average scores to attach to processed data
    const averageScores = scores.averageScores;
    const hasAverageScores = averageScores && typeof averageScores.get === 'function' && averageScores.size > 0;
    
    // Always use non-standardized processing
    const data = processChartData(scores, false) as ScoresArray;
    
    // Copy metadata to processed data for access in child components
    if (hasAverageScores) {
      data.averageScores = averageScores;
    }
    
    // Also copy countryYearStats if available
    if (scores.countryYearStats) {
      data.countryYearStats = scores.countryYearStats;
    }
    
    setProcessedData(data);
  }, [scores]); // Only depend on scores changing

  return processedData;
};
