
import { useMemo } from 'react';
import TrendComparisonWidget from './TrendComparisonWidget';
import { calculateIndustryAverages, getBrandIndustry } from '@/utils/industryAverageUtils';
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
  // Calculate industry averages for all years and industries
  const industryAverages = useMemo(() => 
    calculateIndustryAverages(scores, selectedBrands), 
    [scores, selectedBrands]
  );
  
  // Get the latest scores for each selected brand
  const brandScores = useMemo(() => {
    return selectedBrands.map(brand => {
      const brandScores = scores
        .filter(score => score.Brand === brand && score.Year === comparisonYear)
        .map(score => ({
          brand,
          score: score.Score,
          year: score.Year,
          industry: score.industry
        }));
      
      return brandScores[0] || null;
    }).filter(Boolean);
  }, [scores, selectedBrands, comparisonYear]);
  
  if (brandScores.length === 0) {
    return null;
  }
  
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
              The horizontal bar shows the actual score on a scale of 0-100, with the industry average marked by a vertical line.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {brandScores.map(brandScore => {
          if (!brandScore) return null;
          
          const industry = brandScore.industry;
          const industryAverage = industry && industryAverages[comparisonYear] ? 
            industryAverages[comparisonYear][industry] : undefined;
            
          return (
            <TrendComparisonWidget
              key={brandScore.brand}
              brandName={brandScore.brand}
              brandScore={brandScore.score}
              industryAverage={industryAverage}
              year={comparisonYear}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TrendComparisonContainer;
