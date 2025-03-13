
import { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { calculateYearOverYearGrowth } from '@/utils/industryAverageUtils';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, ReferenceLine, Tooltip as RechartsTooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface GrowthRateChartProps {
  scores: any[];
  selectedBrands: string[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
        <p className="font-semibold text-[#34502b]">{`${data.brand} (${label})`}</p>
        <p className="text-sm">
          <span className="font-medium">Growth rate:</span> {data.growthRate.toFixed(2)}%
        </p>
        {data.isProjected && (
          <p className="text-xs italic text-gray-500 mt-1">* Projected data</p>
        )}
      </div>
    );
  }
  return null;
};

const GrowthRateChart = ({ scores, selectedBrands }: GrowthRateChartProps) => {
  // Format the data for the chart
  const chartData = useMemo(() => {
    if (!selectedBrands.length) return [];
    
    // Get growth rates for each brand
    const allGrowthRates = selectedBrands.flatMap(brand => {
      const brandGrowthRates = calculateYearOverYearGrowth(scores, brand);
      return brandGrowthRates.map(item => ({
        ...item,
        brand,
      }));
    });
    
    // Group by year
    const groupedByYear = allGrowthRates.reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) {
        acc[year] = { year };
      }
      // Use brand name as the key for the growth rate
      acc[year][item.brand] = item.growthRate;
      // Store isProjected value
      acc[year][`${item.brand}_projected`] = item.isProjected;
      
      return acc;
    }, {} as Record<number, any>);
    
    // Convert to array sorted by year
    return Object.values(groupedByYear).sort((a, b) => a.year - b.year);
  }, [scores, selectedBrands]);
  
  // Generate colors for each brand
  const brandColors = useMemo(() => {
    const colors = ['#7c9457', '#dd8c57', '#6ec0dc', '#34502b', '#09657b', '#b7c895', '#dadada', '#f0d2b0', '#bce2f3', '#1d1d1b'];
    return Object.fromEntries(
      selectedBrands.map((brand, idx) => [brand, colors[idx % colors.length]])
    );
  }, [selectedBrands]);
  
  if (chartData.length === 0) {
    return null;
  }
  
  return (
    <Card className="p-6 bg-[#f5f5f5] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[#34502b] font-medium text-lg">Year-Over-Year Growth Rates</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-[#34502b]/70 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="bg-white p-3 max-w-xs">
              <p>This chart shows the percentage change in sustainability scores from year to year. 
              Positive values indicate improvement, while negative values show decline.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: '#34502b' }}
              tickLine={{ stroke: '#34502b' }}
            />
            <YAxis 
              label={{ 
                value: 'Growth Rate (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#34502b' }
              }}
              tick={{ fill: '#34502b' }}
              tickLine={{ stroke: '#34502b' }}
            />
            <ReferenceLine y={0} stroke="#34502b" strokeWidth={1} />
            <RechartsTooltip content={<CustomTooltip />} />
            
            {selectedBrands.map((brand, index) => (
              <Bar 
                key={brand} 
                dataKey={brand} 
                name={brand}
                fill={brandColors[brand]}
                radius={[4, 4, 0, 0]}
              >
                <LabelList 
                  dataKey={brand} 
                  position="top" 
                  formatter={(value: any) => (value !== null && value !== undefined) ? `${value.toFixed(1)}%` : ''}
                  style={{ fill: '#34502b', fontSize: '10px' }}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {selectedBrands.map(brand => (
          <div key={brand} className="flex items-center gap-1">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: brandColors[brand] }}
            ></span>
            <span className="text-sm text-[#34502b]">{brand}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GrowthRateChart;
