
import React from 'react';
import TrendComparisonWidget from './TrendComparisonWidget';
import { BrandScore } from '@/hooks/useBrandScores';

interface TrendComparisonGridProps {
  brandScores: BrandScore[];
  industryAverages: Record<number, Record<string, number>>;
  brandsPerIndustry: Record<string, number>;
  comparisonYear: number;
}

const TrendComparisonGrid = ({
  brandScores,
  industryAverages,
  brandsPerIndustry,
  comparisonYear
}: TrendComparisonGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {brandScores.map(brandScore => {
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
  );
};

export default TrendComparisonGrid;
