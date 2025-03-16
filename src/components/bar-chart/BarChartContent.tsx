
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { ChartTooltip } from "@/components/ChartTooltip";
import { getBrandColor } from "@/utils/countryChartDataUtils";
import { FONT_FAMILY } from "@/utils/constants";
import { AxisLabel } from "./AxisLabel";

interface BarChartContentProps {
  chartData: any[];
  yAxisDomain: [number, number];
  selectedBrands: string[];
  standardized: boolean;
}

export const BarChartContent = ({
  chartData,
  yAxisDomain,
  selectedBrands,
  standardized
}: BarChartContentProps) => {
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        barGap={2}
        barSize={36}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={false} />
        <XAxis 
          dataKey="country" 
          style={{ 
            fontFamily: FONT_FAMILY,
            fontSize: '12px',
            color: '#34502b'
          }}
          tickMargin={10}
        />
        <YAxis 
          domain={yAxisDomain}
          tickFormatter={(value) => standardized ? `${value.toFixed(0)}σ` : value.toFixed(0)}
          style={{ 
            fontFamily: FONT_FAMILY,
            fontSize: '12px',
            color: '#34502b'
          }}
          tickCount={7}
          axisLine={true}
          label={
            <AxisLabel
              x={-35}
              y={230}
              textAnchor="middle"
              angle={-90}
            >
              Score
            </AxisLabel>
          }
        />
        <Tooltip content={<ChartTooltip standardized={standardized} />} />
        <Legend 
          wrapperStyle={{ 
            paddingTop: 20,
            fontFamily: FONT_FAMILY 
          }}
        />
        {standardized && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
        
        {selectedBrands.map((brand) => (
          <Bar 
            key={brand} 
            dataKey={brand} 
            fill={getBrandColor(brand)} 
            name={brand}
            fillOpacity={0.9}
            radius={[3, 3, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
