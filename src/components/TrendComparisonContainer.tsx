
import React from 'react';
import { useIndustryAverages } from '@/hooks/useIndustryAverages';
import { useBrandsPerIndustry } from '@/hooks/useBrandsPerIndustry';
import { useBrandScores } from '@/hooks/useBrandScores';
import TrendComparisonHeader from './TrendComparisonHeader';
import TrendComparisonGrid from './TrendComparisonGrid';

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
  
  // Calculate industry averages
  const industryAverages = useIndustryAverages(marketData);
  
  // Count brands per industry
  const brandsPerIndustry = useBrandsPerIndustry(marketData, comparisonYear);
  
  // Get and sort brand scores
  const sortedBrandScores = useBrandScores(scores, selectedBrands, comparisonYear, industryAverages);
  
  if (sortedBrandScores.length === 0) {
    return null;
  }
  
  // Debug display to show industry names and averages
  console.log("Industries in data:", [...new Set(marketData.map((s: any) => s.industry))]);
  console.log("Normalized industries:", [...new Set(marketData.map((s: any) => s.industry ? normalizeIndustryName(s.industry) : null))]);
  console.log("Industry averages for year:", industryAverages[comparisonYear]);
  
  return (
    <div className="space-y-2">
      <TrendComparisonHeader comparisonYear={comparisonYear} />
      <TrendComparisonGrid 
        brandScores={sortedBrandScores}
        industryAverages={industryAverages}
        brandsPerIndustry={brandsPerIndustry}
        comparisonYear={comparisonYear}
      />
    </div>
  );
};

// Import needed for debug logging
import { normalizeIndustryName } from '@/utils/industry/industryNormalization';

export default TrendComparisonContainer;
