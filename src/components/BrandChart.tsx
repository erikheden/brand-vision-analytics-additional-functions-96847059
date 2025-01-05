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

  // Custom tooltip formatter with color coding and proper sorting
  const tooltipFormatter = (value: number, name: string, props: any) => {
    try {
      if (!props?.payload?.[0]?.payload) {
        return [value, name];
      }

      // Get all brand values for the current year
      const yearData = props.payload[0].payload;
      
      // Create array of brand-value pairs for sorting
      const brandValues = selectedBrands.map((brand, index) => ({
        brand,
        value: yearData[brand] || 0,
        color: brandColors[index % brandColors.length]
      }));

      // Sort brands by value in descending order
      const sortedBrands = brandValues.sort((a, b) => b.value - a.value);
      
      // Find position of current brand in sorted list
      const currentBrandIndex = sortedBrands.findIndex(item => item.brand === name);
      
      // Return formatted value with color and position information
      return [
        value,
        name,
        {
          color: brandColors[selectedBrands.indexOf(name) % brandColors.length],
          position: currentBrandIndex
        }
      ];
    } catch (error) {
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
          wrapperStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px'
          }}
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