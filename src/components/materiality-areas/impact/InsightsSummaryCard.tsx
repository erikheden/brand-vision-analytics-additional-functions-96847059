
import React from 'react';
import { Card } from '@/components/ui/card';
import { useSustainabilityImpactData } from '@/hooks/useSustainabilityImpactData';
import { Earth, MessageSquare, TrendingUp } from 'lucide-react';
import { useImpactCategories } from '@/hooks/useImpactCategories';

interface InsightsSummaryCardProps {
  selectedCountries: string[];
}

const InsightsSummaryCard: React.FC<InsightsSummaryCardProps> = ({
  selectedCountries
}) => {
  const {
    data,
    categories,
    impactLevels,
    isLoading,
    error,
    countryDataMap
  } = useImpactCategories(selectedCountries);

  // Generate insights based on the data
  const insights = React.useMemo(() => {
    if (isLoading || !countryDataMap || Object.keys(countryDataMap).length === 0) {
      return [];
    }

    const results = [];
    
    // Find top categories with highest impact
    if (selectedCountries.length > 0 && categories.length > 0) {
      const country = selectedCountries[0];
      const countryData = countryDataMap[country];
      
      if (countryData && countryData.processedData) {
        // Find category with highest "willing to pay" value
        let topCategory = '';
        let topValue = 0;
        
        for (const category of categories) {
          const catData = countryData.processedData[category];
          if (!catData) continue;
          
          const latestYear = Object.keys(catData).sort().pop();
          if (!latestYear) continue;
          
          // Look for "Willing to pay" or highest impact level
          const willingToPay = catData[latestYear]['Willing to pay'] ?? 0;
          if (willingToPay > topValue) {
            topValue = willingToPay;
            topCategory = category;
          }
        }
        
        if (topCategory) {
          results.push({
            title: `Key Priority: ${topCategory}`,
            description: `${topCategory} has the highest level of consumer willingness to pay for sustainability (${Math.round(topValue * 100)}%), making it a key opportunity area.`,
            icon: TrendingUp
          });
        }
      }
    }
    
    // Add insights about multi-country comparison if relevant
    if (selectedCountries.length > 1) {
      results.push({
        title: "Market Comparison",
        description: `Compare ${selectedCountries.length} markets to identify regional differences in sustainability priorities and align your global strategy accordingly.`,
        icon: Earth
      });
    }
    
    // Add general action insight
    results.push({
      title: "Communication Strategy",
      description: "Focus your sustainability messaging on categories where consumers show high awareness and willingness to pay, highlighting tangible benefits.",
      icon: MessageSquare
    });
    
    return results;
  }, [countryDataMap, selectedCountries, categories, isLoading]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10">Loading insights...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-red-500">Error loading insights data</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h2 className="text-xl font-medium text-[#34502b] mb-4">Key Insights</h2>
        
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, idx) => (
              <Card key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border border-[#34502b]/10">
                <div className="flex gap-4">
                  <div className="bg-[#34502b]/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                    <insight.icon className="h-6 w-6 text-[#34502b]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#34502b]">{insight.title}</h3>
                    <p className="text-gray-600 text-sm">{insight.description}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>Select more data to generate insights</p>
            </div>
          )}
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <h2 className="text-xl font-medium text-[#34502b] mb-4">How to Apply These Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-[#34502b]/10">
            <h3 className="font-medium text-[#34502b] mb-2">Marketing Strategy</h3>
            <p className="text-gray-600 text-sm">
              Align your marketing campaigns with the sustainability factors that consumers are most aware of and willing to pay for.
              Highlight your brand's commitment to the top-rated sustainability areas.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-[#34502b]/10">
            <h3 className="font-medium text-[#34502b] mb-2">Product Development</h3>
            <p className="text-gray-600 text-sm">
              Prioritize sustainability features in products based on consumer willingness to pay. 
              Develop offerings that address the sustainability concerns that matter most to your target audience.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-[#34502b]/10">
            <h3 className="font-medium text-[#34502b] mb-2">Communication</h3>
            <p className="text-gray-600 text-sm">
              Craft messaging that resonates with specific market sensitivities. Focus on educating consumers in markets with high awareness but low action.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-[#34502b]/10">
            <h3 className="font-medium text-[#34502b] mb-2">Market Entry</h3>
            <p className="text-gray-600 text-sm">
              When entering new markets, adjust your sustainability messaging based on local priorities and awareness levels shown in the data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InsightsSummaryCard;
