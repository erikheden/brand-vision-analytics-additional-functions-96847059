import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getBrandColors } from "@/utils/chartDataUtils";

interface BrandChartProps {
  chartData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
}

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig }: BrandChartProps) => {
  const brandColors = getBrandColors();

  // Custom tooltip formatter with improved type safety and error handling
  const tooltipFormatter = (value: any, name: string, props: any) => {
    try {
      // Ensure we have valid props and payload
      if (!props?.payload || !Array.isArray(props.payload) || props.payload.length === 0) {
        return [value, name];
      }

      // Create a copy of the payload array and sort it
      const sortedPayload = [...props.payload].sort((a, b) => {
        // Ensure we're dealing with valid payload items
        if (!a || !b) return 0;
        
        const scoreA = typeof a.value === 'number' ? a.value : 0;
        const scoreB = typeof b.value === 'number' ? b.value : 0;
        return scoreB - scoreA;
      });
      
      // Find the index of the current item in the sorted array
      const currentIndex = sortedPayload.findIndex(item => item?.name === name);
      
      // Return the value with the sorted order
      return [
        value, 
        name, 
        { ...props, payload: sortedPayload, dataKey: currentIndex >= 0 ? currentIndex : undefined }
      ];
    } catch (error) {
      // Fallback to original values if any error occurs
      console.error('Error in tooltip formatter:', error);
      return [value, name];
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[500px] w-full">
      <LineChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="year" 
          domain={[yearRange.earliest, yearRange.latest]}
          style={{ fontFamily: 'Forma DJR Display' }}
        />
        <YAxis style={{ fontFamily: 'Forma DJR Display' }} />
        <ChartTooltip 
          content={<ChartTooltipContent />}
          formatter={tooltipFormatter}
        />
        <Legend 
          wrapperStyle={{ 
            fontFamily: 'Forma DJR Display',
            paddingTop: '20px'
          }}
        />
        {selectedBrands.map((brand, index) => (
          <Line
            key={brand}
            type="monotone"
            dataKey={brand}
            stroke={brandColors[index % brandColors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            connectNulls={true}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export default BrandChart;