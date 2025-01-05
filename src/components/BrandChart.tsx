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

  // Custom tooltip formatter to sort by score
  const tooltipFormatter = (value: any, name: string, props: any) => {
    const payload = props.payload;
    // Sort the payload items by score in descending order
    const sortedPayload = [...payload].sort((a, b) => {
      const scoreA = a.value || 0;
      const scoreB = b.value || 0;
      return scoreB - scoreA;
    });
    
    // Find the index of the current item in the sorted array
    const currentIndex = sortedPayload.findIndex(item => item.name === name);
    
    // Return the value with the sorted order
    return [value, name, { ...props, payload: sortedPayload, dataKey: currentIndex }];
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