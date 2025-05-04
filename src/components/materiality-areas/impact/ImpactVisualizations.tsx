
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImpactCategoryChart from './charts/ImpactCategoryChart';
import ImpactCountryComparison from './ImpactCountryComparison';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ImpactVisualizationsProps {
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  selectedLevels: string[];
  isLoading: boolean;
  error: Error | null;
  activeCountries: string[];
  countryDataMap?: Record<string, any>;
}

const ImpactVisualizations: React.FC<ImpactVisualizationsProps> = ({
  processedData,
  selectedCategories,
  selectedYear,
  selectedLevels,
  isLoading,
  error,
  activeCountries,
  countryDataMap
}) => {
  const [activeTab, setActiveTab] = useState<string>("category");
  
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

  // Extract years from the data
  const years = React.useMemo(() => {
    if (!processedData || Object.keys(processedData).length === 0) return [];
    
    const yearsSet = new Set<number>();
    
    Object.values(processedData).forEach(categoryData => {
      Object.keys(categoryData).forEach(year => {
        yearsSet.add(Number(year));
      });
    });
    
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [processedData]);

  // Extract impact levels from the data
  const impactLevels = React.useMemo(() => {
    if (!processedData || Object.keys(processedData).length === 0) return [];
    
    const levelsSet = new Set<string>();
    
    Object.values(processedData).forEach(categoryData => {
      Object.values(categoryData).forEach(yearData => {
        Object.keys(yearData).forEach(level => {
          levelsSet.add(level);
        });
      });
    });
    
    return Array.from(levelsSet);
  }, [processedData]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#34502b] mb-2">Sustainability Impact Analysis</h3>
          <p className="text-gray-600 text-sm">
            Explore impact data by category or compare across countries.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#34502b]/10">
            <TabsTrigger 
              value="category" 
              className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
            >
              Category View
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              disabled={selectedCategories.length === 0 || !selectedYear}
            >
              Trends
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              disabled={activeCountries.length <= 1 || selectedCategories.length === 0 || !selectedYear}
            >
              Country Comparison
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="category" className="mt-0">
            <ImpactCategoryChart 
              data={filteredData}
              selectedYear={selectedYear}
              selectedLevels={selectedLevels}
            />
          </TabsContent>
          
          <TabsContent value="trends" className="mt-0">
            {selectedCategories.length > 0 && selectedYear ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-[#34502b]">Trends View</h3>
                <p className="text-gray-600 mt-2">
                  Track how sustainability impact has changed over time.
                </p>
                <p className="text-sm text-[#34502b] mt-6">Coming soon</p>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Please select categories and a year to view trend data.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-0">
            {activeCountries.length > 1 && selectedCategories.length > 0 && selectedYear ? (
              <ImpactCountryComparison 
                processedData={processedData}
                selectedCategories={selectedCategories}
                selectedYear={selectedYear}
                years={years}
                impactLevels={impactLevels}
                activeCountries={activeCountries}
              />
            ) : (
              <div className="text-center py-10 text-gray-500">
                Please select at least two countries and one category to compare data.
              </div>
            )}
          </TabsContent>
        </Tabs>
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
