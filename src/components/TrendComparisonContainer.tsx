
import { useMemo } from 'react';
import TrendComparisonWidget from './TrendComparisonWidget';
import { calculateIndustryAverages, getBrandIndustry } from '@/utils/industryAverageUtils';

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
  );
};

export default TrendComparisonContainer;
