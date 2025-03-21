
import { useState, useEffect } from "react";
import { processChartData } from "@/utils/chartDataUtils";

/**
 * Hook to process chart data
 */
export const useProcessedChartData = (
  scores: any[], 
  standardized: boolean = false // Kept for compatibility, but will be ignored
) => {
  const [processedData, setProcessedData] = useState<any[]>([]);
  
  // Process chart data when scores change
  useEffect(() => {
    if (scores.length > 0) {
      console.log("Processing chart data");
      console.log("Raw scores before processing:", scores.slice(0, 3));
      
      // Get average scores to attach to processed data
      const averageScores = (scores as any).averageScores;
      const hasAverageScores = averageScores && averageScores.size > 0;
      
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
      const data = processChartData(scores, false);
      console.log("Processed data sample:", data.slice(0, 3));
      
      // Copy metadata to processed data for access in child components
      if (averageScores) {
        console.log("Attaching average scores to processed data");
        Object.defineProperty(data, 'averageScores', {
          value: averageScores,
          enumerable: false,
          configurable: true
        });
      }
      
      setProcessedData(data);
    } else {
      setProcessedData([]);
    }
  }, [scores]);

  return processedData;
};
