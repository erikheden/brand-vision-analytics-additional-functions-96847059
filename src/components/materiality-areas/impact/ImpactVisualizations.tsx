
import React from 'react';
import { Card } from '@/components/ui/card';
import ImpactCategoryChart from './charts/ImpactCategoryChart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ImpactVisualizationsProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  selectedLevels: string[];
  isLoading: boolean;
  error: Error | null;
}

const ImpactVisualizations: React.FC<ImpactVisualizationsProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  selectedLevels,
  isLoading,
  error
}) => {
  // Filter processedData to only include selected categories
  const filteredData = React.useMemo(() => {
    if (!selectedCategories.length || !processedData) return processedData;
    
    return Object.entries(processedData)
      .filter(([category]) => selectedCategories.includes(category))
      .reduce((acc, [category, data]) => {
        acc[category] = data;
        return acc;
      }, {} as Record<string, Record<string, Record<string, number>>>);
  }, [processedData, selectedCategories]);

  // Generate insights based on the data
  const insightText = React.useMemo(() => {
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
  const recommendations = React.useMemo(() => {
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

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#34502b] mb-2">Sustainability Impact Analysis</h3>
          <p className="text-gray-600 text-sm">
            This chart shows how consumers engage with sustainability across different categories and impact levels.
          </p>
        </div>
        
        <ImpactCategoryChart 
          data={filteredData}
          selectedYear={selectedYear}
          selectedLevels={selectedLevels}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-[#34502b] mb-2">Key Insights</h3>
          <p className="text-gray-600 text-sm">
            {insightText}
          </p>
        </Card>
        
        <Card className="p-4 bg-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-[#34502b] mb-2">Recommendations</h3>
          <ul className="text-gray-600 text-sm space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex gap-2">
                <span>•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      
      <Alert className="bg-white border border-[#34502b]/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-gray-600 text-sm">
          <strong>Understanding impact levels:</strong> "Aware" indicates basic recognition, "Concerned" shows engagement, and "Willing to pay" represents the strongest commitment to sustainability.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default React.memo(ImpactVisualizations);
