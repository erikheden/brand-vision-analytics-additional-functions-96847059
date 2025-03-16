
import { Text } from "recharts";
import { FONT_FAMILY } from "@/utils/constants";

interface AxisLabelProps {
  x?: number;
  y?: number;
  textAnchor?: string;
  children: React.ReactNode;
}

export const AxisLabel = ({ x = 0, y = 0, textAnchor = "middle", children }: AxisLabelProps) => {
  return (
    <Text 
      x={x} 
      y={y} 
      textAnchor={textAnchor} 
      verticalAnchor="middle" 
      style={{ 
        fontFamily: FONT_FAMILY, 
        fontSize: '14px', 
        fill: '#34502b',
        fontWeight: 500
      }}
    >
      {children}
    </Text>
  );
};
