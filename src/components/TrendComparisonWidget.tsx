
import { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BAR_COLOR } from '@/utils/constants';
import { calculatePerformanceDelta, getBrandIndustry } from '@/utils/industryAverageUtils';

interface TrendComparisonWidgetProps {
  brandName: string;
  brandScore: number | undefined;
  industryAverage: number | undefined;
  year: number;
}

const TrendComparisonWidget = ({
  brandName,
  brandScore,
  industryAverage,
  year
}: TrendComparisonWidgetProps) => {
  const performanceDelta = useMemo(() => 
    calculatePerformanceDelta(brandScore, industryAverage),
    [brandScore, industryAverage]
  );
  
  // Determine if the brand is outperforming, underperforming, or at industry average
  const status = useMemo(() => {
    if (performanceDelta === null) return 'unknown';
    if (performanceDelta > 0.5) return 'outperforming';
    if (performanceDelta < -0.5) return 'underperforming';
    return 'average';
  }, [performanceDelta]);
  
  // Get the appropriate icon and text based on status
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
                  {performanceDelta !== null ? performanceDelta.toFixed(2) : 'N/A'}
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
                  </>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {industryAverage !== undefined && (
          <div 
            className="h-full bg-[#34502b] rounded-full relative"
            style={{ 
              width: `${Math.min(100, Math.max(0, (brandScore || 0) / (industryAverage * 1.5) * 100))}%`,
              backgroundColor: BAR_COLOR
            }}
          >
            {industryAverage > 0 && (
              <div 
                className="absolute top-0 h-full w-0.5 bg-gray-600"
                style={{ 
                  left: `${Math.min(100, (industryAverage / (industryAverage * 1.5)) * 100)}%` 
                }}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrendComparisonWidget;
