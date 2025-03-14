
import { useMemo } from 'react';
import TrendComparisonWidget from './TrendComparisonWidget';
import { 
  calculateIndustryAverages, 
  getBrandIndustry, 
  normalizeIndustryName,
  calculatePerformancePercentage
} from '@/utils/industry';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrendComparisonContainerProps {
  scores: any[];
  selectedBrands: string[];
  comparisonYear: number;
}

const TrendComparisonContainer = ({
  scores,
  selectedBrands,
  comparisonYear
}: TrendComparisonContainerProps) => {
  // Get the full market data if available
  const marketData = Object.getOwnPropertyDescriptor(scores, 'marketData')?.value || scores;
  
  // Calculate industry averages using ALL brands, completely independent of selected brands
  // Using useMemo to prevent recalculation on every render
  const industryAverages = useMemo(() => {
    console.log("Recalculating industry averages with ALL brands");
    return calculateIndustryAverages(marketData, []);  // Passing empty array to ensure we don't filter by selected brands
  }, [marketData]);  // Only depend on marketData array, not on selectedBrands
  
  // Count number of brands per industry for the tooltip
  const brandsPerIndustry = useMemo(() => {
    const counts: Record<string, number> = {};
    const uniqueBrands = new Set<string>();
    
    marketData.forEach((score: any) => {
      if (score.industry && score.Year === comparisonYear) {
        // Normalize industry name
        const normalizedIndustry = normalizeIndustryName(score.industry);
        
        // Only count unique brands per industry
        const brandKey = `${score.Brand}-${normalizedIndustry}`;
        if (!uniqueBrands.has(brandKey)) {
          uniqueBrands.add(brandKey);
          
          if (!counts[normalizedIndustry]) {
            counts[normalizedIndustry] = 0;
          }
          counts[normalizedIndustry]++;
        }
      }
    });
    
    console.log("Brands per industry:", counts);
    return counts;
  }, [marketData, comparisonYear]);
  
  // Get the latest scores for each selected brand
  const brandScores = useMemo(() => {
    return selectedBrands.map(brand => {
      const brandScores = scores
        .filter(score => score.Brand === brand && score.Year === comparisonYear)
        .map(score => ({
          brand,
          score: score.Score,
          year: score.Year,
          industry: score.industry ? normalizeIndustryName(score.industry) : null
        }));
      
      return brandScores[0] || null;
    }).filter(Boolean);
  }, [scores, selectedBrands, comparisonYear]);
  
  if (brandScores.length === 0) {
    return null;
  }
  
  // Debug display to show industry names and averages
  console.log("Industries in data:", [...new Set(marketData.map((s: any) => s.industry))]);
  console.log("Normalized industries:", [...new Set(marketData.map((s: any) => s.industry ? normalizeIndustryName(s.industry) : null))]);
  console.log("Industry averages for year:", industryAverages[comparisonYear]);
  
  // Calculate performance percentages and sort brandScores by percentage (highest to lowest)
  const sortedBrandScores = [...brandScores].sort((a, b) => {
    const industryA = a.industry;
    const industryB = b.industry;
    
    const industryAverageA = industryA && industryAverages[comparisonYear] ? 
      industryAverages[comparisonYear][industryA] : undefined;
    
    const industryAverageB = industryB && industryAverages[comparisonYear] ? 
      industryAverages[comparisonYear][industryB] : undefined;
    
    const percentageA = calculatePerformancePercentage(a.score, industryAverageA) || 0;
    const percentageB = calculatePerformancePercentage(b.score, industryAverageB) || 0;
    
    return percentageB - percentageA; // Sort by highest to lowest
  });
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="text-white font-medium">Industry Comparison ({comparisonYear})</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-white/70 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="bg-white p-3 max-w-xs">
              <p>These widgets show how each brand's sustainability score compares to its industry average. 
              The percentage shows how much better or worse a brand performs compared to others in the same industry.
              The horizontal bar shows the actual score on a scale of 0-100, with the industry average marked by a vertical line.
              <br /><br />
              <strong>Note:</strong> Industry averages are calculated using <em>all</em> brands in the database for each industry, not just the selected ones.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {sortedBrandScores.map(brandScore => {
          if (!brandScore) return null;
          
          const industry = brandScore.industry;
          const industryAverage = industry && industryAverages[comparisonYear] ? 
            industryAverages[comparisonYear][industry] : undefined;
          
          const brandsInIndustry = industry ? brandsPerIndustry[industry] || 0 : 0;
          
          return (
            <TrendComparisonWidget
              key={brandScore.brand}
              brandName={brandScore.brand}
              brandScore={brandScore.score}
              industryAverage={industryAverage}
              brandsInIndustry={brandsInIndustry}
              year={comparisonYear}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TrendComparisonContainer;
