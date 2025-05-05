
import { useMemo } from 'react';

const useInsightsGenerator = (
  processedData: Record<string, Record<string, Record<string, number>>>,
  selectedCategories: string[],
  selectedYear: number | null,
  selectedLevels: string[]
) => {
  // Generate insights based on the data
  const insightText = useMemo(() => {
    if (!selectedCategories.length || !selectedYear || !processedData) {
      return "Select categories and filters to see insights";
    }

    if (selectedCategories.length === 1) {
      const category = selectedCategories[0];
      const yearData = processedData[category]?.[selectedYear];
      if (!yearData) return "No data available for the selected year";
      
      // Find the highest impact level
      let highestLevel = '';
      let highestValue = 0;
      
      Object.entries(yearData).forEach(([level, value]) => {
        if (selectedLevels.includes(level) && value > highestValue) {
          highestValue = value;
          highestLevel = level;
        }
      });
      
      if (highestLevel) {
        return `${Math.round(highestValue * 100)}% of consumers show "${highestLevel}" level of engagement with ${category} sustainability. Focus your communication strategy on highlighting your brand's ${category} sustainability credentials.`;
      }
    } else if (selectedCategories.length > 1) {
      return `Comparing ${selectedCategories.length} categories helps identify which sustainability aspects are most important to consumers. Focus your strategy on categories with higher "Willing to pay" levels.`;
    }
    
    return "Select categories and filters to see insights";
  }, [processedData, selectedCategories, selectedYear, selectedLevels]);
  
  // Generate recommendations based on the selected data
  const recommendations = useMemo(() => {
    if (!selectedCategories.length || !selectedYear || !processedData) {
      return [];
    }
    
    const recs = [];
    
    if (selectedLevels.includes("Willing to pay") && selectedCategories.length > 0) {
      recs.push("Focus product development on sustainability aspects that consumers are willing to pay for.");
    }
    
    if (selectedLevels.includes("Aware") && selectedLevels.includes("Concerned")) {
      recs.push("There's an opportunity to convert consumer awareness into action through education and engagement.");
    }
    
    if (selectedCategories.length > 1) {
      recs.push("Develop an integrated sustainability strategy across categories to maximize impact.");
    }
    
    return recs.length > 0 ? recs : ["Select more data points to generate strategic recommendations."];
  }, [processedData, selectedCategories, selectedYear, selectedLevels]);

  return { insightText, recommendations };
};

export default useInsightsGenerator;
