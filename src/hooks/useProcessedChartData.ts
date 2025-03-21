
import { useState, useEffect } from "react";
import { processChartData } from "@/utils/chartDataUtils";
import { toast } from "sonner";

/**
 * Hook to process chart data and handle standardization
 */
export const useProcessedChartData = (
  scores: any[], 
  standardized: boolean
) => {
  const [processedData, setProcessedData] = useState<any[]>([]);
  
  // Process chart data when scores or standardization changes
  useEffect(() => {
    if (scores.length > 0) {
      console.log("Processing chart data with standardized =", standardized);
      console.log("Raw scores before processing:", scores.slice(0, 3));
      
      // Get average scores if available (should be attached by useChartData)
      const averageScores = (scores as any).averageScores;
      const hasAverageScores = averageScores && averageScores.size > 0;
      
      if (standardized && !hasAverageScores) {
        console.warn("Standardization requested but no average scores available");
        toast.warning("Limited standardization - using estimated market average");
      }
      
      // Process data with standardization flag
      const data = processChartData(scores, standardized);
      console.log("Processed data sample:", data.slice(0, 3));
      
      // Copy average scores to processed data for access in child components
      if (averageScores) {
        console.log("Attaching average scores to processed data");
        Object.defineProperty(data, 'averageScores', {
          value: averageScores,
          enumerable: false
        });
      }
      
      setProcessedData(data);
      
      // Show toast notification when standardization changes
      if (standardized) {
        toast.info("Showing standardized scores (relative to market average)");
      }
    } else {
      setProcessedData([]);
    }
  }, [scores, standardized]);

  return processedData;
};
