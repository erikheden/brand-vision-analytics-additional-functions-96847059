import { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BAR_COLOR } from '@/utils/constants';
import { calculatePerformanceDelta, calculatePerformancePercentage } from '@/utils/industry';

interface TrendComparisonWidgetProps {
  brandName: string;
  brandScore: number | undefined;
  industryAverage: number | undefined;
  brandsInIndustry?: number;
  year: number;
}

const TrendComparisonWidget = ({
  brandName,
  brandScore,
  industryAverage,
  brandsInIndustry = 0,
  year
}: TrendComparisonWidgetProps) => {
  const performanceDelta = useMemo(() => 
    calculatePerformanceDelta(brandScore, industryAverage),
    [brandScore, industryAverage]
  );
  
  const performancePercentage = useMemo(() => 
    calculatePerformancePercentage(brandScore, industryAverage),
    [brandScore, industryAverage]
  );
  
  const status = useMemo(() => {
    if (performanceDelta === null) return 'unknown';
    if (performanceDelta > 0.5) return 'outperforming';
    if (performanceDelta < -0.5) return 'underperforming';
    return 'average';
  }, [performanceDelta]);
  
  const statusInfo = useMemo(() => {
    switch (status) {
      case 'outperforming':
        return {
          icon: <TrendingUp className="h-5 w-5 text-green-600" />,
          label: 'Outperforming industry average',
          color: 'text-green-600'
        };
      case 'underperforming':
        return {
          icon: <TrendingDown className="h-5 w-5 text-amber-600" />,
          label: 'Below industry average',
          color: 'text-amber-600'
        };
      case 'average':
        return {
          icon: <Minus className="h-5 w-5 text-gray-600" />,
          label: 'At industry average',
          color: 'text-gray-600'
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-gray-400" />,
          label: 'Insufficient data',
          color: 'text-gray-400'
        };
    }
  }, [status]);
  
  return (
    <Card className="p-4 bg-[#f5f5f5] border border-[#E5DEFF] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Industry Comparison ({year})</div>
          <div className="font-semibold text-[#34502b]">{brandName}</div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 cursor-help">
                {statusInfo.icon}
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {performancePercentage !== null ? `${performancePercentage > 0 ? '+' : ''}${performancePercentage.toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white p-3 max-w-xs">
              <p className="text-sm text-gray-800">
                {statusInfo.label}
                {performanceDelta !== null && (
                  <>
                    <br/>
                    <span className="font-medium">Brand score: {brandScore?.toFixed(2)}</span>
                    <br/>
                    <span className="font-medium">Industry average: {industryAverage?.toFixed(2)}</span>
                    {brandsInIndustry > 0 && (
                      <>
                        <br/>
                        <span className="font-medium text-gray-600">
                          (Based on {brandsInIndustry} {brandsInIndustry === 1 ? 'brand' : 'brands'})
                        </span>
                      </>
                    )}
                    {performancePercentage !== null && (
                      <>
                        <br/>
                        <span className="font-medium">
                          {performancePercentage > 0 ? '+' : ''}
                          {performancePercentage.toFixed(2)}% vs. industry
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {industryAverage !== undefined && brandScore !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0</span>
            <span>Industry Avg: {industryAverage.toFixed(1)}</span>
            <span>100</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full relative">
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-gray-600 z-10"
              style={{ 
                left: `${Math.min(100, Math.max(0, (industryAverage / 100) * 100))}%` 
              }}
            />
            <div 
              className="h-full rounded-full relative"
              style={{ 
                width: `${Math.min(100, Math.max(0, (brandScore / 100) * 100))}%`,
                backgroundColor: status === 'outperforming' ? '#4ade80' : status === 'underperforming' ? '#f97316' : BAR_COLOR
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <div className="text-xs">
              <span className="font-medium text-[#34502b]">Brand: {brandScore.toFixed(1)}</span>
            </div>
            <div className="text-xs">
              <span className={`font-medium ${statusInfo.color}`}>
                {performanceDelta !== null ? (performanceDelta > 0 ? '+' : '') + performanceDelta.toFixed(1) + ' points' : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TrendComparisonWidget;
