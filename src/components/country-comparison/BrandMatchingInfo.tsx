
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useMultiCountryChartData } from "@/hooks/useMultiCountryChartData";

interface BrandMatchingInfoProps {
  selectedCountries: string[];
  selectedBrands: string[];
}

const BrandMatchingInfo = ({ 
  selectedCountries,
  selectedBrands 
}: BrandMatchingInfoProps) => {
  const { data: chartData, isLoading } = useMultiCountryChartData(
    selectedCountries,
    selectedBrands
  );

  if (isLoading || !chartData) {
    return null;
  }

  // Count results by match type
  const matchCounts: Record<string, number> = {
    exact: 0,
    normalized: 0,
    partial: 0,
    special: 0,
    average: 0,
    missing: 0
  };
  
  // Process the chart data to count match types
  Object.values(chartData).forEach(countryData => {
    const processedBrands = new Set<string>();
    
    countryData.forEach(dataPoint => {
      if (dataPoint.isMarketAverage) return; // Skip market averages
      
      const brandKey = `${dataPoint.Brand}-${dataPoint.Country}`;
      if (processedBrands.has(brandKey)) return;
      
      processedBrands.add(brandKey);
      
      if (dataPoint.matchType) {
        matchCounts[dataPoint.matchType]++;
      }
    });
  });
  
  // Calculate missing matches (brands with no data in any country)
  const totalBrandCountries = selectedBrands.length * selectedCountries.length;
  const totalMatches = Object.values(matchCounts).reduce((sum, count) => sum + count, 0);
  matchCounts.missing = totalBrandCountries - totalMatches;
  
  // Only show this component if we have any non-exact matches or missing data
  if (matchCounts.normalized === 0 && 
      matchCounts.partial === 0 && 
      matchCounts.special === 0 && 
      matchCounts.missing === 0) {
    return null;
  }
  
  return (
    <Alert className="bg-amber-50 border-amber-200">
      <Info className="h-5 w-5 text-amber-500" />
      <AlertTitle className="text-amber-800 text-sm font-medium ml-2">
        Brand Matching Information
      </AlertTitle>
      <AlertDescription className="ml-7 text-sm text-amber-700">
        <p className="mb-1">Some brands were matched using alternative methods:</p>
        <ul className="list-disc pl-5 space-y-1">
          {matchCounts.normalized > 0 && (
            <li>
              <span className="font-medium">{matchCounts.normalized}</span> matched by normalized name
              <span className="text-xs ml-1 text-amber-600">(e.g., "McDonald's" → "McDonalds")</span>
            </li>
          )}
          {matchCounts.partial > 0 && (
            <li>
              <span className="font-medium">{matchCounts.partial}</span> matched by partial name
              <span className="text-xs ml-1 text-amber-600">(e.g., "BMW" → "BMW Group")</span>
            </li>
          )}
          {matchCounts.special > 0 && (
            <li>
              <span className="font-medium">{matchCounts.special}</span> matched using special name variants
              <span className="text-xs ml-1 text-amber-600">(e.g., "H&M" → "H and M")</span>
            </li>
          )}
          {matchCounts.missing > 0 && (
            <li className="text-amber-800">
              <span className="font-medium">{matchCounts.missing}</span> brand-country combinations have no available data
            </li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default BrandMatchingInfo;
