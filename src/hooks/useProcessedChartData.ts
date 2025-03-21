
import { useState, useEffect } from "react";
import { processChartData } from "@/utils/chartDataUtils";
import { standardizeScore } from "@/utils/countryChartDataUtils";
import { toast } from "sonner";

interface Statistics {
  mean: number;
  stdDev: number;
  count: number;
}

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
      
      // Get average scores and statistics if available
      const averageScores = (scores as any).averageScores;
      const hasAverageScores = averageScores && averageScores.size > 0;
      
      const countryYearStats = (scores as any).countryYearStats;
      const hasCountryStats = countryYearStats && countryYearStats.size > 0;
      
      if (standardized && !hasCountryStats && !hasAverageScores) {
        console.warn("Standardization requested but no country statistics or average scores available");
        toast.warning("Limited standardization - using estimated values");
      }
      
      // Process data with standardization flag
      const data = processChartData(scores, standardized);
      console.log("Processed data sample:", data.slice(0, 3));
      
      // Copy metadata to processed data for access in child components
      if (averageScores) {
        console.log("Attaching average scores to processed data");
        Object.defineProperty(data, 'averageScores', {
          value: averageScores,
          enumerable: false
        });
      }
      
      if (countryYearStats) {
        console.log("Attaching country-year stats to processed data");
        Object.defineProperty(data, 'countryYearStats', {
          value: countryYearStats,
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
